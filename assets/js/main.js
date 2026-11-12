(function () {
  "use strict";

  /* =====================================================
     CONFIGURAÇÃO
     Centralizada em assets/js/site-config.js (compartilhada com
     o painel do fotógrafo em admin/). Edite os valores lá.
  ===================================================== */
  const CONFIG = window.SITE_CONFIG;

  // Preferência do sistema por menos animação (WCAG 2.3.3 / 2.2.2).
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Escapa texto antes de inseri-lo em HTML. Os nomes de evento vêm do
  // painel do fotógrafo — nunca confie em texto digitado por alguém.
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  /* ===================== Ano no rodapé ===================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===================== Header: fundo ao rolar ===================== */
  const header = document.getElementById("header");
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ===================== Menu mobile ===================== */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconMenu = document.getElementById("icon-menu");
  const iconClose = document.getElementById("icon-close");

  function closeMobileMenu() {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    iconMenu.classList.remove("hidden");
    iconClose.classList.add("hidden");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.remove("hidden");
      menuToggle.setAttribute("aria-expanded", "true");
      iconMenu.classList.add("hidden");
      iconClose.classList.remove("hidden");
    }
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ===================== Scroll-spy (nav ativo) ===================== */
  const sections = ["topo", "sobre", "servicos", "portfolio", "depoimentos", "contato"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll(".nav-link");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spyObserver.observe(s));

  /* ===================== Reveal ao rolar ===================== */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ===================== Portfólio: dados + render ===================== */

  // Fallback estático (placeholders) — usado enquanto o Cloudinary não
  // estiver configurado, ou se a busca das fotos reais falhar por
  // qualquer motivo. O site nunca fica com a galeria vazia.
  const fallbackGalleryData = [
    { id: 1, category: "casamento", seed: "adonai-wed-1", alt: "Noivos trocando alianças durante a cerimônia" },
    { id: 2, category: "casamento", seed: "adonai-wed-2", alt: "Noiva sorrindo ao ser preparada para a cerimônia" },
    { id: 3, category: "pre-wedding", seed: "adonai-pw-1", alt: "Casal em ensaio pré-wedding ao entardecer" },
    { id: 4, category: "making-of", seed: "adonai-mk-1", alt: "Making of da noiva colocando o vestido" },
    { id: 5, category: "casamento", seed: "adonai-wed-3", alt: "Festa de casamento com pista de dança iluminada" },
    { id: 6, category: "making-of", seed: "adonai-vid-1", alt: "Still de filmagem cinematográfica do casamento" },
    { id: 7, category: "pre-wedding", seed: "adonai-pw-2", alt: "Casal caminhando em ensaio ao ar livre" },
    { id: 8, category: "making-of", seed: "adonai-mk-2", alt: "Making of dos detalhes da decoração" },
    { id: 9, category: "casamento", seed: "adonai-wed-4", alt: "Buquê de flores da noiva em close" },
    { id: 10, category: "making-of", seed: "adonai-vid-2", alt: "Still de filmagem com drone da recepção" },
    { id: 11, category: "casamento", seed: "adonai-wed-5", alt: "Beijo do casal logo após a cerimônia" },
    { id: 12, category: "pre-wedding", seed: "adonai-pw-3", alt: "Ensaio de noivado em estúdio" }
  ].map((item) => ({
    ...item,
    thumbUrl: `https://picsum.photos/seed/${item.seed}/700/700`,
    fullUrl: `https://picsum.photos/seed/${item.seed}/1400/1400`
  }));

  const categoryLabels = {
    casamento: "Casamento",
    "pre-wedding": "Pré-Wedding",
    "making-of": "Making Of"
  };
  const categoryLabel = (category) => categoryLabels[category] || category;

  // A categoria "video" foi unida a "Making Of". Eventos já publicados pelo
  // painel com a categoria antiga continuam aparecendo, agora em "Making Of".
  function normalizeCategory(category) {
    return category === "video" ? "making-of" : category;
  }

  // encodeURI: o publicId pode conter espaços/acentos; as barras de pasta
  // precisam continuar como barras.
  function cloudinaryUrl(transform, publicId, format) {
    return `https://res.cloudinary.com/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${encodeURI(publicId)}.${encodeURIComponent(format)}`;
  }

  const PAGE_SIZE = CONFIG.GALLERY_PAGE_SIZE || 12;
  const FETCH_TIMEOUT_MS = 8000;

  const gallery = document.getElementById("gallery");
  const galleryStatus = document.getElementById("gallery-status");
  const galleryEmpty = document.getElementById("gallery-empty");
  const galleryMore = document.getElementById("gallery-more");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Estado da galeria: lista completa, filtro ativo e quantas fotos do
  // filtro atual já estão na tela.
  let galleryData = [];
  let currentFilter = "todos";
  let visibleCount = PAGE_SIZE;

  // Fotos do filtro atual — também é a lista que o lightbox percorre,
  // então as setas nunca saltam para uma foto de outra categoria.
  function filteredItems() {
    return currentFilter === "todos"
      ? galleryData
      : galleryData.filter((item) => item.category === currentFilter);
  }

  // Estado de carregamento: blocos cinza no lugar das fotos, para a tela
  // não ficar vazia (nem "pular") enquanto a lista é buscada.
  function renderGallerySkeleton() {
    gallery.setAttribute("aria-busy", "true");
    gallery.innerHTML = Array.from({ length: 6 }, () => '<div class="gallery-skeleton"></div>').join("");
  }

  function renderGallery() {
    const items = filteredItems();
    const visible = items.slice(0, visibleCount);

    gallery.setAttribute("aria-busy", "false");
    gallery.innerHTML = visible
      .map((item, index) => {
        const alt = escapeHtml(item.alt);
        return `
      <button type="button" class="gallery-item" data-index="${index}" aria-label="Ampliar foto: ${alt}">
        <img src="${escapeHtml(item.thumbUrl)}" alt="${alt}" loading="lazy" decoding="async" width="700" height="700">
        <span class="gallery-overlay"><span>${escapeHtml(categoryLabel(item.category))}</span></span>
      </button>`;
      })
      .join("");

    gallery.querySelectorAll(".gallery-item").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(parseInt(btn.dataset.index, 10), btn));
      // Foto que não carregou (removida do Cloudinary, rede ruim): some
      // da grade em vez de deixar um ícone de imagem quebrada.
      btn.querySelector("img").addEventListener("error", () => btn.classList.add("is-hidden"));
    });

    galleryEmpty.hidden = items.length > 0;
    galleryMore.hidden = items.length <= visibleCount;
    galleryStatus.textContent = items.length
      ? `Mostrando ${visible.length} de ${items.length} fotos.`
      : "";
  }

  galleryMore.addEventListener("click", () => {
    const firstNewIndex = visibleCount;
    visibleCount += PAGE_SIZE;
    renderGallery();
    // Leva o foco para a primeira foto nova: quem navega por teclado
    // continua de onde parou, e não do topo da página.
    const firstNew = gallery.querySelector(`[data-index="${firstNewIndex}"]`);
    if (firstNew) firstNew.focus();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle("is-active", isCurrent);
        b.setAttribute("aria-pressed", String(isCurrent));
      });
      currentFilter = btn.dataset.filter;
      visibleCount = PAGE_SIZE;
      renderGallery();
    });
  });

  // Busca os eventos publicados pelo fotógrafo (via /admin/) no nosso
  // próprio endpoint (api/gallery.js). As fotos em si continuam hospedadas
  // no Cloudinary — aqui só lemos a lista de quais fotos existem, porque a
  // listagem pública por tag do Cloudinary está bloqueada nesta conta.
  async function fetchPublishedItems() {
    // Sem timeout, uma API lenta deixaria a galeria "pendurada" no
    // estado de carregamento para sempre.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch("/api/gallery", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(`Falha ao buscar galeria (HTTP ${response.status})`);
      const data = await response.json();

      const items = [];
      (Array.isArray(data.events) ? data.events : []).forEach((event) => {
        const category = normalizeCategory(event.category);
        (Array.isArray(event.photos) ? event.photos : []).forEach((photo) => {
          if (!photo || !photo.publicId) return;
          const format = photo.format || "jpg";
          items.push({
            id: photo.publicId,
            category,
            alt: `${categoryLabel(category)} — ${event.eventName || "Adonai Fotocine"}`,
            thumbUrl: cloudinaryUrl("f_auto,q_auto,c_fill,w_700,h_700", photo.publicId, format),
            fullUrl: cloudinaryUrl("f_auto,q_auto,w_1600", photo.publicId, format)
          });
        });
      });
      return items;
    } finally {
      clearTimeout(timer);
    }
  }

  async function loadGallery() {
    renderGallerySkeleton();
    let items = [];
    try {
      items = await fetchPublishedItems();
    } catch (err) {
      // Erro de rede/timeout/config: o visitante vê o fallback; o motivo
      // fica no console para quem for investigar.
      console.warn("[galeria] usando fotos de exemplo:", err);
    }
    galleryData = items.length > 0 ? items : fallbackGalleryData;
    renderGallery();
  }
  loadGallery();

  /* ===================== Lightbox ===================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxError = document.getElementById("lightbox-error");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  let lightboxItems = [];
  let currentIndex = 0;
  let lastFocusedEl = null;

  lightboxImg.addEventListener("load", () => lightbox.classList.remove("is-loading"));
  lightboxImg.addEventListener("error", () => {
    lightbox.classList.remove("is-loading");
    lightbox.classList.add("has-error");
    lightboxError.hidden = false;
  });

  // Baixa a foto vizinha em segundo plano para a troca ser instantânea.
  function preloadLightboxImage(index) {
    const item = lightboxItems[(index + lightboxItems.length) % lightboxItems.length];
    if (item) new Image().src = item.fullUrl;
  }

  function updateLightboxImage() {
    const item = lightboxItems[currentIndex];
    lightbox.classList.remove("has-error");
    lightbox.classList.add("is-loading");
    lightboxError.hidden = true;
    lightboxImg.src = item.fullUrl;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = `${item.alt} (${currentIndex + 1} de ${lightboxItems.length})`;

    const single = lightboxItems.length < 2;
    lightboxPrev.hidden = single;
    lightboxNext.hidden = single;
    if (!single) {
      preloadLightboxImage(currentIndex + 1);
      preloadLightboxImage(currentIndex - 1);
    }
  }

  function openLightbox(index, triggerEl) {
    lightboxItems = filteredItems();
    if (!lightboxItems[index]) return;
    currentIndex = index;
    lastFocusedEl = triggerEl || document.activeElement;
    lightbox.hidden = false;
    updateLightboxImage();
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onLightboxKeydown);
    // Devolve o foco para a miniatura que abriu o lightbox.
    if (lastFocusedEl && document.contains(lastFocusedEl)) lastFocusedEl.focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxImage();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % lightboxItems.length;
    updateLightboxImage();
  }

  function onLightboxKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPrev();
    else if (e.key === "ArrowRight") showNext();
    else if (e.key === "Tab") {
      // Prende o foco dentro do diálogo: Tab no último botão volta ao
      // primeiro (e Shift+Tab no primeiro vai ao último).
      const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter((el) => !el.hidden);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!focusable.includes(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Deslizar o dedo para os lados troca de foto no celular.
  let lightboxTouchX = 0;
  lightbox.addEventListener("touchstart", (e) => (lightboxTouchX = e.touches[0].clientX), { passive: true });
  lightbox.addEventListener(
    "touchend",
    (e) => {
      if (lightboxItems.length < 2) return;
      const diff = e.changedTouches[0].clientX - lightboxTouchX;
      if (Math.abs(diff) > 50) diff > 0 ? showPrev() : showNext();
    },
    { passive: true }
  );

  /* ===================== Filme (showreel) ===================== */
  // Só aparece se SHOWREEL_YOUTUBE_ID estiver configurado. Mostramos
  // apenas a capa do vídeo; o player (pesado) é carregado no clique.
  const showreelId = (CONFIG.SHOWREEL_YOUTUBE_ID || "").trim();
  if (/^[\w-]{6,20}$/.test(showreelId)) {
    const showreel = document.getElementById("showreel");
    document.getElementById("filme").hidden = false;
    showreel.innerHTML = `
      <img src="https://i.ytimg.com/vi/${showreelId}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
      <button type="button" class="video-play" aria-label="Assistir ao filme (carrega o player do YouTube)">
        <span><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
      </button>`;
    showreel.querySelector("button").addEventListener("click", () => {
      showreel.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${showreelId}?autoplay=1&rel=0" title="Filme da Adonai Fotocine" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      showreel.querySelector("iframe").focus();
    });
  }

  /* ===================== Carrossel de depoimentos ===================== */
  const track = document.getElementById("testimonial-track");
  const slides = track ? Array.from(track.children) : [];
  const dotsContainer = document.getElementById("testimonial-dots");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  const pauseBtn = document.getElementById("testimonial-pause");
  let slideIndex = 0;
  let autoplayTimer = null;
  // Autoplay começa desligado para quem pediu menos movimento no sistema.
  let userPaused = prefersReducedMotion;

  function renderDots() {
    dotsContainer.innerHTML = slides
      .map((_, i) => `<button type="button" class="dot" aria-label="Ir para depoimento ${i + 1} de ${slides.length}" data-index="${i}"></button>`)
      .join("");

    dotsContainer.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.index, 10)));
    });
  }

  function goToSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    // Slides fora da tela ficam ocultos para leitores de tela.
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== slideIndex)));
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === slideIndex);
      if (i === slideIndex) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function startAutoplay() {
    stopAutoplay();
    if (userPaused || slides.length < 2) return;
    autoplayTimer = setInterval(() => goToSlide(slideIndex + 1), 6000);
  }

  function syncPauseButton() {
    pauseBtn.textContent = userPaused ? "Reproduzir" : "Pausar";
    pauseBtn.setAttribute("aria-pressed", String(userPaused));
    pauseBtn.setAttribute(
      "aria-label",
      userPaused ? "Retomar a troca automática de depoimentos" : "Pausar a troca automática de depoimentos"
    );
  }

  if (slides.length) {
    renderDots();
    goToSlide(0);
    syncPauseButton();

    if (slides.length < 2) {
      // Com um único depoimento não há o que navegar.
      [prevBtn, nextBtn, pauseBtn, dotsContainer].forEach((el) => (el.hidden = true));
    }

    prevBtn.addEventListener("click", () => {
      goToSlide(slideIndex - 1);
      startAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      goToSlide(slideIndex + 1);
      startAutoplay();
    });
    pauseBtn.addEventListener("click", () => {
      userPaused = !userPaused;
      syncPauseButton();
      startAutoplay();
    });

    // Pausa enquanto o visitante interage (mouse OU teclado) — WCAG 2.2.2.
    const testimonialSection = document.getElementById("depoimentos");
    testimonialSection.addEventListener("mouseenter", stopAutoplay);
    testimonialSection.addEventListener("mouseleave", startAutoplay);
    testimonialSection.addEventListener("focusin", stopAutoplay);
    testimonialSection.addEventListener("focusout", startAutoplay);
    // Aba em segundo plano: não gasta bateria trocando slides invisíveis.
    document.addEventListener("visibilitychange", () => (document.hidden ? stopAutoplay() : startAutoplay()));

    // Suporte a swipe em telas de toque
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
      "touchend",
      (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? goToSlide(slideIndex - 1) : goToSlide(slideIndex + 1);
          startAutoplay();
        }
      },
      { passive: true }
    );

    startAutoplay();
  }

  /* ===================== Formulário de orçamento → WhatsApp ===================== */
  // Nada é enviado a servidor: validamos os campos, montamos a mensagem e
  // abrimos o WhatsApp já preenchido. O fotógrafo recebe o contato com
  // tipo de evento, data e cidade — sem precisar perguntar tudo de novo.
  const quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    const fields = {
      name: document.getElementById("quote-name"),
      type: document.getElementById("quote-type"),
      date: document.getElementById("quote-date"),
      city: document.getElementById("quote-city"),
      message: document.getElementById("quote-message")
    };
    const quoteStatus = document.getElementById("quote-status");

    // Data local no formato AAAA-MM-DD (toISOString usaria UTC e poderia
    // "virar o dia" à noite no horário de Brasília).
    const now = new Date();
    const todayIso = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
    fields.date.min = todayIso;

    function setFieldError(field, message) {
      const errorEl = document.getElementById(`${field.id}-error`);
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = !message;
      }
    }

    // Cada validador devolve a mensagem de erro, ou "" se estiver tudo certo.
    const validators = {
      name: () => (fields.name.value.trim().length >= 2 ? "" : "Informe seu nome."),
      type: () => (fields.type.value ? "" : "Selecione o tipo de evento."),
      date: () => {
        if (fields.date.validity.badInput) return "Informe uma data válida.";
        if (fields.date.value && fields.date.value < todayIso) return "A data do evento precisa ser futura.";
        return "";
      }
    };

    // Depois do primeiro erro, corrige a mensagem assim que o campo é ajustado.
    Object.keys(validators).forEach((key) => {
      fields[key].addEventListener("input", () => {
        if (fields[key].getAttribute("aria-invalid") === "true") setFieldError(fields[key], validators[key]());
      });
    });

    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let firstInvalid = null;
      Object.keys(validators).forEach((key) => {
        const message = validators[key]();
        setFieldError(fields[key], message);
        if (message && !firstInvalid) firstInvalid = fields[key];
      });
      if (firstInvalid) {
        quoteStatus.textContent = "";
        firstInvalid.focus();
        return;
      }

      const lines = [
        `Olá! Meu nome é ${fields.name.value.trim()} e vim pelo site.`,
        `Gostaria de um orçamento para: ${fields.type.value}.`
      ];
      if (fields.date.value) {
        const [year, month, day] = fields.date.value.split("-");
        lines.push(`Data do evento: ${day}/${month}/${year}.`);
      }
      if (fields.city.value.trim()) lines.push(`Cidade: ${fields.city.value.trim()}.`);
      if (fields.message.value.trim()) lines.push(fields.message.value.trim());

      const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");

      // Se o navegador bloquear a nova aba, o visitante ainda tem o link.
      quoteStatus.innerHTML = `Abrindo o WhatsApp… Se não abrir, <a class="underline font-semibold" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">toque aqui</a>.`;
    });
  }

  /* ===================== Botão voltar ao topo ===================== */
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener(
    "scroll",
    () => {
      backToTop.hidden = window.scrollY < 500;
    },
    { passive: true }
  );
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

})();
