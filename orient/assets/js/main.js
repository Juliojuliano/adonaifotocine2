(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ==========================================================================
     Fallback de mídia: se o <video> não tiver uma fonte válida (arquivo
     ainda não gerado), mostra o placeholder ilustrado no lugar dele.
     ========================================================================== */
  function initMediaFallbacks() {
    document.querySelectorAll("video").forEach(function (video) {
      var wrap = video.parentElement;
      var fallback = wrap.querySelector(
        '.media-placeholder[data-fallback-for="' + video.id + '"]'
      );
      if (!fallback) return;

      var showFallback = function () {
        video.style.display = "none";
        fallback.style.display = "flex";
      };
      var showVideo = function () {
        video.style.display = "";
        fallback.style.display = "none";
      };

      // Assume placeholder até confirmarmos que o vídeo carrega de verdade.
      showFallback();

      video.addEventListener("error", showFallback, true);
      video.addEventListener("loadedmetadata", function () {
        if (video.duration && !isNaN(video.duration)) {
          showVideo();
        }
      });
    });
  }

  /* ==========================================================================
     Scroll-scrubbing: liga a posição do scroll dentro de uma "track" ao
     currentTime de um <video>. Usado na hero (montagem) e no CTA final
     (caixa abrindo).
     ========================================================================== */
  function initScrollScrub(trackId, videoId, options) {
    var track = document.getElementById(trackId);
    var video = document.getElementById(videoId);
    if (!track || !video) return;

    options = options || {};
    var ready = false;
    var ticking = false;

    video.addEventListener("loadedmetadata", function () {
      ready = video.duration && !isNaN(video.duration);
    });

    if (prefersReducedMotion) {
      // Não faz scrubbing; deixa o vídeo tocar normalmente (ou parado no poster).
      return;
    }

    function update() {
      ticking = false;
      if (!ready) return;

      var rect = track.getBoundingClientRect();
      var trackHeight = track.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      var scrolled = -rect.top;
      var progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);

      var targetTime = progress * video.duration;
      if (Math.abs(video.currentTime - targetTime) > 0.04) {
        video.currentTime = targetTime;
      }

      if (typeof options.onProgress === "function") {
        options.onProgress(progress);
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ==========================================================================
     Hero: além do scrub, expande o card de vídeo de centralizado para
     full-bleed conforme o scroll avança dentro da track.
     ========================================================================== */
  function initHeroExpansion() {
    var heroMedia = document.getElementById("heroMedia");
    if (!heroMedia) return;

    initScrollScrub("top", "heroVideo", {
      onProgress: function (progress) {
        if (progress > 0.15) {
          heroMedia.classList.add("is-expanded");
        } else {
          heroMedia.classList.remove("is-expanded");
        }
      },
    });
  }

  function initCaixaScrub() {
    var track = document.querySelector(".caixa-reveal__track");
    if (!track) return;
    track.id = track.id || "caixaTrack";
    initScrollScrub(track.id, "caixaVideo", {});
  }

  /* ==========================================================================
     Configurador de pulseira (Nike-style)
     ========================================================================== */
  var STRAP_DATA = {
    silicone: {
      title: "Silicone Preto",
      desc: "Esportiva, hipoalergênica, perfurada para ventilação. A pulseira que vem de fábrica.",
      accent: "#c9a86a",
      aura: "rgba(201, 168, 106, 0.18)",
      shadow: "rgba(0, 0, 0, 0.6)",
      bg: "radial-gradient(circle at 30% 20%, #1a1a1a, #000000 70%)",
    },
    leather: {
      title: "Couro Marrom",
      desc: "Couro genuíno italiano. Ganha caráter com o tempo. Para quem quer vibe clássica.",
      accent: "#d4a574",
      aura: "rgba(212, 165, 116, 0.22)",
      shadow: "rgba(20, 8, 4, 0.7)",
      bg: "radial-gradient(circle at 30% 20%, #3d2817, #0a0604 70%)",
    },
    steel: {
      title: "Aço 316L",
      desc: "Pulseira em aço 316L com fecho dobrável. Robusta. Atemporal. Pronta pra qualquer ocasião.",
      accent: "#b8c5d0",
      aura: "rgba(184, 197, 208, 0.18)",
      shadow: "rgba(8, 12, 16, 0.7)",
      bg: "radial-gradient(circle at 30% 20%, #2a3441, #050709 70%)",
    },
    nylon: {
      title: "Nylon NATO Marinho",
      desc: "Estilo militar britânico. Leve, resistente à água, secagem rápida. Ideal pra outdoor.",
      accent: "#5b8dd6",
      aura: "rgba(91, 141, 214, 0.20)",
      shadow: "rgba(4, 8, 16, 0.7)",
      bg: "radial-gradient(circle at 30% 20%, #1a2b4a, #040810 70%)",
    },
    mesh: {
      title: "Mesh Milanês",
      desc: "Trama de aço inox flexível. Confortável como tecido, premium como joia.",
      accent: "#e8e8e8",
      aura: "rgba(232, 232, 232, 0.16)",
      shadow: "rgba(0, 0, 0, 0.7)",
      bg: "radial-gradient(circle at 30% 20%, #3a3a3a, #080808 70%)",
    },
  };

  function initConfigurator() {
    var section = document.getElementById("configurator");
    var aura = document.getElementById("configuratorAura");
    var options = document.querySelectorAll(".strap-option");
    var info = document.getElementById("configuratorInfo");
    var title = document.getElementById("strapTitle");
    var desc = document.getElementById("strapDesc");
    var layers = document.querySelectorAll(".strap-layer");

    if (!section || !options.length) return;

    function applyStrap(key) {
      var data = STRAP_DATA[key];
      if (!data) return;

      section.style.background = data.bg;
      section.style.setProperty("--strap-aura", data.aura);
      section.style.setProperty("--strap-shadow", data.shadow);
      section.style.setProperty("--strap-accent", data.accent);

      layers.forEach(function (layer) {
        layer.classList.toggle(
          "is-active",
          layer.getAttribute("data-strap") === key
        );
      });

      options.forEach(function (btn) {
        btn.setAttribute(
          "aria-pressed",
          btn.getAttribute("data-strap") === key ? "true" : "false"
        );
      });

      info.classList.add("is-fading");
      window.setTimeout(function () {
        title.textContent = data.title;
        desc.textContent = data.desc;
        info.classList.remove("is-fading");
      }, 180);
    }

    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyStrap(btn.getAttribute("data-strap"));
      });
    });

    applyStrap("silicone");
  }

  /* ==========================================================================
     Init
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    initMediaFallbacks();
    initHeroExpansion();
    initCaixaScrub();
    initConfigurator();
  });
})();
