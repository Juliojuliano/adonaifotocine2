# Diretrizes do projeto — Adonai Fotocine

## Perfil e princípios gerais

Ao trabalhar neste repositório, aja como um desenvolvedor full-stack sênior:
entregue código de nível de produção — limpo, legível, seguro e sem bugs.

- **Zero bugs & resiliência**: trate erros de forma explícita (fetch,
  formulários, upload), valide entradas do usuário e cubra estados de
  carregamento/erro na UI (não deixe telas "penduradas" sem feedback).
- **Performance & SEO**: mantenha imagens otimizadas (lazy loading,
  dimensões explícitas), HTML semântico, meta tags Open Graph completas e
  CSS/JS enxutos (o Tailwind já é compilado localmente, sem CDN em
  produção).
- **Padrão profissional**: responsividade mobile-first, acessibilidade
  (WCAG — labels, `aria-*`, navegação por teclado, `prefers-reduced-motion`),
  paleta e tipografia consistentes com a marca (`tailwind.config.js`).
- **Simplicidade acima de tudo**: o front-end é estático (HTML/CSS/JS
  puro + Tailwind compilado, sem framework). O único código de servidor é
  a função serverless `api/gallery.js` (Vercel) — ver "Painel do
  fotógrafo" abaixo para o motivo dela existir. Prefira sempre a solução
  mais simples que resolva o problema real — evite introduzir frameworks
  ou serviços novos sem necessidade comprovada. O histórico deste projeto
  já teve duas tentativas mais complexas de painel de fotos revertidas; a
  versão atual (Cloudinary com upload unsigned + compressão no navegador)
  foi escolhida por ser a mais simples que ainda funciona de ponta a
  ponta.

## Módulo especial: painel do fotógrafo

O painel em `/admin/` segue duas regras de autonomia e privacidade:

1. **Separação de responsabilidades**: o código entrega a infraestrutura
   (upload otimizado, compressão automática, galeria dinâmica). A Adonai
   FotoCine usa o painel para publicar fotos de eventos sem precisar
   editar código ou pedir suporte técnico.
2. **Simplicidade deliberada**: a senha do painel (`admin/`) é uma senha
   combinada (hash SHA-256 em `assets/js/site-config.js`), não uma
   autenticação real — é suficiente para o uso interno atual. Não escale
   isso para autenticação de verdade (Supabase/Firebase/NextAuth) a menos
   que explicitamente solicitado — isso mudaria a arquitetura de site
   estático para aplicação com backend, uma decisão que cabe ao dono do
   projeto.
3. **Compressão obrigatória**: toda foto enviada pelo painel é
   redimensionada e comprimida no navegador antes do upload (ver
   `UPLOAD_MAX_DIMENSION_PX` / `UPLOAD_JPEG_QUALITY` em
   `assets/js/site-config.js`), para não pesar no Cloudinary nem no
   carregamento do site.
4. **Por que existe `api/gallery.js`**: a Cloudinary bloqueia a listagem
   pública de fotos por tag nesta conta (`Resources of type list are
   restricted`), e essa restrição não é sempre reversível pelas
   configurações de Security da conta (foi testado e confirmado neste
   projeto em 2026-09). Por isso a lista de eventos/fotos publicadas fica
   num JSON no Vercel Blob, lido/escrito por essa função — as fotos em si
   continuam hospedadas e servidas direto pelo Cloudinary. Antes de
   remover essa peça achando que é complexidade desnecessária, releia
   este motivo.

## Antes de propor uma reescrita de arquitetura

Este projeto já passou por idas e vindas (Cloudinary → Google
Forms/Sheets → revertido → Cloudinary novamente). Se uma tarefa futura
pedir uma arquitetura bem mais complexa (ex: Next.js + Supabase, Auth,
RLS, galerias privadas por senha por evento), trate isso como uma decisão
de produto, não uma implicação técnica automática — confirme escopo e
trade-offs com o usuário antes de reescrever a stack.
