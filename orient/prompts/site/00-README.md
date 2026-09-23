# Landing Page Orient — Prompts por Seção

Este pacote contém **13 arquivos .md**, um por seção da landing page cinematográfica do Orient. Cada arquivo tem:

- Estrutura da seção (dark/light, layout)
- Copy final em português
- Prompt de imagem/vídeo (quando aplicável) para IA gerar a mídia
- Notas técnicas específicas quando relevantes

## Arquitetura da landing (13 seções)

| # | Arquivo | Tema | Conteúdo principal |
|---|---------|------|---------------------|
| 0 | `01-hero-cinematica.md` | Dark cinemático | Vídeo scroll-scrubbed do relógio se montando |
| 1 | `02-anchor.md` | Dark | "Engenharia japonesa. No seu pulso." + 2 CTAs |
| 2 | `03-statement.md` | Light | "Feito para durar mais que tendências." |
| 3 | `04-feature-movimento.md` | Dark | Macro caseback com mecanismo visível |
| 4 | `05-feature-caixa.md` | Light | Perfil lateral dramático (chiaroscuro) |
| 5 | `06-feature-resistencia.md` | Dark | Macro closeup da coroa (com gasket) |
| 6 | `07-feature-mostrador.md` | Light | Mostrador em 3/4 angular |
| 7 | `08-feature-pulseira-configurador.md` | Dark | Configurador Nike-style com 5 opções |
| 8 | `09-specs-table.md` | Light | Tabela `<dl>` semântica de especificações |
| 9 | `10-social-proof.md` | Dark | 3 stats + 2 testimonials |
| 10 | `11-faq.md` | Light | 6 perguntas frequentes |
| 11 | `12-cta-final-caixa-abrindo.md` | Dark | CTA final + vídeo scroll-scrubbed da caixa abrindo |
| 12 | `13-footer.md` | Dark | Copyright minimalista |

## Como usar

**Se você quer replicar a landing inteira:**
1. Lê o arquivo 00 (esse) primeiro
2. Segue seção por seção na ordem
3. Cada arquivo tem copy + prompt de imagem/vídeo separados
4. Roda os prompts no Nano Banana 2 / Veo 3.1 conforme aplicável

**Se você quer só uma seção específica:**
- Vai direto no arquivo dela
- Cada seção é independente

## Sistema visual global

- **Fontes:** Cormorant Garamond (display, peso 300) + Inter (body)
- **Alternância dark/light:** cada seção pós-hero flipa tema (ritmo estilo Apple)
- **Layout feature sections:** eyebrow → headline gigante → texto → imagem → callouts
- **Zero itálico** em toda a landing (preferência do briefing original)

## Workflow de geração de imagens (padrão)

Todo prompt de imagem segue a mesma fórmula que se consolidou:

1. Anexar foto frontal do produto Orient como **referência primária**
2. Descrever cada detalhe do relógio no bloco "WATCH — MUST MATCH REFERENCE EXACTLY"
3. Especificar composição, iluminação, DOF, aspect ratio
4. Listar regras negativas em "DO NOT" (combate viés da IA de "melhorar")
5. Gerar 3-5 variações, escolher a melhor

## Workflow de vídeo (padrão)

1. Gerar First Frame como imagem no Nano Banana (referência estática)
2. Rodar no Veo 3.1 Lite com essa First Frame
3. Re-encodar com ffmpeg para scroll-scrubbing:

```bash
ffmpeg -i original.mp4 \
  -c:v libx264 -preset slow -crf 22 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart -an \
  output.mp4
```

Flags críticas: `-g 1 -keyint_min 1` = keyframe por frame (obrigatório pra scroll-scrubbing).

## Referência ao produto

O relógio da landing é um Orient real (field watch com mostrador branco, numerais arábicos, acentos vermelhos, pulseira preta de silicone perfurado). Todos os prompts pressupõem que você anexe uma foto frontal desse produto real como referência visual.
