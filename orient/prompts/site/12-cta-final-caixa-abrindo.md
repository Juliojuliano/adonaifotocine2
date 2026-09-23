# Seção 11 — CTA Final + Vídeo da Caixa Abrindo

## Estrutura visual

- **Tema:** Dark
- **Layout:** Dobra completa (250vh track com sticky pin 100vh) — headline + sub em cima, vídeo scroll-scrubbed no meio, CTA + risk reversal no rodapé
- **Função:** Fechar a landing com momento ceremonial + conversão

## Copy

```
[HEADLINE — Cormorant Garamond gigante]
O relógio que você usa hoje.
E daqui a dez anos.

("E daqui a dez anos." em cor accent — vermelho ou dourado warm)

[LEDE]
Engenharia japonesa. Construção em aço. Resistência certificada.
Pelo preço de um jantar bom.

[VÍDEO SCROLL-SCRUBBED — caixa Orient abrindo]

[CTA — botão pílula branco com texto preto, grande]
"Garantir o meu"

[RISK REVERSAL — abaixo do botão, letterspacing wide]
30 dias de garantia · Frete grátis · Pronta entrega
```

## O vídeo — como executar

### Etapa 1 — First Frame (Nano Banana 2)

Gera imagem da caixa Orient fechada, vista three-quarter top-down.

**Prompt:**

```
Premium product photography of a closed Orient watch box,
photographed from an elevated three-quarter angle. Refer to the
attached reference images for the exact box design.

COMPOSITION & ANGLE — CRITICAL:
- The watch box is centered in the frame, square cube shape (~12cm)
- THREE-QUARTER TOP-DOWN VIEW: camera is positioned ABOVE and slightly
  in front of the box, looking DOWN at it at approximately a 35-40
  degree angle from the horizontal plane
- The TOP of the box (lid with the ORIENT wordmark) is the LARGEST,
  most visible face — clearly readable, occupying most of the box's
  visible surface area
- The FRONT of the box (where the lid would open from) is also
  visible, but appears as a smaller secondary face below the top
- The LEFT or RIGHT side of the box is barely visible (just a sliver)
  to give 3D dimension
- Aspect ratio: 16:9 horizontal
- The box occupies approximately 50% of the frame, perfectly centered

REFERENCE: think of how a watch box appears in classic luxury
unboxing photography — you see the LID FROM ABOVE (logo readable),
plus a hint of the front face (where it will open), plus minimal side.
The LID IS THE HERO of the composition.

THE BOX:
- Premium black matte cardboard watch box, square cube shape
- Hinged top opening (clamshell design) — the lid is the entire top
- ON THE LID (top face): silver/chrome "ORIENT" wordmark printed
  centered horizontally, slightly above the middle of the top face
- Below the wordmark on the lid: a small silver/chrome decorative
  metal accent (small rectangular bar/tab indicator)
- The box edges are clean and crisp
- Subtle texture on the matte black surface — premium paperboard
- The box is fully CLOSED — no opening, no gap, no preview of contents
- The hinge of the lid is on the BACK edge (away from camera)

SURFACE & ENVIRONMENT:
- The box rests on a pure black surface that gradually merges into
  the black background — no visible horizon line
- A subtle reflection of the box visible on the surface beneath it
- Pure black void around the box — infinite black background

LIGHTING:
- Soft directional key light from upper-left, slightly warm
- The silver "ORIENT" wordmark catching a clean reflection on the LID
- Highlight along the upper-front edge of the box
- Soft shadow falling to the lower-right

DO NOT:
- Show the box from a side view — the LID (top) must be the most
  visible face, photographed from above and slightly in front
- Show the box open or partially open
- Add hands, fingers, or any human element
- Use a colored, gradient, or textured background
```

### Etapa 2 — Vídeo (Veo 3.1 Lite)

Usa a imagem da Etapa 1 como **First Frame único** (sem Last Frame). Anexa foto frontal do Orient como referência adicional pra travar o reveal do relógio.

**Prompt:**

