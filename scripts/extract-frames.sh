#!/usr/bin/env bash
# Extracts a scroll-scrubbed frame sequence from a source video.
#
# Usage: scripts/extract-frames.sh video-source/rings.mp4
#
# Frames land in public/frames/frame_0001.jpg, frame_0002.jpg, ... and are
# picked up automatically by FrameCanvas (src/components/FrameCanvas.tsx) —
# no code changes needed after running this, only updating
# STORY_FRAME_COUNT in src/routes/index.tsx to match the frame count printed
# at the end.

set -euo pipefail

INPUT="${1:?Usage: scripts/extract-frames.sh <path-to-video.mp4>}"
OUT_DIR="public/frames"
FPS=16
WIDTH=1280

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/frame_*.jpg

ffmpeg -i "$INPUT" -vf "fps=${FPS},scale=${WIDTH}:-1" -q:v 4 "$OUT_DIR/frame_%04d.jpg"

COUNT=$(ls "$OUT_DIR"/frame_*.jpg | wc -l | tr -d ' ')
echo ""
echo "Extracted $COUNT frames to $OUT_DIR/"
echo "Set STORY_FRAME_COUNT = $COUNT in src/routes/index.tsx"
