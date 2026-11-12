# Adonai Fotocine — Landing Page

Landing page para estúdio de fotografia e filmagem de casamentos e eventos sociais. HTML/CSS/JS puro no front-end (sem framework), com Tailwind CSS compilado localmente (sem dependência de CDN em produção). O único código de servidor é uma função serverless pequena (`api/gallery.js`) que guarda a lista de fotos publicadas — ver seção 3.

## Estrutura do projeto

```
├── index.html              # Página principal
├── admin/
│   ├── index.html          # Painel do fotógrafo (senha + upload de fotos)
│   └── js/
│       └── upload.js       # Portão de senha, compressão, envio ao Cloudinary e publicação do evento
├── api/
│   └── gallery.js          # Função serverless (Vercel): guarda/lê a lista de eventos publicados
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # CSS gerado pelo Tailwind (não editar à mão)
│   │   └── styles.css      # Estilos customizados (lightbox, carrossel, animações)
│   ├── js/
│   │   ├── site-config.js  # Configuração compartilhada (site + painel)
│   │   └── main.js         # Toda a interatividade (menu, galeria, lightbox, formulário, etc.)
│   ├── fonts/              # Playfair Display e Poppins (woff2, hospedadas localmente)
│   ├── img/
│   │   ├── logo.webp         # Logo completo, fundo transparente (rodapé)
│   │   ├── logo.png          # Mesmo logo em PNG (usado só nos dados estruturados/SEO)
│   │   ├── logo-simbolo.webp # Só o símbolo (header)
│   │   └── mascote.webp      # Mascote animado
│   └── favicon.svg
├── src/
│   └── input.css           # Fonte do Tailwind (@tailwind base/components/utilities)
├── tailwind.config.js       # Cores e fontes da marca
├── vercel.json              # Cabeçalhos de segurança (CSP) e de cache
└── package.json
```

## Como rodar localmente

Pré-requisito: Node.js 18+ (apenas para compilar o CSS do Tailwind; a página final não precisa de Node para funcionar).

```bash
npm install
npm run build:css     # gera assets/css/tailwind.css
npm run serve         # sobe um servidor local em http://localhost:8080
```

Ou simplesmente abra o `index.html` diretamente no navegador depois de rodar `npm run build:css` uma vez.

Durante o desenvolvimento, use `npm run watch:css` para recompilar o Tailwind automaticamente a cada alteração no HTML/JS.

## Configuração obrigatória antes de publicar

### 1. Dados de contato reais

Os dados de contato reais já estão preenchidos. Se algum mudar, atualize em todos os lugares:

- Número de WhatsApp: procure por `5511965754892` em `index.html` e `assets/js/site-config.js` (formato DDI+DDD+número, só dígitos).
- E-mail: procure por `adonaifotocine@gmail.com` em `index.html`.
- Redes sociais: links de Instagram/Facebook em `index.html` (seção "Contato" e rodapé).
- Região de atendimento e horário de funcionamento (seção "Contato").
- Os mesmos dados aparecem no bloco de dados estruturados (`<script type="application/ld+json">` no `<head>`), que o Google usa nos resultados de busca — mantenha-o em sincronia.

Textos que precisam de revisão do dono do negócio antes de divulgar: as respostas da seção "Dúvidas Frequentes" (foram escritas de forma genérica) e o selo "12+ anos" da seção "Sobre".

### 2. Imagens

