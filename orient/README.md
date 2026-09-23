# Orient — Landing Page Cinematográfica

Landing page de produto para o relógio Orient (field watch), construída a
partir dos documentos em `prompts/`. **Projeto independente** do site da
Adonai FotoCine na raiz do repositório — vive inteiramente dentro desta
pasta `orient/` e não compartilha código, estilos ou assets com ele.

HTML/CSS/JS puro, sem framework e sem build step. Abra `index.html`
diretamente no navegador ou sirva a pasta com qualquer servidor estático.

## Estrutura

```
orient/
├── index.html              # As 13 seções da landing, em ordem
├── assets/
│   ├── css/styles.css      # Design system (cores, tipografia, temas dark/light)
│   ├── js/main.js          # Scroll-scrubbing dos vídeos + configurador de pulseira
│   ├── img/                # Placeholders SVG das fotos macro (ver "Mídia" abaixo)
│   └── video/              # Pasta vazia — onde entram os .mp4 finais
└── prompts/                 # Documentos originais (specs de copy + prompts de IA)
    ├── site/                # 1 arquivo por seção (00 a 13)
    ├── imagens/              # Prompts de imagens de apoio (não usadas na landing em si)
    └── videos/               # Prompts dos 2 vídeos scroll-scrubbed
```

## Como rodar localmente

Não precisa de Node nem de build. Qualquer servidor estático funciona:

```bash
cd orient
python3 -m http.server 8080
# depois abra http://localhost:8080
```

## Seções implementadas (conforme `prompts/site/00-README.md`)

| # | Seção | Tema | Status |
|---|-------|------|--------|
| 0 | Hero cinemática (vídeo scroll-scrubbed) | Dark | Estrutura pronta, aguarda vídeo real |
| 1 | Anchor (headline + CTAs) | Dark | Completo |
| 2 | Statement | Light | Completo |
| 3 | Feature — Movimento | Dark | Estrutura pronta, aguarda imagem real |
| 4 | Feature — Caixa | Light | Estrutura pronta, aguarda imagem real |
| 5 | Feature — Resistência | Dark | Estrutura pronta, aguarda imagem real |
| 6 | Feature — Mostrador | Light | Estrutura pronta, aguarda imagem real |
| 7 | Feature — Pulseira (configurador) | Dark | Completo e funcional (placeholders visuais) |
| 8 | Specs table (`<dl>`) | Light | Completo |
| 9 | Social proof (stats + depoimentos) | Dark | Completo |
| 10 | FAQ | Light | Completo |
| 11 | CTA final + vídeo da caixa abrindo | Dark | Estrutura pronta, aguarda vídeo real |
| 12 | Footer | Dark | Completo |

## Mídia: placeholders vs. assets finais

Nenhuma foto ou vídeo real do relógio foi fornecida junto com os
documentos — apenas **prompts de texto** para gerar essas mídias em IA
(Nano Banana 2 para imagens, Veo 3.1 para vídeo), como descrito em
`prompts/site/00-README.md`.

Por isso, o site já está 100% funcional e navegável com placeholders:

- **Imagens** (`assets/img/*.svg`): ilustrações vetoriais na mesma
  paleta (preto + glow dourado) das fotos reais, cada uma com uma legenda
  indicando qual arquivo de prompt gera a versão final.
- **Vídeos** (hero e caixa abrindo): os elementos `<video>` já estão no
  HTML apontando para `assets/video/hero-montagem.mp4` e
  `assets/video/caixa-abrindo.mp4`. Como esses arquivos ainda não
  existem, `assets/js/main.js` detecta a ausência do vídeo e mostra
  automaticamente um placeholder ilustrado no lugar — sem ícone de vídeo
  quebrado. Assim que os `.mp4` forem colocados em `assets/video/`, eles
  passam a tocar (e a fazer scroll-scrubbing) automaticamente, sem
  nenhuma mudança de código.

### Para gerar os assets finais

1. Siga `prompts/site/00-README.md` — ele explica o workflow completo
   (First Frame → Last Frame → Veo → re-encode com `ffmpeg -g 1
   -keyint_min 1` para permitir scroll-scrubbing suave).
2. Cada seção tem seu prompt de imagem em `prompts/site/0X-*.md`.
3. Os dois vídeos (hero e caixa abrindo) têm prompt completo em
   `prompts/videos/`.
4. Depois de gerados:
   - Fotos → substituem os `.svg` em `assets/img/` (pode trocar a
     extensão no `src` do `index.html` para `.jpg`/`.webp`).
   - Vídeos re-encodados → salvos como `assets/video/hero-montagem.mp4`
     e `assets/video/caixa-abrindo.mp4`.
   - Pulseiras (5 PNGs transparentes descritos em
     `prompts/site/08-feature-pulseira-configurador.md`) → pode
     substituir os `.strap-swatch` em CSS por `background-image`
     apontando para os PNGs reais, mantendo a mesma estrutura de HTML.

## Configurador de pulseira

Funciona de ponta a ponta em `assets/js/main.js` (objeto `STRAP_DATA`):
ao clicar em uma das 5 opções, muda simultaneamente o gradiente de fundo
da seção, a auréola ao redor do relógio, a sombra, a cor de destaque e o
texto descritivo — a mesma mecânica "Nike-style" descrita no prompt
original. Hoje as pulseiras são representadas por padrões CSS (listras,
pontilhado, trama) fiéis ao material; basta trocar por PNGs reais quando
gerados.

## Acessibilidade e performance

- `prefers-reduced-motion` respeitado: desativa o scroll-scrubbing dos
  vídeos e o smooth scroll.
- Skip link, `aria-live` no configurador, `alt` descritivo em todas as
  imagens, contraste AA nos dois temas.
- Zero dependências de build — `fonts.googleapis.com` é a única chamada
  de rede (Cormorant Garamond + Inter), com fallback para fontes de
  sistema caso fique indisponível.

## Fontes e cores

- Display: **Cormorant Garamond**, peso 300 (headlines gigantes).
- Corpo: **Inter**.
- Accent dourado: `#C9A86A`. Accent vermelho (marcadores do mostrador):
  `#B3372C`.
- Zero itálico em toda a landing (decisão do briefing original).
