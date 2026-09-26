/* =====================================================
   CONFIGURAÇÃO COMPARTILHADA
   Usada pelo site (assets/js/main.js) e pelo painel do
   fotógrafo (admin/js/upload.js). Substitua pelos dados reais
   do seu negócio / integrações — veja o passo a passo em
   README.md.
===================================================== */
window.SITE_CONFIG = {
  // Formulário de contato — https://formspree.io
  FORM_ENDPOINT: "https://formspree.io/f/SEU_FORM_ID",

  // WhatsApp (DDI + DDD + número, só dígitos)
  WHATSAPP_NUMBER: "5511900000000",

  // Cloudinary — https://cloudinary.com (conta gratuita)
  // Cloud name: aparece no topo do Dashboard do Cloudinary.
  CLOUDINARY_CLOUD_NAME: "SEU_CLOUD_NAME",
  // Upload preset "unsigned": Settings → Upload → Upload presets → Add.
  CLOUDINARY_UPLOAD_PRESET: "SEU_UPLOAD_PRESET",

  // Senha do painel do fotógrafo (admin/), em SHA-256 — nunca coloque a
  // senha em texto puro aqui. Senha padrão de fábrica: "adonai2026"
  // (TROQUE antes de divulgar o link do painel).
  // Para gerar o hash de uma senha nova, abra o console do navegador
  // em qualquer página do site e rode:
  //   crypto.subtle.digest("SHA-256", new TextEncoder().encode("sua-senha-nova"))
  //     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))
  ADMIN_PASSWORD_SHA256: "73e76d35826c1623a5a4c82f091f3123151ac0c684d637bc346679a569fa0302",

  // Limite de compressão aplicado no navegador antes do envio, para as
  // fotos não pesarem: cada imagem é redimensionada (mantendo a
  // proporção) até este tamanho máximo no lado maior e reexportada como
  // JPEG na qualidade abaixo. Ajuste se quiser fotos maiores/menores.
  UPLOAD_MAX_DIMENSION_PX: 2000,
  UPLOAD_JPEG_QUALITY: 0.82
};