As imagens são geradas dinamicamente via [Lorem Picsum](https://picsum.photos) (`https://picsum.photos/seed/...`) como placeholders reais e estáveis. Substitua pelas fotos reais do portfólio:

- Hero, foto "Sobre" e imagem do Open Graph/Twitter: busque por `picsum.photos` em `index.html` (estão marcadas com `TODO(conteúdo)`).
- Vídeo de destaque: preencha `SHOWREEL_YOUTUBE_ID` em `assets/js/site-config.js` com o ID de um vídeo do YouTube para a seção "Assista a um dos nossos filmes" aparecer (vazio = seção oculta).
- Se passar a carregar imagens, scripts ou vídeos de outro domínio, libere-o na `Content-Security-Policy` em `vercel.json` — senão o navegador bloqueia.
- Galeria do portfólio: assim que o painel do fotógrafo (seção 3 abaixo) estiver configurado, as fotos reais substituem automaticamente os placeholders. Enquanto isso não acontece (ou se preferir manter uma amostra fixa), edite o array `fallbackGalleryData` no início de `assets/js/main.js` — cada item tem `seed` (usado para montar a URL), `category` (`casamento`, `pre-wedding`, `making-of`, `video`) e `alt` (texto alternativo para acessibilidade).

### 3. Painel do fotógrafo (upload de fotos dos eventos)

O site tem um painel simples em `/admin/` para a Adonai postar as fotos de cada evento direto do navegador, sem editar código. As fotos em si vão para o [Cloudinary](https://cloudinary.com) (plano gratuito); a **lista** de quais fotos foram publicadas (evento, categoria, data) fica guardada num arquivo JSON no [Vercel Blob](https://vercel.com/docs/storage/vercel-blob), lido/escrito pela função serverless `api/gallery.js`.

> **Por que não usar só o Cloudinary?** A Cloudinary bloqueia por padrão a listagem pública de fotos por tag em contas novas (erro `Resources of type list are restricted`), e essa restrição não é sempre reversível pelo painel de Security da conta. Por isso a lista de fotos publicadas vive num JSON próprio, e as fotos continuam hospedadas e servidas direto pelo Cloudinary (isso não muda).

**Antes de enviar, cada foto é redimensionada e comprimida no próprio navegador** (limite configurável em `UPLOAD_MAX_DIMENSION_PX`/`UPLOAD_JPEG_QUALITY`, padrão 2000px no lado maior e qualidade JPEG 82%), para não subir arquivos pesados nem estourar a cota gratuita.

Passo a passo (Cloudinary):

1. Crie uma conta gratuita em [cloudinary.com](https://cloudinary.com).
2. No Dashboard, copie o **Cloud name**.
3. Vá em **Settings → Upload → Upload presets → Add upload preset**, marque o modo como **Unsigned** e salve. Copie o nome do preset.
4. Edite `assets/js/site-config.js` e preencha `CLOUDINARY_CLOUD_NAME` e `CLOUDINARY_UPLOAD_PRESET`.
5. Defina a senha do painel: gere o hash SHA-256 da senha escolhida (instruções em comentário no próprio arquivo) e cole em `ADMIN_PASSWORD_SHA256`.

Passo a passo (Vercel — necessário para o `api/gallery.js` funcionar):

6. No projeto do Vercel, crie um **Blob store** (Storage → Create Database → Blob) — isso já injeta a variável `BLOB_READ_WRITE_TOKEN` automaticamente no projeto.
7. Em **Settings → Environment Variables**, adicione `ADMIN_PASSWORD_SHA256` com o **mesmo hash** usado no passo 5 (o servidor usa essa cópia para validar quem pode publicar; nunca deixe a senha em texto puro).
8. Faça o deploy. Acesse `/admin/` (ou o link "Área do fotógrafo" no rodapé do site), informe a senha, preencha nome/data/categoria do evento e selecione as fotos.

O painel também lista as fotos já publicadas (seção "Fotos publicadas"), cada uma com um pequeno ícone de lixeira para remover a foto da galeria do site.

**Limitações importantes:**
- A senha do painel é só uma senha combinada (hash comparado tanto no navegador quanto no servidor), não é autenticação de verdade — qualquer pessoa com a senha e o link consegue postar fotos. Não use para dados sensíveis de clientes.
- O upload pro Cloudinary é "unsigned": qualquer pessoa que descubra o cloud name + upload preset também consegue subir arquivos para a conta Cloudinary. Para reduzir o risco, no preset do Cloudinary limite formatos aceitos (`image`), tamanho máximo e, se quiser, restrinja por pasta.
- Sem o Cloudinary configurado, o painel mostra um aviso e a galeria do site continua funcionando com as fotos de exemplo (fallback). Sem o `api/gallery.js` implantado (por exemplo, se o site for publicado em um host sem funções serverless, como GitHub Pages), a galeria também cai no fallback — ver seção "Deploy".
- Excluir uma foto pelo painel remove só a entrada dela na lista pública (o site para de mostrá-la); o arquivo continua guardado no Cloudinary. Apagar de verdade do Cloudinary exige uma chamada assinada com a API secret, que propositalmente não é exposta no navegador — se quiser liberar espaço de vez, remova o arquivo direto pelo painel do Cloudinary.

### 4. SEO

Em `index.html` já existem `<title>`, `<meta name="description">`, Open Graph, Twitter Card, `<link rel="canonical">` e dados estruturados (JSON-LD). Ao migrar para um domínio próprio, troque `https://adonaifotocine2.vercel.app` nesses pontos e também em `sitemap.xml` e `robots.txt`.

## Funcionalidades incluídas

- Header fixo com destaque de seção ativa (scroll-spy) e menu mobile acessível.
- Seção "Sobre" com animação de entrada ao rolar.
- Grade de serviços.
- Portfólio com filtros por categoria, paginação ("Ver mais fotos") e lightbox com navegação por teclado (Esc / setas), foco preso no diálogo e swipe no celular.
- Seção de vídeo opcional (YouTube carregado só no clique).
- Dúvidas frequentes (`<details>` nativo, funciona sem JavaScript).
- Formulário de orçamento que monta a mensagem e abre o WhatsApp já preenchido (nada é enviado a servidor).
- Painel do fotógrafo (`/admin/`) para postar fotos dos eventos direto do navegador, com compressão automática antes do envio.
- Carrossel de depoimentos com autoplay (pausável, e desligado para quem usa `prefers-reduced-motion`), setas, dots e suporte a swipe no touch.
- Botão flutuante de WhatsApp e "voltar ao topo".
- Acessível: navegação por teclado, `aria-label`/`aria-live`, skip link, contraste conforme WCAG AA, `prefers-reduced-motion` respeitado.
- Responsivo de 320px até telas 4K.

## Deploy

O front-end é estático, mas o painel do fotógrafo depende da função serverless em `api/gallery.js` e de um Vercel Blob store — por isso o deploy recomendado é a **[Vercel](https://vercel.com)**, que suporta as duas coisas nativamente sem configuração extra (basta rodar `npm run build:css` antes, se for subir os arquivos manualmente).

Publicar em um host puramente estático (Netlify sem functions, GitHub Pages) ainda funciona para o site em si, mas o painel de upload não vai conseguir publicar fotos na galeria (a chamada a `/api/gallery` falha e o site cai no fallback estático).

O deploy é automático: a cada push na **Production Branch** (`main`) do repositório conectado na Vercel (*Settings → Git*), um novo deploy de produção é gerado.
