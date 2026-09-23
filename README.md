# Adonai Fotocine — Landing Page

Landing page para estúdio de fotografia e filmagem de casamentos e eventos sociais. HTML/CSS/JS puro (sem framework de front-end), com Tailwind CSS compilado localmente (sem dependência de CDN em produção).

## Estrutura do projeto

```
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # CSS gerado pelo Tailwind (não editar à mão)
│   │   └── styles.css      # Estilos customizados (lightbox, carrossel, animações)
│   ├── js/
│   │   └── main.js         # Toda a interatividade (menu, filtros, formulário, etc.)
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
3. Edite `assets/js/main.js` e substitua o valor de `CONFIG.FORM_ENDPOINT` no topo do arquivo.

```js
const CONFIG = {
  FORM_ENDPOINT: "https://formspree.io/f/xxxxxxxx", // <- cole aqui
  WHATSAPP_NUMBER: "5511900000000"
};
```

### 2. Dados de contato reais

Substitua os dados de exemplo (placeholders) pelos dados reais do negócio:

- Número de WhatsApp: procure por `5511900000000` em `index.html` e `assets/js/main.js` e troque pelo número real (formato DDI+DDD+número, só dígitos).
- E-mail: `contato@adonaifotocine.com.br` → e-mail real.
- Redes sociais: links de Instagram/Facebook em `index.html` (seções "Contato" e rodapé).
- Endereço/região de atendimento e horário de funcionamento (seção "Contato").
- CNPJ no rodapé (ou remova a linha, se não aplicável).

### 3. Imagens

As imagens são geradas dinamicamente via [Lorem Picsum](https://picsum.photos) (`https://picsum.photos/seed/...`) como placeholders reais e estáveis. Substitua pelas fotos reais do portfólio:

- Hero, foto "Sobre" e imagem do Open Graph: busque por `picsum.photos` em `index.html`.
- Galeria do portfólio: edite o array `galleryData` no início de `assets/js/main.js` — cada item tem `seed` (usado para montar a URL), `category` (`casamento`, `pre-wedding`, `making-of`, `video`) e `alt` (texto alternativo para acessibilidade). Substitua `seed` por uma URL de imagem própria ou ajuste o template de URL.

### 4. SEO

Em `index.html`, revise `<title>`, `<meta name="description">`, as tags Open Graph e adicione um `<link rel="canonical">` com o domínio final do site.

## Funcionalidades incluídas

- Header fixo com destaque de seção ativa (scroll-spy) e menu mobile acessível.
- Seção "Sobre" com contadores animados ao entrar na viewport.
- Grade de serviços.
- Portfólio com filtros por categoria e lightbox com navegação por teclado (Esc / setas).
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
