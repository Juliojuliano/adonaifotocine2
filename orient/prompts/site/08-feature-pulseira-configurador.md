# Seção 7 — Feature 5: Pulseira (Configurador Nike-style)

## Estrutura visual

- **Tema:** Dark (mas dinâmico — tema muda por opção)
- **Layout:** Nike-hero inspired — troca de pulseira muda TODO o ambiente visual
- **Interatividade:** clique em pulseira → cross-fade + mudança de background + aura + shadow + accent

## Copy

```
[EYEBROW]
PULSEIRA

[HEADLINE]
Sua pulseira. Sua escolha.

[LEDE]
O mesmo relógio. Cinco personalidades. Troque rápido — clique
e veja como fica.

[OPÇÕES — 5 botões com swatch de cor]
1. Silicone — Preto
2. Couro — Marrom
3. Aço — 316L
4. Nylon — Marinho
5. Mesh — Milanês

[STAGE — imagem do relógio muda conforme seleção]

[STRAP INFO — texto muda por seleção]
```

## As 5 opções (com temas visuais completos)

### 1. Silicone Preto (default)
- **Descrição:** Esportiva, hipoalergênica, perfurada para ventilação. A pulseira que vem de fábrica.
- **BG:** from `#0a0a0a` via `#1a1a1a` to `#000000`
- **Accent:** `#C9A86A` (dourado warm — herda hero)
- **Aura:** `rgba(201, 168, 106, 0.18)`
- **Shadow:** `rgba(0, 0, 0, 0.6)`

### 2. Couro Marrom
- **Descrição:** Couro genuíno italiano. Ganha caráter com o tempo. Para quem quer vibe clássica.
- **BG:** from `#3d2817` via `#1a0f08` to `#0a0604`
- **Accent:** `#D4A574` (caramelo claro)
- **Aura:** `rgba(212, 165, 116, 0.22)`
- **Shadow:** `rgba(20, 8, 4, 0.7)`

### 3. Aço 316L
- **Descrição:** Pulseira em aço 316L com fecho dobrável. Robusta. Atemporal. Pronta pra qualquer ocasião.
- **BG:** from `#2a3441` via `#0f1419` to `#050709`
- **Accent:** `#B8C5D0` (prata fria)
- **Aura:** `rgba(184, 197, 208, 0.18)`
- **Shadow:** `rgba(8, 12, 16, 0.7)`

### 4. Nylon NATO Marinho
- **Descrição:** Estilo militar britânico. Leve, resistente à água, secagem rápida. Ideal pra outdoor.
- **BG:** from `#1a2b4a` via `#0a1426` to `#040810`
- **Accent:** `#5B8DD6` (azul oceano)
- **Aura:** `rgba(91, 141, 214, 0.20)`
- **Shadow:** `rgba(4, 8, 16, 0.7)`

### 5. Mesh Milanês
- **Descrição:** Trama de aço inox flexível. Confortável como tecido, premium como joia.
- **BG:** from `#3a3a3a` via `#181818` to `#080808`
- **Accent:** `#E8E8E8` (branco metálico)
- **Aura:** `rgba(232, 232, 232, 0.16)`
- **Shadow:** `rgba(0, 0, 0, 0.7)`

## Arquitetura técnica (resumo)

**Assets necessários (6 imagens PNG na pasta `imgs/`):**
- `watch-base.png` — relógio SEM pulseira (case + dial visível)
- `strap-silicone-black.png` — só a pulseira, PNG transparente
- `strap-leather-brown.png`
- `strap-steel.png`
- `strap-nylon-navy.png`
- `strap-mesh.png`

**Como funciona o layering:**
- Watch base fica sempre visível (z-index 2)
- 5 straps sobrepostos, apenas o `.active` com `opacity: 1` (z-index 3)
- Cross-fade suave entre straps via CSS transition (0.5s cubic-bezier)

**Efeitos ao clicar (6 mudanças simultâneas):**
1. Background da seção (radial gradient)
2. Aura ao redor do relógio (2 layers: 40px blur + 20px blur)
3. Shadow no chão (20px blur)
4. Cross-fade das pulseiras (opacity + scale sutil)
5. Botão ativo (borda + box-shadow)
6. Info text (fade out → update → fade in)

Timing: 0.5-0.7s com `cubic-bezier(0.22, 1, 0.36, 1)` (easing premium Apple).

## Prompts pra gerar as PNGs (Nano Banana 2)

Cada strap precisa ser gerado individualmente com fundo transparente. Prompt base:

```
Product photography of a single [MATERIAL] watch strap, isolated on
pure transparent background (PNG with alpha channel). The strap is
positioned as if attached to an invisible watch case — the two segments
(top and bottom) visible with the space where the case would be in
the middle.

- Perspective: frontal view, exactly as it would appear when the watch
  is photographed straight-on
- The strap has natural curve and shadow but the CASE is not present
- The area where the case would go must be transparent (no watch case,
  no dial, no lugs — just empty transparent space)

MATERIAL DETAILS FOR [SELECIONE]:
- Silicone black: matte black silicone with visible ventilation
  perforations
- Leather brown: rich cognac brown Italian leather with visible grain
  and stitching along edges
- Steel 316L: brushed and polished stainless steel oyster-style links
- Nylon navy: deep navy blue NATO strap with visible weave texture
- Mesh: fine milanese mesh weave in polished steel

LIGHTING: soft studio lighting matching what a watch would receive,
subtle shadow on the strap surface

BACKGROUND: PURE TRANSPARENT (alpha channel), NOT white, NOT black,
NOT any color — must export as PNG with true transparency

DO NOT include the watch case, dial, hands, or any watch component
other than the strap itself.
```

## Insight de execução

O configurador funciona **mesmo sem os PNGs prontos** — o CSS já entrega o efeito wow só com placeholder, porque a mudança de background + aura + shadow + accent já dá o impacto Nike-style. Quando você conseguir gerar os PNGs, eles se encaixam automaticamente no layout.

**Referência estética:** essa seção replica o efeito da hero da Nike onde o produto muda + o ambiente inteiro responde à seleção. É "materialidade emocional" — cada pulseira é uma personalidade, não só uma textura.
