#!/usr/bin/env bash
# Check all links on saburto.com by pulling URLs from the sitemap,
# then scanning each page for additional links (tags, externals, cross-refs).
# Usage: ./scripts/check-links.sh
set -euo pipefail

SITEMAP_URL="https://www.saburto.com/sitemap.xml"
TIMEOUT=10
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0
CHECKED=()  # track already-checked URLs to avoid duplicates

checked_before() {
  for u in "${CHECKED[@]}"; do
    [[ "$u" == "$1" ]] && return 0
  done
  return 1
}

check_url() {
  local url="$1"
  local label="${2:-}"

  if checked_before "$url"; then
    return
  fi
  CHECKED+=("$url")

  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "000")

  if [ "$status" = "200" ]; then
    echo -e "  ${GREEN}✓${NC} $status  $url"
    ((PASS++)) || true
  elif [ "$status" = "999" ]; then
    echo -e "  ${YELLOW}⚠${NC} $status  $url  (blocked curl, likely OK)"
    ((SKIP++)) || true
  else
    echo -e "  ${RED}✗${NC} $status  $url  ${label}"
    ((FAIL++)) || true
  fi
}

# Extract <a href> links from an HTML page
extract_links() {
  local html="$1"
  local base="$2"

  # Match href="..." or href='...' — grab the URL
  echo "$html" | grep -oPi 'href=["'\'']\K[^"'\''#]+' | while read -r path; do
    # Resolve relative URLs
    if [[ "$path" =~ ^https?:// ]]; then
      echo "$path"
    elif [[ "$path" =~ ^// ]]; then
      echo "https:$path"
    elif [[ "$path" =~ ^/ ]]; then
      echo "${base}${path}"
    else
      echo "${base}/${path}"
    fi
  done | sort -u
}

echo "============================================"
echo " Link Checker for saburto.com"
echo "============================================"
echo ""

# ── Step 1: Fetch sitemap and extract all page URLs ──
echo -e "${YELLOW}[Fetching sitemap]${NC} $SITEMAP_URL"
SITEMAP=$(curl -sL --max-time "$TIMEOUT" "$SITEMAP_URL" 2>/dev/null)

if [ -z "$SITEMAP" ]; then
  echo -e "${RED}Failed to fetch sitemap${NC}"
  exit 1
fi

# Extract <loc> values
mapfile -t PAGE_URLS < <(echo "$SITEMAP" | grep -oP '<loc>\K[^<]+' | sort -u)

echo -e "  Found ${#PAGE_URLS[@]} pages in sitemap"
echo ""

# ── Step 2: Check all sitemap URLs ──
echo -e "${YELLOW}[Sitemap Pages]${NC}"
for url in "${PAGE_URLS[@]}"; do
  check_url "$url"
done
echo ""

# ── Step 3: For each blog post, extract and check sub-links ──
echo -e "${YELLOW}[Links from Blog Posts]${NC}"

BASE="https://www.saburto.com"

for url in "${PAGE_URLS[@]}"; do
  # Only scan blog post pages for sub-links
  if [[ "$url" != */blog/* ]]; then
    continue
  fi

  html=$(curl -sL --max-time "$TIMEOUT" "$url" 2>/dev/null || true)
  if [ -z "$html" ]; then
    continue
  fi

  # Extract links from the page. Filter out nav links, self-links,
  # and infrastructure URLs (fonts, assets, preconnects).
  sub_links=$(extract_links "$html" "$BASE" \
    | grep -v "^${BASE}/\?$" \
    | grep -v "^${BASE}/projects$\|^${BASE}/about/\?$\|^${BASE}/rss.xml$\|^${BASE}/tags/\?$" \
    | grep -v "github.com/saburto$\|linkedin.com" \
    | grep -v "fonts.googleapis.com$\|fonts.gstatic.com$" \
    | grep -v "^${BASE}/_astro/\|^${BASE}/favicon")

  if [ -n "$sub_links" ]; then
    while IFS= read -r link; do
      [ -z "$link" ] && continue
      check_url "$link" "(from $(basename "$url"))"
    done <<< "$sub_links"
  fi
done
echo ""

# ── Step 4: Check hardcoded external links we know should work ──
echo -e "${YELLOW}[Known External Links]${NC}"
check_url "https://github.com/saburto"
check_url "https://www.linkedin.com/in/saburto/"
echo ""

# ── Summary ───────────────────────────────────
echo "============================================"
echo -e " Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}, ${YELLOW}$SKIP skipped${NC}"
echo "  (${#CHECKED[@]} unique URLs checked)"
echo "============================================"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
