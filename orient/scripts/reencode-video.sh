#!/usr/bin/env bash
#
# Re-encoda um vídeo bruto (saído do Veo 3.1) para permitir scroll-scrubbing
# suave no navegador. Aplica os parâmetros obrigatórios descritos em
# prompts/site/00-README.md: keyframe em CADA frame (-g 1 -keyint_min 1).
#
# Uso:
#   ./reencode-video.sh <entrada.mp4> <saida.mp4> [--trim SEGUNDOS] [--delogo X:Y:W:H] [--fps N]
#
# Exemplos:
#   ./reencode-video.sh ../assets/_incoming/hero-raw.mp4 ../assets/video/hero-montagem.mp4
#   ./reencode-video.sh ../assets/_incoming/caixa-raw.mp4 ../assets/video/caixa-abrindo.mp4 --trim 5
#   ./reencode-video.sh ../assets/_incoming/hero-raw.mp4 ../assets/video/hero-montagem.mp4 --delogo 1740:1020:160:50 --fps 24

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Uso: $0 <entrada.mp4> <saida.mp4> [--trim SEGUNDOS] [--delogo X:Y:W:H] [--fps N]" >&2
  exit 1
fi

INPUT="$1"
OUTPUT="$2"
shift 2

TRIM=""
DELOGO=""
FPS=""

while [ $# -gt 0 ]; do
  case "$1" in
    --trim)
      TRIM="$2"
      shift 2
      ;;
    --delogo)
      DELOGO="$2"
      shift 2
      ;;
    --fps)
      FPS="$2"
      shift 2
      ;;
    *)
      echo "Opção desconhecida: $1" >&2
      exit 1
      ;;
  esac
done

if [ ! -f "$INPUT" ]; then
  echo "Arquivo de entrada não encontrado: $INPUT" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

VF_PARTS=()
if [ -n "$DELOGO" ]; then
  IFS=':' read -r DX DY DW DH <<< "$DELOGO"
  VF_PARTS+=("delogo=x=${DX}:y=${DY}:w=${DW}:h=${DH}")
fi
if [ -n "$FPS" ]; then
  VF_PARTS+=("fps=${FPS}")
fi

FFMPEG_ARGS=(-i "$INPUT")

if [ -n "$TRIM" ]; then
  FFMPEG_ARGS+=(-t "$TRIM")
fi

if [ ${#VF_PARTS[@]} -gt 0 ]; then
  VF_JOINED=$(IFS=,; echo "${VF_PARTS[*]}")
  FFMPEG_ARGS+=(-vf "$VF_JOINED")
fi

FFMPEG_ARGS+=(
  -c:v libx264 -preset slow -crf 22
  -g 1 -keyint_min 1 -pix_fmt yuv420p
  -movflags +faststart -an
  -y "$OUTPUT"
)

echo "Rodando: ffmpeg ${FFMPEG_ARGS[*]}"
ffmpeg "${FFMPEG_ARGS[@]}"

echo ""
echo "OK -> $OUTPUT"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,nb_frames \
  -of default=noprint_wrappers=1 "$OUTPUT" || true