```
A premium watch box opens slowly to reveal the watch inside, with
the camera completely locked off and the box remaining stationary.

ANIMATION — CRITICAL:
The box starts CLOSED, exactly as shown in the first frame, perfectly
frontal to the camera. The animation has THREE distinct phases:

PHASE 1 (0–1.5s): STILLNESS
The closed box sits motionless. Subtle ambient atmosphere only.
Nothing moves. Builds anticipation.

PHASE 2 (1.5–4s): LID OPENS
The hinged lid slowly rotates BACKWARDS on its rear hinge, opening
smoothly upward and away from the camera. The lid pivots ONLY on
its rear edge — like a real clamshell box. The base of the box
remains COMPLETELY STATIONARY throughout. As the lid opens:
- The interior of the box is gradually revealed
- A soft warm glow emerges from inside as the lid lifts
- The lid finishes its rotation when it is approximately 110-120
  degrees open (resting back, fully revealing the contents)

PHASE 3 (4–6s): REVEAL
The box is now fully open. The watch sitting inside is revealed:
- An Orient field watch (refer to attached watch reference image)
- The watch is centered inside the box, dial facing the camera
- White dial with arabic numerals visible, red accents
- Brushed steel case
- Black perforated silicone strap arranged neatly inside
- The watch is illuminated by the warm light spilling from above

CAMERA — ABSOLUTELY LOCKED OFF:
- The camera does NOT move. No pan, no zoom, no dolly, no rotation.
- The box does NOT rotate, does NOT shift position
- ONLY the lid moves (rotating open on its rear hinge)
- ONLY the watch is revealed inside

LIGHTING — DYNAMIC:
- The ambient lighting on the closed box remains constant throughout
- As the lid opens, an ADDITIONAL soft warm glow emerges from inside
- This glow grows progressively as the lid opens further
- The glow is gentle, NOT a dramatic spotlight or flash

ENVIRONMENT — STATIC:
- Pure black background, completely unchanged throughout
- No flickering, no atmospheric shifts, no fog, no particles

PACE & MOOD:
- Slow, deliberate, premium pacing
- Constant velocity throughout the lid's rotation
- Mood: ceremonial, luxurious, "the unveiling of something special"
- Cinematic 24fps with smooth motion blur on the moving lid

Duration: 6 seconds total. No music or sound effects.

DO NOT:
- Rotate the box or change its angle at any point
- Move the camera in any way
- Add hands, fingers, or any human element
- Add particles, smoke, sparkles, or magical effects
- Have the lid open more than 130 degrees — natural stop point
- Change the watch design in the reveal
```

### Etapa 3 — Re-encode (ffmpeg)

Vídeo gerado provavelmente vai ter 6s mas o último segundo pode "sobrar" — recomendo cortar para 5s pra ficar no ponto exato do reveal:

```bash
ffmpeg -i video-original.mp4 -t 5 \
  -c:v libx264 -preset slow -crf 22 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart -an \
  caixa-scrub.mp4
```

Resultado: ~2-3MB, 120 frames (5s × 24fps), todos keyframes.

## Arquitetura CSS/JS

**HTML:**
```html
<section class="ds dark caixa-reveal">
  <div class="caixa-reveal__track">
    <div class="caixa-reveal__pin">
      <div class="caixa-reveal__copy">
        <!-- headline + lede -->
      </div>
      <div class="caixa-reveal__video-wrap">
        <video src="caixa-scrub.mp4" muted playsinline preload="auto"></video>
      </div>
      <div class="caixa-reveal__cta">
        <!-- botão + risk reversal -->
      </div>
    </div>
  </div>
</section>
```

**CSS chave:**
- `.caixa-reveal__track { height: 250vh }` — trilha de scroll
- `.caixa-reveal__pin { position: sticky; top: 0; height: 100vh }` — pin do conteúdo
- Grid layout: `grid-template-rows: auto 1fr auto` (copy / vídeo / CTA)
- Vídeo com `aspect-ratio: 16/9` e `max-height: 55vh` pra não sobrepor copy

**JS:** mesma técnica do vídeo da hero (scroll → currentTime via requestAnimationFrame + threshold 0.04 para evitar stuttering).

## Insight de conversão

Essa seção é o **clímax emocional** da landing. O usuário rolou por 11 seções de argumentos técnicos e visuais — aqui ele **vê o produto chegando na casa dele**. É unboxing virtual antes do checkout.

O texto "Pelo preço de um jantar bom" é o quebra-preço final — mesmo depois de todos os argumentos de qualidade, você lembra que é acessível. Combina "premium" com "razoável" no mesmo momento.

O risk reversal (30 dias, frete grátis, pronta entrega) elimina as 3 últimas objeções antes do clique.
