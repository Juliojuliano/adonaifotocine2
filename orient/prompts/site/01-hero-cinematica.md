# Seção 0 — Hero Cinemática

## Estrutura visual

- **Tema:** Dark cinematográfico
- **Layout:** Vídeo scroll-scrubbed full-bleed com expansion conforme scroll
- **Altura:** 250vh (track de scroll) com sticky pin de 100vh
- **Elementos:** vídeo do relógio se montando + warm glow + headline+CTA aparecem em anchor section abaixo

## O que essa seção é

A abertura da landing. Vídeo cinemático do relógio Orient se montando a partir de exploded view. O vídeo é controlado pelo scroll do usuário — cada frame do vídeo é uma posição do scroll. Conforme rola, o vídeo expande de "card centralizado" para "full-bleed cinemático".

**Referências estéticas:** Apple product film, AirPods Max landing page, campanha Patek Philippe.

## Como executar (workflow completo)

### Etapa 1 — First Frame (Nano Banana 2)

Gera imagem do relógio em **exploded view** (peças flutuando desmontadas), com warm glow no canto superior esquerdo. Anexa foto frontal do Orient como referência.

### Etapa 2 — Last Frame (Nano Banana 2)

Gera imagem do relógio **fechado, frontal 3/4**, com a mesma atmosfera warm. Anexa foto frontal do Orient como referência.

### Etapa 3 — Vídeo (Veo 3.1 Lite)

Roda o prompt abaixo com First Frame e Last Frame anexados.

### Etapa 4 — Re-encode (ffmpeg)

```bash
ffmpeg -i original.mp4 \
  -vf "delogo=x=1740:y=1020:w=160:h=50,fps=24,scale=1280:720" \
  -c:v libx264 -preset slow -crf 22 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart -an \
  orient-watch.mp4
```

## Prompt do vídeo (Veo)

```
The watch components reassemble themselves with elegant precision. Each
floating part descends along its vertical axis and locks into place: the
sapphire crystal lowers onto the bezel, the bezel settles onto the case,
the white dial drops into the case body, the internal movement disappears
inside, and the two strap segments rise up and connect to the case lugs,
forming a complete assembled watch.

Motion characteristics:
- Movement is slow, smooth, and deliberate — like watching a precision
  mechanism in slow motion
- Each component moves only along the vertical axis (no rotation, no
  drift sideways)
- Components nearest to the case body settle first; outer components
  (crystal, strap) settle last
- Subtle warm rim light flickers on metallic edges as they move
- Volumetric dust particles continue drifting throughout the scene
- Camera remains locked off, no movement, no zoom

CRITICAL — ATMOSPHERE CONSISTENCY:
The atmosphere, lighting, warm glow, and dust particles must be IDENTICAL
in every frame, from frame 1 to the last frame. The soft warm key light
from the upper-left is PRESENT FROM THE VERY FIRST FRAME at full intensity
and remains exactly the same throughout. Do NOT let the warm glow fade in,
intensify, or "reveal" itself during the animation. Do NOT introduce new
light sources or atmospheric elements mid-video. The warmth and ambience
visible in the first frame must match exactly the warmth and ambience
in the last frame — same intensity, same direction, same color temperature.
The watch components move through a stable, unchanging atmosphere.

Mood: meditative, technical, mechanical poetry. The disassembled state
gracefully resolves into the final assembled watch. The final frame
must match the second reference image exactly — closed watch, dial
facing camera, perforated black silicone strap visible above and below
the case, deep black background, soft warm key light from upper-left.

Duration: 5 seconds. No music or sound effects.

Style: dark luxury product film, Phase One medium format aesthetic,
cinematic 24fps with smooth motion blur on moving components.
```

## Notas técnicas

- **Não use este vídeo sem re-encodar.** O MP4 padrão tem keyframe a cada 250 frames — scrubbing trava. `-g 1 -keyint_min 1` gera keyframe em CADA frame (arquivo cresce ~3x, mas scrubbing fica fluido).
- **Cada geração do Veo é única.** Mesmo prompt = resultados diferentes. Prepara-se pra 2-3 tentativas.
- **Warm glow tem que estar na First Frame.** Se a IA gerar exploded view em preto absoluto, o vídeo vai "revelar" a luz no meio (bug clássico). A luz precisa existir desde o frame 1.

## Copy da seção (não vai dentro do vídeo)

A copy da hero (headline "O relógio que você usa hoje. E daqui a dez anos.") **não fica sobre o vídeo** — vai na Anchor Section logo abaixo (arquivo `02-anchor.md`). Isso foi decisão deliberada: hero fica 100% cinemática, sem texto competindo com o vídeo.
