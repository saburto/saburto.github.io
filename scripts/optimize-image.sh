#!/usr/bin/env bash
# Optimize an image for the blog: convert to WebP, resize, compress.
# Usage: ./scripts/optimize-image.sh <input> [output-name]
#   input       Path to the source image (png, jpg, webp, etc.)
#   output-name Optional base name without extension (defaults to input basename)
# Output is placed in src/assets/<output-name>.webp

set -euo pipefail

INPUT="$1"
NAME="${2:-$(basename "$INPUT" | sed 's/\.[^.]*$//')}"
OUTPUT="src/assets/${NAME}.webp"
QUALITY="${IMAGE_QUALITY:-80}"
MAX_WIDTH="${IMAGE_MAX_WIDTH:-1200}"

if ! command -v cwebp &>/dev/null; then
  echo "Error: cwebp not found. Install it with: sudo apt install webp"
  exit 1
fi

echo "Optimizing: $INPUT"
echo "Output:     $OUTPUT"
echo "Quality:    $QUALITY"
echo "Max width:  ${MAX_WIDTH}px"

cwebp -q "$QUALITY" -resize "$MAX_WIDTH" 0 "$INPUT" -o "$OUTPUT"

SIZE=$(du -h "$OUTPUT" | cut -f1)
echo "Done: $OUTPUT ($SIZE)"
echo ""
echo "Use in Markdown:"
echo "![alt text](../../assets/${NAME}.webp)"
