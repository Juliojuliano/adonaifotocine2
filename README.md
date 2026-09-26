# Adonai Fotocine — Landing Page

Landing page para estúdio de fotografia e filmagem de casamentos e eventos sociais. HTML/CSS/JS puro no front-end (sem framework), com Tailwind CSS compilado localmente (sem dependência de CDN em produção). O único código de servidor é uma função serverless pequena (`api/gallery.js`) que guarda a lista de fotos publicadas — ver seção 4.

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
│   │   └── main.js         # Toda a interatividade (menu, filtros, formulário, galeria, etc.)
│   └── favicon.svg
├── src/
│   └── input.css           # Fonte do Tailwind (@tailwind base/components/utilities)
├── tailwind.config.js       # Cores e fontes da marca
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

### 1. Formulário de contato

O formulário (seção "Contato") envia os dados via `fetch` para um endpoint externo. Por padrão ele está **sem configuração real** e mostra uma mensagem instruindo o visitante a usar o WhatsApp.

Para ativar o envio de e-mails de verdade:

1. Crie uma conta gratuita em [Formspree](https://formspree.io) (ou serviço equivalente).
2. Crie um formulário e copie o endpoint gerado (algo como `https://formspree.io/f/xxxxxxxx`).
3. Edite `assets/js/site-config.js` e substitua o valor de `FORM_ENDPOINT`.

```js
window.SITE_CONFIG = {
  FORM_ENDPOINT: "https://formspree.io/f/xxxxxxxx", // <- cole aqui
  WHATSAPP_NUMBER: "5511900000000",
  // ...
};
```

### 2. Dados de contato reais

Substitua os dados de exemplo (placeholders) pelos dados reais do negócio:

- Número de WhatsApp: procure por `5511900000000` em `index.html` e `assets/js/site-config.js` e troque pelo número real (formato DDI+DDD+número, só dígitos).
- E-mail: `contato@adonaifotocine.com.br` → e-mail real.
- Redes sociais: links de Instagram/Facebook em `index.html` (seções "Contato" e rodapé).
- Endereço/região de atendimento e horário de funcionamento (seção "Contato").
- CNPJ no rodapé (ou remova a linha, se não aplicável).

### 3. Imagens

As imagens são geradas dinamicamente via [Lorem Picsum](https://picsum.photos) (`https://picsum.photos/seed/...`) como placeholders reais e estáveis. Substitua pelas fotos reais do portfólio:

- Hero, foto "Sobre" e imagem do Open Graph: busque por `picsum.photos` em `index.html`.
- Galeria do portfólio: assim que o painel do fotógrafo (seção 4 abaixo) estiver configurado, as fotos reais substituem automaticamente os placeholders. Enquanto isso não acontece (ou se preferir manter uma amostra fixa), edite o array `fallbackGalleryData` no início de `assets/js/main.js` — cada item tem `seed` (usado para montar a URL), `category` (`casamento`, `pre-wedding`, `making-of`, `video`) e `alt` (texto alternativo para acessibilidade).

### 4. Painel do fotógrafo (upload de fotos dos eventos)

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

**Limitações importantes:**
- A senha do painel é só uma senha combinada (hash comparado tanto no navegador quanto no servidor), não é autenticação de verdade — qualquer pessoa com a senha e o link consegue postar fotos. Não use para dados sensíveis de clientes.
- O upload pro Cloudinary é "unsigned": qualquer pessoa que descubra o cloud name + upload preset também consegue subir arquivos para a conta Cloudinary. Para reduzir o risco, no preset do Cloudinary limite formatos aceitos (`image`), tamanho máximo e, se quiser, restrinja por pasta.
- Sem o Cloudinary configurado, o painel mostra um aviso e a galeria do site continua funcionando com as fotos de exemplo (fallback). Sem o `api/gallery.js` implantado (por exemplo, se o site for publicado em um host sem funções serverless, como GitHub Pages), a galeria também cai no fallback — ver seção "Deploy".

### 5. SEO

Em `index.html`, revise `<title>`, `<meta name="description">`, as tags Open Graph e adicione um `<link rel="canonical">` com o domínio final do site.

## Funcionalidades incluídas

- Header fixo com destaque de seção ativa (scroll-spy) e menu mobile acessível.
- Seção "Sobre" com contadores animados ao entrar na viewport.
- Grade de serviços.
- Portfólio com filtros por categoria e lightbox com navegação por teclado (Esc / setas).
- Painel do fotógrafo (`/admin/`) para postar fotos dos eventos direto do navegador, com compressão automática antes do envio.
- Carrossel de depoimentos com autoplay, setas, dots e suporte a swipe no touch.
- Formulário de contato com validação client-side, proteção anti-spam (honeypot) e os 4 estados visuais (ocioso, carregando, sucesso, erro).
- Botão flutuante de WhatsApp e "voltar ao topo".
- Acessível: navegação por teclado, `aria-label`/`aria-live`, skip link, contraste conforme WCAG AA, `prefers-reduced-motion` respeitado.
- Responsivo de 320px até telas 4K.

## Deploy

O front-end é estático, mas o painel do fotógrafo depende da função serverless em `api/gallery.js` e de um Vercel Blob store — por isso o deploy recomendado é a **[Vercel](https://vercel.com)**, que suporta as duas coisas nativamente sem configuração extra (basta rodar `npm run build:css` antes, se for subir os arquivos manualmente).

Publicar em um host puramente estático (Netlify sem functions, GitHub Pages) ainda funciona para o site em si, mas o painel de upload não vai conseguir publicar fotos na galeria (a chamada a `/api/gallery` falha e o site cai no fallback estático).
