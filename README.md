# Adonai Fotocine — Landing Page

Landing page para estúdio de fotografia e filmagem de casamentos e eventos sociais. HTML/CSS/JS puro (sem framework de front-end), com Tailwind CSS compilado localmente (sem dependência de CDN em produção).

## Estrutura do projeto

```
├── index.html              # Página principal
├── admin/
│   └── index.html          # Instruções para o cliente cadastrar um evento novo
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # CSS gerado pelo Tailwind (não editar à mão)
│   │   └── styles.css      # Estilos customizados (lightbox, carrossel, cards de evento)
│   ├── js/
│   │   ├── site-config.js  # Configuração central (Formspree, WhatsApp, eventos)
│   │   └── main.js         # Toda a interatividade (menu, filtros, formulário, eventos, etc.)
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

### 5. Eventos do cliente (a Adonai FotoCine posta os próprios eventos)

Existe uma seção **"Últimos eventos"** no site e uma página **`/admin/`**
com instruções, para a Adonai FotoCine cadastrar cada evento sozinha, sem
mexer em código. Não usa nenhum serviço pago nem chave secreta — só um
Google Formulário (que alimenta uma Planilha) e um álbum do Google Fotos,
ferramentas que o estúdio já deve ter/usar.

**Como funciona:** depois de cada evento, o cliente sobe as fotos num
álbum do Google Fotos e preenche um formulário curto (nome, data,
categoria, link do álbum). O site busca as respostas desse formulário
direto de uma planilha do Google publicada como CSV, e monta os cards
automaticamente — sem backend, sem senha, sem conta paga.

#### Configuração (única vez, ~5 minutos)

1. Crie um **Google Formulário** ([forms.google.com](https://forms.google.com))
   com exatamente estas 4 perguntas, **nesta ordem**:
   1. `Nome do evento` — resposta curta
   2. `Data do evento` — resposta curta (ex: peça o formato "dd/mm/aaaa" na descrição da pergunta)
   3. `Categoria` — múltipla escolha, com as opções: `Casamento`, `Pré-Wedding`, `Making Of`, `Vídeo`
   4. `Link do álbum do Google Fotos` — resposta curta

   A ordem importa: o site lê as colunas da planilha de respostas nessa
   sequência.

2. Na aba **Respostas** do formulário, clique no ícone verde do Sheets
   para criar a planilha vinculada automaticamente.
3. Na planilha criada, vá em **Arquivo → Compartilhar → Publicar na
   web**. Escolha a aba de respostas, formato **CSV**, e clique em
   **Publicar**. Copie a URL gerada (algo como
   `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`).
4. Copie também o **link para preencher o formulário** (botão "Enviar" no
   Google Forms → ícone de link).
5. Edite `assets/js/site-config.js`:

   ```js
   EVENTS_FORM_URL: "https://forms.gle/xxxxxxxx",
   EVENTS_SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/xxxxx/pub?output=csv",
   ```

6. Publique (`git add`, `commit`, `push` — não precisa rodar `build:css`,
   essa parte não mexe no Tailwind).

#### Uso pelo cliente

1. Depois de cada evento, o cliente acessa `seudominio.com/admin/` — link
   fixo que você passa a ele (não aparece no menu do site).
2. Segue as duas instruções da página: sobe as fotos num álbum do Google
   Fotos e clica em "Abrir formulário do evento".
3. Preenche as 4 perguntas e envia.
4. Em poucos minutos (o tempo do Google atualizar o CSV publicado, geralmente
   quase instantâneo) o evento aparece na seção "Últimos eventos" do site.

#### Limitações — importante estar ciente

- **Não existe controle de acesso no Google Formulário** por padrão —
  qualquer pessoa com o link consegue enviar uma resposta. Para um
  estúdio pequeno isso costuma ser um risco baixo (o link não é
  divulgado publicamente), mas se quiser mais controle dá para restringir
  o formulário a contas de um domínio específico nas configurações dele.
- As fotos em si continuam hospedadas no Google Fotos do cliente, fora do
  seu controle — se ele apagar o álbum ou mudar a permissão de
  compartilhamento, o link para de funcionar no site.
- Para remover um evento errado, edite/apague a linha correspondente
  direto na planilha do Google Sheets.

## Funcionalidades incluídas

- Header fixo com destaque de seção ativa (scroll-spy) e menu mobile acessível.
- Seção "Sobre" com contadores animados ao entrar na viewport.
- Grade de serviços.
- Portfólio com filtros por categoria e lightbox com navegação por teclado (Esc / setas).
- Seção "Últimos eventos" + página `/admin/` para o cliente cadastrar os próprios eventos, sem mexer em código — ver seção "Eventos do cliente" acima.
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
