# Adonai Fotocine — Landing Page

Landing page para estúdio de fotografia e filmagem de casamentos e eventos sociais. HTML/CSS/JS puro (sem framework de front-end), com Tailwind CSS compilado localmente (sem dependência de CDN em produção).

## Estrutura do projeto

```
├── index.html              # Página principal
├── admin/
│   ├── index.html          # Painel de upload de fotos (para o cliente)
│   └── js/upload.js        # Lógica do painel: senha + envio pro Cloudinary
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # CSS gerado pelo Tailwind (não editar à mão)
│   │   └── styles.css      # Estilos customizados (lightbox, carrossel, animações)
│   ├── js/
│   │   ├── site-config.js  # Configuração central (Formspree, WhatsApp, Cloudinary, senha)
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

O hero, a foto da seção "Sobre" e a imagem do Open Graph usam [Lorem Picsum](https://picsum.photos) (`https://picsum.photos/seed/...`) como placeholder. Busque por `picsum.photos` em `index.html` e substitua pelas fotos reais.

A **galeria do portfólio** funciona diferente: ela é carregada automaticamente do painel de upload (ver seção 5 abaixo). Enquanto o painel não estiver configurado, ela cai de volta no array `fallbackGalleryData` no início de `assets/js/main.js` (mesmo esquema de antes: `seed`, `category`, `alt`).

### 4. SEO

Em `index.html`, revise `<title>`, `<meta name="description">`, as tags Open Graph e adicione um `<link rel="canonical">` com o domínio final do site.

### 5. Painel de upload (o cliente posta as próprias fotos)

Existe um painel em **`/admin/`** onde a Adonai FotoCine consegue subir as
fotos de cada evento sozinha, sem precisar editar código nem depender de
quem desenvolveu o site. As fotos enviadas por lá aparecem automaticamente
na galeria do portfólio em poucos segundos.

**Como funciona:** o painel sobe as fotos direto do navegador para o
[Cloudinary](https://cloudinary.com) (serviço de hospedagem de imagens,
gratuito até um volume generoso — suficiente para um estúdio pequeno/médio).
Não existe servidor/backend: a página principal do site busca as fotos mais
recentes direto do Cloudinary a cada carregamento, filtradas por categoria.

#### Configuração (única vez, ~5 minutos)

1. Crie uma conta gratuita em [cloudinary.com](https://cloudinary.com).
2. No Dashboard, copie o **Cloud name** (aparece no topo).
3. Vá em **Settings → Upload → Upload presets → Add upload preset**:
   - Signing Mode: **Unsigned**
   - Dê um nome ao preset (ex: `adonai_gallery`) e salve.
4. Vá em **Settings → Security** e habilite a opção de **listagem pública
   de recursos** ("Resource list" / "Allow list resources"). Sem isso, o
   site não consegue buscar as fotos publicamente.
5. Edite `assets/js/site-config.js`:

   ```js
   CLOUDINARY_CLOUD_NAME: "seu-cloud-name-aqui",
   CLOUDINARY_UPLOAD_PRESET: "adonai_gallery",
   ```

6. Troque a senha do painel (senha de fábrica: `adonai2026` — **troque antes
   de divulgar o link para o cliente**). Para gerar o hash de uma senha
   nova, abra o console do navegador em qualquer página do site e rode:

   ```js
   crypto.subtle.digest("SHA-256", new TextEncoder().encode("sua-senha-nova"))
     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))
   ```

   Cole o resultado em `ADMIN_PASSWORD_SHA256` em `site-config.js`.

7. Rode `npm run build:css` de novo (a pasta `admin/` também usa Tailwind) e publique.

#### Uso pelo cliente

1. Acesse `seudominio.com/admin/` (não aparece no menu do site — é um link
   direto que você passa só para o cliente).
2. Digite a senha combinada.
3. Preencha nome do evento, data, categoria (Casamento, Pré-Wedding, Making
   Of ou Vídeo) e selecione as fotos.
4. Clique em "Enviar fotos" — acompanha o progresso na tela.
5. As fotos já aparecem no site (aba "Ver no site" ao final do envio).

#### Limitações — importante estar ciente

- **A senha do painel não é autenticação de verdade.** É uma barreira
  simples (senha combinada + hash SHA-256), suficiente para uso interno,
  mas visível/quebrável por alguém com conhecimento técnico que realmente
  queira tentar. Não é o lugar para dados sensíveis de clientes — só fotos
  de divulgação do portfólio.
- Sem edição/exclusão pelo painel ainda: para remover uma foto publicada
  por engano, é preciso apagar pelo painel do próprio Cloudinary
  (Media Library).
- O plano gratuito do Cloudinary tem limite de armazenamento/tráfego
  mensal — para um estúdio com muitos eventos grandes, vale acompanhar o
  uso no dashboard deles e considerar um plano pago se necessário.

## Funcionalidades incluídas

- Header fixo com destaque de seção ativa (scroll-spy) e menu mobile acessível.
- Seção "Sobre" com contadores animados ao entrar na viewport.
- Grade de serviços.
- Portfólio com filtros por categoria e lightbox com navegação por teclado (Esc / setas).
- Painel de upload (`/admin/`) para o cliente postar as próprias fotos de cada evento, sem mexer em código — ver seção "Painel de upload" acima.
- Carrossel de depoimentos com autoplay, setas, dots e suporte a swipe no touch.
- Formulário de contato com validação client-side, proteção anti-spam (honeypot) e os 4 estados visuais (ocioso, carregando, sucesso, erro).
- Botão flutuante de WhatsApp e "voltar ao topo".
- Acessível: navegação por teclado, `aria-label`/`aria-live`, skip link, contraste conforme WCAG AA, `prefers-reduced-motion` respeitado.
- Responsivo de 320px até telas 4K.

## Deploy

Por ser um site estático, pode ser publicado em qualquer um destes serviços (basta rodar `npm run build:css` antes e subir a pasta inteira, exceto `node_modules/`):

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- GitHub Pages
