/* =====================================================
   CONFIGURAÇÃO COMPARTILHADA
   Usada pelo site (assets/js/main.js) e pela página de
   instruções do cliente (admin/index.html). Substitua pelos
   dados reais do seu negócio / integrações — veja o passo a
   passo em README.md.
===================================================== */
window.SITE_CONFIG = {
  // Formulário de contato — https://formspree.io
  FORM_ENDPOINT: "https://formspree.io/f/SEU_FORM_ID",

  // WhatsApp (DDI + DDD + número, só dígitos)
  WHATSAPP_NUMBER: "5511900000000",

  // Eventos postados pelo cliente (Google Forms + Google Sheets).
  // Veja o passo a passo completo em README.md, seção "Eventos do cliente".
  //
  // 1) Link do Google Formulário que o cliente preenche após cada evento
  //    (aparece na página /admin/ como botão "Postar novo evento").
  EVENTS_FORM_URL: "COLE_AQUI_O_LINK_DO_FORMULARIO",
  //
  // 2) URL pública em CSV da planilha de respostas desse formulário
  //    (Google Sheets → Arquivo → Compartilhar → Publicar na web → CSV).
  //    É o que o site usa para buscar e mostrar os eventos automaticamente.
  EVENTS_SHEET_CSV_URL: "COLE_AQUI_A_URL_CSV_DA_PLANILHA"
};
