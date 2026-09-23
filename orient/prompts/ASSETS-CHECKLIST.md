# Checklist de assets finais — Landing Orient

Lista exata do que falta gerar e onde cada arquivo entra no site. Gere com
os prompts indicados, solte o arquivo bruto em `orient/assets/_incoming/`
(qualquer nome) e eu processo e movo para o lugar certo.

## Imagens (Nano Banana 2 / Gemini)

Todas devem ser geradas anexando uma foto frontal real do Orient como
referência, conforme cada prompt pede. Formato final recomendado: `.jpg`
(qualidade alta) ou `.webp`.

| # | Arquivo final | Prompt de origem | Aspect ratio | Substitui |
|---|---|---|---|---|
| 1 | `assets/img/movimento.jpg` | `prompts/site/04-feature-movimento.md` | 1:1 | `movimento.svg` |
| 2 | `assets/img/caixa.jpg` | `prompts/site/05-feature-caixa.md` | 16:9 | `caixa.svg` |
| 3 | `assets/img/coroa.jpg` | `prompts/site/06-feature-resistencia.md` | 4:5 | `coroa.svg` |
| 4 | `assets/img/mostrador.jpg` | `prompts/site/07-feature-mostrador.md` | 16:10 | `mostrador.svg` |
| 5 | `assets/img/hero-poster.jpg` | `prompts/site/01-hero-cinematica.md` (First Frame, exploded view) | 1:1 | `hero-poster.svg` (poster do vídeo hero) |
| 6 | `assets/img/caixa-poster.jpg` | `prompts/site/12-cta-final-caixa-abrindo.md` (First Frame, caixa fechada) | 16:9 | `caixa-poster.svg` (poster do vídeo da caixa) |

### Opcionais (configurador de pulseira)

Hoje as 5 pulseiras são desenhadas em CSS puro (funcional, mas não são
fotos reais). Se quiser trocar por fotos:

| # | Arquivo final | Material | Notas |
|---|---|---|---|
| 7 | `assets/img/strap-silicone-black.png` | Silicone preto | PNG **transparente** |
| 8 | `assets/img/strap-leather-brown.png` | Couro marrom | PNG **transparente** |
| 9 | `assets/img/strap-steel.png` | Aço 316L | PNG **transparente** |
| 10 | `assets/img/strap-nylon-navy.png` | Nylon NATO marinho | PNG **transparente** |
| 11 | `assets/img/strap-mesh.png` | Mesh milanês | PNG **transparente** |

Prompt base para as 5: `prompts/site/08-feature-pulseira-configurador.md`
(seção "Prompts pra gerar as PNGs").

## Vídeos (Veo 3.1 Lite)

Entregue o `.mp4` **bruto**, direto da exportação do Veo (sem re-encode).
Eu re-encodo com `orient/scripts/reencode-video.sh`, que já aplica os
parâmetros obrigatórios para scroll-scrubbing (`-g 1 -keyint_min 1`).

| # | Arquivo bruto esperado (qualquer nome) | Arquivo final | Prompt de origem | Pós-processo |
|---|---|---|---|---|
| 1 | ex: `hero-raw.mp4` | `assets/video/hero-montagem.mp4` | `prompts/videos/Vídeo do relógio - hero.md` | re-encode padrão (5s) |
| 2 | ex: `caixa-raw.mp4` | `assets/video/caixa-abrindo.mp4` | `prompts/videos/Vídeo do relógio na caixa/Vídeo do relógio na caixa.md` | re-encode + trim para 5s |

## Como entregar

1. Gere os arquivos nas ferramentas de IA seguindo os prompts.
2. Solte os arquivos brutos em `orient/assets/_incoming/` (ou anexe aqui
   na conversa).
3. Me avise — eu processo (re-encode de vídeo, ajuste de nome/formato),
   atualizo o `index.html` se necessário, e faço commit + push no PR.
