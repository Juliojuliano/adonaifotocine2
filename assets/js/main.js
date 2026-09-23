(function () {
  "use strict";

  /* =====================================================
     CONFIGURAÇÃO
     Centralizada em assets/js/site-config.js (compartilhada com
     o painel do cliente em admin/). Edite os valores lá.
  ===================================================== */
  const CONFIG = window.SITE_CONFIG;

  const isFormConfigured = !CONFIG.FORM_ENDPOINT.includes("SEU_FORM_ID");
  const isEventsConfigured =
    !CONFIG.EVENTS_SHEET_CSV_URL.includes("COLE_AQUI") &&
    !CONFIG.EVENTS_FORM_URL.includes("COLE_AQUI");

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

  /* ===================== Contadores animados ===================== */
  const counters = document.querySelectorAll(".counter");
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const countersObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => countersObserver.observe(el));

  /* ===================== Portfólio: dados + render ===================== */

  // Amostra fixa de trabalhos, mantida pelo estúdio (não muda sozinha).
  // Os eventos que o cliente cadastra aparecem à parte, na seção
  // "Últimos eventos" — ver loadEvents() mais abaixo.
  const galleryData = [
    { id: 1, category: "casamento", seed: "adonai-wed-1", alt: "Noivos trocando alianças durante a cerimônia" },
    { id: 2, category: "casamento", seed: "adonai-wed-2", alt: "Noiva sorrindo ao ser preparada para a cerimônia" },
    { id: 3, category: "pre-wedding", seed: "adonai-pw-1", alt: "Casal em ensaio pré-wedding ao entardecer" },
    { id: 4, category: "making-of", seed: "adonai-mk-1", alt: "Making of da noiva colocando o vestido" },
    { id: 5, category: "casamento", seed: "adonai-wed-3", alt: "Festa de casamento com pista de dança iluminada" },
    { id: 6, category: "video", seed: "adonai-vid-1", alt: "Still de filmagem cinematográfica do casamento" },
    { id: 7, category: "pre-wedding", seed: "adonai-pw-2", alt: "Casal caminhando em ensaio ao ar livre" },
    { id: 8, category: "making-of", seed: "adonai-mk-2", alt: "Making of dos detalhes da decoração" },
    { id: 9, category: "casamento", seed: "adonai-wed-4", alt: "Buquê de flores da noiva em close" },
    { id: 10, category: "video", seed: "adonai-vid-2", alt: "Still de filmagem com drone da recepção" },
    { id: 11, category: "casamento", seed: "adonai-wed-5", alt: "Beijo do casal logo após a cerimônia" },
    { id: 12, category: "pre-wedding", seed: "adonai-pw-3", alt: "Ensaio de noivado em estúdio" }
  ];

  const categoryLabels = {
    casamento: "Casamento",
    "pre-wedding": "Pré-Wedding",
    "making-of": "Making Of",
    video: "Vídeo"
  };

  const gallery = document.getElementById("gallery");

  function renderGallery() {
    gallery.innerHTML = galleryData
      .map(
        (item, index) => `
      <button type="button" class="gallery-item" data-category="${item.category}" data-index="${index}" aria-label="Ampliar foto: ${item.alt}">
        <img src="https://picsum.photos/seed/${item.seed}/700/700" alt="${item.alt}" loading="lazy" width="700" height="700">
        <span class="gallery-overlay"><span>${categoryLabels[item.category]}</span></span>
      </button>`
      )
      .join("");

    gallery.querySelectorAll(".gallery-item").forEach((btn) => {
      btn.addEventListener("click", () => openLightbox(parseInt(btn.dataset.index, 10)));
    });
  }
  renderGallery();

  /* ===================== Últimos eventos (cadastrados pelo cliente) ===================== */
  // O cliente preenche um Google Formulário depois de cada evento (nome,
  // data, categoria e link do álbum do Google Fotos). As respostas caem
  // numa planilha do Google Sheets publicada como CSV — sem backend, sem
  // chave secreta exposta. Ver README.md, seção "Eventos do cliente".
  const eventsSection = document.getElementById("eventos");
  const eventsList = document.getElementById("events-list");
  const eventsEmpty = document.getElementById("events-empty");

  // Parser de CSV simples, mas correto para campos entre aspas com
  // vírgulas dentro (comum em nomes de evento tipo "Casamento, Ana e Pedro").
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (inQuotes) {
        if (char === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  }

  function normalizeCategory(raw) {
    const value = (raw || "").toLowerCase().trim();
    if (value.includes("pré") || value.includes("pre-wedding") || value.includes("pre wedding")) return "pre-wedding";
    if (value.includes("making")) return "making-of";
    if (value.includes("vídeo") || value.includes("video")) return "video";
    return "casamento";
  }

  function renderEvents(events) {
    if (!eventsSection) return;

    if (events.length === 0) {
      eventsList.innerHTML = "";
      if (eventsEmpty) eventsEmpty.classList.remove("hidden");
      return;
    }

    if (eventsEmpty) eventsEmpty.classList.add("hidden");
    eventsList.innerHTML = events
      .map(
        (ev) => `
      <article class="event-card">
        <span class="event-card__badge">${categoryLabels[ev.category]}</span>
        <h3 class="event-card__title">${ev.name}</h3>
        <p class="event-card__date">${ev.date}</p>
        <a href="${ev.albumUrl}" target="_blank" rel="noopener" class="event-card__link">Ver álbum completo →</a>
      </article>`
      )
      .join("");
  }

  async function loadEvents() {
    if (!eventsSection) return;
    if (!isEventsConfigured) {
      eventsSection.classList.add("hidden");
      return;
    }

    try {
      const res = await fetch(CONFIG.EVENTS_SHEET_CSV_URL);
      if (!res.ok) throw new Error("CSV indisponível");
      const text = await res.text();
      const rows = parseCsv(text);

      // Primeira linha é o cabeçalho do formulário do Google — ignora.
      const dataRows = rows.slice(1);

      // Colunas na ordem em que o Google Forms grava:
      // [Carimbo de data/hora, Nome do evento, Data do evento, Categoria, Link do álbum]
      const events = dataRows
        .map((r) => ({
          name: (r[1] || "").trim(),
          date: (r[2] || "").trim(),
          category: normalizeCategory(r[3]),
          albumUrl: (r[4] || "").trim()
        }))
        .filter((ev) => ev.name && ev.albumUrl)
        .reverse(); // mais recentes primeiro (formulário grava em ordem crescente)

      renderEvents(events);
    } catch (err) {
      // Mantém a seção, mas mostra o estado "vazio" em vez de travar.
      renderEvents([]);
    }
  }
  loadEvents();

  /* ===================== Filtros do portfólio ===================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;

      gallery.querySelectorAll(".gallery-item").forEach((item) => {
        const show = filter === "todos" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ===================== Lightbox ===================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  let currentIndex = 0;
  let lastFocusedEl = null;

  function updateLightboxImage() {
    const item = galleryData[currentIndex];
    lightboxImg.src = `https://picsum.photos/seed/${item.seed}/1400/1400`;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = `${categoryLabels[item.category]} — ${item.alt}`;
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocusedEl = document.activeElement;
    updateLightboxImage();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onLightboxKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxImage();
  }
  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxImage();
  }

  function onLightboxKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ===================== Carrossel de depoimentos ===================== */
  const track = document.getElementById("testimonial-track");
  const slides = track ? Array.from(track.children) : [];
  const dotsContainer = document.getElementById("testimonial-dots");
  const prevBtn = document.getElementById("testimonial-prev");
  const nextBtn = document.getElementById("testimonial-next");
  let slideIndex = 0;
  let autoplayTimer = null;

  function renderDots() {
    dotsContainer.innerHTML = slides
      .map((_, i) => `<button type="button" class="dot${i === 0 ? " is-active" : ""}" role="tab" aria-label="Ir para depoimento ${i + 1}" data-index="${i}"></button>`)
      .join("");

    dotsContainer.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.index, 10)));
    });
  }

  function goToSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === slideIndex);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToSlide(slideIndex + 1), 6000);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (slides.length) {
    renderDots();
    prevBtn.addEventListener("click", () => {
      goToSlide(slideIndex - 1);
      startAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      goToSlide(slideIndex + 1);
      startAutoplay();
    });

    const testimonialSection = document.getElementById("depoimentos");
    testimonialSection.addEventListener("mouseenter", stopAutoplay);
    testimonialSection.addEventListener("mouseleave", startAutoplay);

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

  /* ===================== Formulário de contato ===================== */
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-text");
  const submitSpinner = document.getElementById("submit-spinner");
  const formStatus = document.getElementById("form-status");

  const validators = {
    nome: (v) => v.trim().length >= 3 || "Informe seu nome completo.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Informe um e-mail válido.",
    telefone: (v) => v.replace(/\D/g, "").length >= 10 || "Informe um telefone válido com DDD.",
    evento: (v) => v.trim().length > 0 || "Selecione o tipo de evento.",
    mensagem: (v) => v.trim().length >= 10 || "Conte um pouco mais sobre o seu evento (mín. 10 caracteres)."
  };

  function setFieldError(field, message) {
    const input = form.elements[field];
    const errorEl = document.getElementById(`err-${field}`);
    if (message) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validateForm() {
    let isValid = true;
    Object.keys(validators).forEach((field) => {
      const value = form.elements[field].value;
      const result = validators[field](value);
      if (result !== true) {
        setFieldError(field, result);
        isValid = false;
      } else {
        setFieldError(field, "");
      }
    });
    return isValid;
  }

  Object.keys(validators).forEach((field) => {
    form.elements[field].addEventListener("blur", () => {
      const result = validators[field](form.elements[field].value);
      setFieldError(field, result === true ? "" : result);
    });
  });

  function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    submitText.textContent = isLoading ? "Enviando..." : "Enviar mensagem";
    submitSpinner.classList.toggle("hidden", !isLoading);
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.remove("is-success", "is-error");
    if (type) formStatus.classList.add(type === "success" ? "is-success" : "is-error");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showStatus("", null);

    // Honeypot: se preenchido, é bot — ignora silenciosamente.
    if (form.elements["empresa"].value.trim() !== "") {
      form.reset();
      return;
    }

    if (!validateForm()) {
      showStatus("Por favor, corrija os campos destacados antes de enviar.", "error");
      return;
    }

    const whatsappFallback = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;

    if (!isFormConfigured) {
      setLoadingState(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoadingState(false);
      showStatus(
        `Formulário ainda não configurado pelo site. Fale direto pelo WhatsApp: ${whatsappFallback}`,
        "error"
      );
      return;
    }

    const formData = new FormData(form);
    setLoadingState(true);

    try {
      const response = await fetch(CONFIG.FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (response.ok) {
        form.reset();
        showStatus("Mensagem enviada com sucesso! Em breve entraremos em contato. 🎉", "success");
      } else {
        showStatus(`Não foi possível enviar sua mensagem. Tente novamente ou fale pelo WhatsApp: ${whatsappFallback}`, "error");
      }
    } catch (error) {
      showStatus(`Falha de conexão. Verifique sua internet ou fale pelo WhatsApp: ${whatsappFallback}`, "error");
    } finally {
      setLoadingState(false);
    }
  });
})();
