#!/usr/bin/env bash
# Download an image from Wikimedia Commons, convert to WebP, and place in src/assets/
# Usage: ./download.sh <wikimedia-commons-url> [output-name]
# Must be run from the project root (containing package.json).

set -euo pipefail

WIKI_URL="$1"
OUTPUT_NAME="${2:-}"

# Resolve project root: script lives at .pi/skills/wikimedia-image/download.sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "→ Project root: $PROJECT_ROOT"

# Extract the filename: strip "File:" prefix if present (Wikimedia URLs use File: prefix)
RAW_FILENAME=$(basename "$WIKI_URL" | sed 's/[?#].*//')
WIKI_FILENAME="${RAW_FILENAME#File:}"

echo "→ Fetching Wikimedia page for $RAW_FILENAME..."
PAGE_HTML=$(curl -sL --max-time 15 -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" "$WIKI_URL")

# Direct upload URL pattern: https://upload.wikimedia.org/wikipedia/commons/X/XX/FILENAME
DIRECT_URL=$(echo "$PAGE_HTML" | grep -oP 'https://upload\.wikimedia\.org/wikipedia/commons/[a-f0-9]/[a-f0-9]{2}/'"$WIKI_FILENAME" | head -1)

# Fallback: contentUrl from JSON-LD
if [ -z "$DIRECT_URL" ]; then
  echo "→ Trying JSON-LD fallback..."
  DIRECT_URL=$(echo "$PAGE_HTML" | grep -oP '"contentUrl"\s*:\s*"https://upload\.wikimedia\.org/wikipedia/commons/[^"]+\.(png|jpg|jpeg|gif|svg)"' | grep -oP 'https://[^"]+' | head -1)
fi

if [ -z "$DIRECT_URL" ]; then
  echo "ERROR: Could not extract direct upload URL from the Wikimedia page."
  echo "Check that the URL points to a valid Wikimedia Commons file page."
  exit 1
fi

echo "→ Found direct URL: $DIRECT_URL"
echo "→ Downloading..."

TMP_IMG="/tmp/wikimedia_${WIKI_FILENAME}"
curl -sL --max-time 30 -o "$TMP_IMG" -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" "$DIRECT_URL"

# Verify it's actually an image
FILE_TYPE=$(file "$TMP_IMG")
if ! echo "$FILE_TYPE" | grep -q "image"; then
  echo "ERROR: Downloaded file is not an image: $FILE_TYPE"
  echo "First 200 bytes:"
  head -c 200 "$TMP_IMG"
  rm -f "$TMP_IMG"
  exit 1
fi

echo "→ Downloaded successfully: $FILE_TYPE"

# Determine output name
if [ -z "$OUTPUT_NAME" ]; then
  OUTPUT_NAME="${WIKI_FILENAME%.*}"
fi
# Force .webp extension
OUTPUT_NAME="${OUTPUT_NAME%.*}.webp"

ASSETS_DIR="$PROJECT_ROOT/src/assets"

echo "→ Converting to WebP..."
cd "$PROJECT_ROOT"
node --input-type=module -e "
import sharp from 'sharp';
sharp('$TMP_IMG')
  .webp({ quality: 85 })
  .toFile('$ASSETS_DIR/$OUTPUT_NAME')
  .then(info => {
    console.log('Done: ' + info.size + ' bytes');
    console.log('Output: src/assets/$OUTPUT_NAME');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
"

rm -f "$TMP_IMG"
echo "→ Complete: src/assets/$OUTPUT_NAME"
