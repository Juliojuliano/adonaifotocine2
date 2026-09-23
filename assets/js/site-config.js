/* =====================================================
   CONFIGURAÇÃO COMPARTILHADA
   Usada pelo site (assets/js/main.js) e pelo painel do
   cliente (admin/js/upload.js). Substitua pelos dados reais
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

  // Senha do painel de upload (admin/), em SHA-256 — nunca coloque a
  // senha em texto puro aqui. Senha padrão de fábrica: "adonai2026"
  // (TROQUE antes de divulgar o link do painel para o cliente).
  // Para gerar o hash de uma senha nova, abra o console do navegador
  // em qualquer página do site e rode:
  //   crypto.subtle.digest("SHA-256", new TextEncoder().encode("sua-senha-nova"))
  //     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))
  ADMIN_PASSWORD_SHA256: "73e76d35826c1623a5a4c82f091f3123151ac0c684d637bc346679a569fa0302"
};
