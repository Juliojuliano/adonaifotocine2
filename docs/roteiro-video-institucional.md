# Vídeo Institucional — Roteiro de Narração e Storyboard

Material de apoio para produzir o vídeo institucional (animação + narração em voz) da Adonai Fotocine, que será hospedado no YouTube/Vimeo e embutido na seção "Vídeo Institucional" do site (ver `index.html`).

Duração alvo: **60–75 segundos**. Tom de voz: caloroso, elegante, emocional, mas profissional — a mesma voz usada nos textos do site.

## 1. Roteiro de narração (áudio)

| # | Tempo | Locução (pt-BR) |
|---|-------|------------------|
| 1 | 0:00–0:08 | "Cada história de amor é única. E existem momentos que merecem ser eternizados para sempre." |
| 2 | 0:08–0:18 | "Somos a Adonai Fotocine. Há mais de 12 anos, transformamos casamentos, ensaios e celebrações em memórias que atravessam gerações." |
| 3 | 0:18–0:30 | "Fotografia e filmagem cinematográfica, sensibilidade artística e cuidado técnico em cada detalhe — do primeiro olhar ao último abraço da festa." |
| 4 | 0:30–0:42 | "Já registramos mais de 480 casamentos e ajudamos mais de 1.200 famílias a reviver suas emoções sempre que quiserem." |
| 5 | 0:42–0:54 | "Casamentos, pré-wedding, aniversários, formaturas: cada evento contado com a mesma dedicação, do primeiro contato à entrega do álbum." |
| 6 | 0:54–1:05 | "Deixe seu momento com quem entende de emoção. Fale com a Adonai Fotocine e vamos contar a sua história." |
| 7 | 1:05–1:10 | "Adonai Fotocine — eternizamos os momentos mais importantes da sua história." (assinatura/logo) |

## 2. Storyboard (cena a cena)

| Cena | Tempo | Vídeo / Animação | Narração | Nota de produção |
|------|-------|-------------------|----------|-------------------|
| 1 | 0:00–0:08 | Tela escura, partículas de luz dourada se formando; fade-in para still de casal em silhueta ao entardecer | Bloco 1 | Trilha instrumental suave entrando em crescendo |
| 2 | 0:08–0:18 | Logo da Adonai Fotocine anima (traço se desenhando); corte para 3–4 fotos reais do portfólio em transição suave (fade/slide) | Bloco 2 | Usar fotos do `galleryData` (categoria `casamento`) |
| 3 | 0:18–0:30 | Split screen: still fotográfico de um lado, still de filmagem/drone do outro | Bloco 3 | Reforça o serviço "Filmagem Cinematográfica" |
| 4 | 0:30–0:42 | Números animados subindo (contador): "12+ anos", "480+ casamentos", "1.200+ clientes" | Bloco 4 | Reaproveitar os mesmos números do contador da seção "Sobre" (`main.js`) para manter consistência |
| 5 | 0:42–0:54 | Grade de fotos rápida alternando entre categorias: casamento, pré-wedding, aniversário/debutante, formatura | Bloco 5 | Ritmo mais rápido, corte seco a cada ~2s |
| 6 | 0:54–1:05 | Cena de casal sorrindo/abraço, zoom lento (efeito Ken Burns) | Bloco 6 | Tom mais pessoal e caloroso |
| 7 | 1:05–1:10 | Logo final + tagline + WhatsApp/Instagram na tela | Bloco 7 | Manter na tela por 3–4s para leitura |

## 3. Como produzir

**Narração (voz):**
- Ferramentas sugeridas: ElevenLabs, Meta AI (o link que você compartilhou), ou o próprio TTS do Reach/Hostinger caso disponível.
- Gere em pt-BR, voz feminina ou masculina neutra e acolhedora, ritmo pausado.
- Exporte em `.mp3` ou `.wav`, 44.1kHz.

**Animação/montagem:**
- Ferramentas sugeridas: CapCut, InVideo, Canva Vídeo, ou a própria geração de vídeo do Meta AI.
- Use as fotos reais do portfólio (as mesmas do `galleryData` em `assets/js/main.js`) sempre que possível, em vez dos placeholders do Lorem Picsum.
- Adicione legendas embutidas (burned-in) ou um arquivo `.srt` — importante para acessibilidade e para quem assiste sem som.

**Publicação:**
- Suba o vídeo final em um canal do YouTube (pode ser "não listado") ou Vimeo.
- Ative as legendas (`cc_load_policy=1` já está configurado no player do site).
- Copie o ID do vídeo (ex.: em `https://youtube.com/watch?v=ABC123`, o ID é `ABC123`).

## 4. Como integrar no site

Em `index.html`, na seção `<section id="video-institucional">`, edite o atributo `data-video-id` do elemento `#video-player`:

```html
<div class="video-frame" id="video-player" data-video-id="SEU_ID_DO_YOUTUBE">
```

Substitua `SEU_ID_DO_YOUTUBE` pelo ID real do vídeo publicado. Também troque a imagem de prévia (poster) — busque por `adonai-video-poster` em `index.html` e substitua pela primeira thumbnail real do vídeo.

O player já está pronto: ao clicar em "reproduzir", o site carrega o iframe do YouTube sob demanda (sem afetar a performance de carregamento da página) e ativa a reprodução com legendas.
