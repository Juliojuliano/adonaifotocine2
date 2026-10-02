(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;
  const isCloudinaryConfigured =
    !CONFIG.CLOUDINARY_CLOUD_NAME.includes("SEU_CLOUD_NAME") &&
    !CONFIG.CLOUDINARY_UPLOAD_PRESET.includes("SEU_UPLOAD_PRESET");

  const MAX_DIMENSION_PX = CONFIG.UPLOAD_MAX_DIMENSION_PX || 2000;
  const JPEG_QUALITY = CONFIG.UPLOAD_JPEG_QUALITY || 0.82;

  const SESSION_KEY = "adonai_admin_ok";
  const GALLERY_TAG = "adonai-gallery";

  const configWarning = document.getElementById("config-warning");
  const gate = document.getElementById("gate");
  const gateForm = document.getElementById("gate-form");
  const gatePassword = document.getElementById("gate-password");
  const gateError = document.getElementById("gate-error");
  const panel = document.getElementById("panel");
  const logoutBtn = document.getElementById("logout-btn");
  const uploadForm = document.getElementById("upload-form");
  const uploadSubmit = document.getElementById("upload-submit");
  const uploadProgress = document.getElementById("upload-progress");
  const uploadSummary = document.getElementById("upload-summary");
  const uploadList = document.getElementById("upload-list");
  const uploadDoneLink = document.getElementById("upload-done-link");
  const compressionNote = document.getElementById("compression-note");
  const refreshPublishedBtn = document.getElementById("refresh-published-btn");
  const publishedStatus = document.getElementById("published-status");
  const publishedEvents = document.getElementById("published-events");

  if (!isCloudinaryConfigured) {
    configWarning.classList.remove("hidden");
  }

  if (compressionNote) {
    compressionNote.textContent = `As fotos são redimensionadas para no máximo ${MAX_DIMENSION_PX}px no lado maior e comprimidas em JPEG antes do envio, para não pesar.`;
  }

  /* ===================== Hash utilitário ===================== */
  async function sha256Hex(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /* ===================== Portão de senha ===================== */
  function showPanel() {
    gate.classList.add("hidden");
    panel.classList.remove("hidden");
    loadPublishedGalleryAdmin();
  }

  function showGate() {
    panel.classList.add("hidden");
    gate.classList.remove("hidden");
    gatePassword.value = "";
    gatePassword.focus();
  }

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    showPanel();
  }

  gateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    gateError.textContent = "";
    const typed = gatePassword.value;
    const hash = await sha256Hex(typed);

    if (hash === CONFIG.ADMIN_PASSWORD_SHA256) {
      sessionStorage.setItem(SESSION_KEY, "1");
      showPanel();
    } else {
      gateError.textContent = "Senha incorreta.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showGate();
  });

  /* ===================== Compressão de imagem ===================== */
  // Redimensiona (mantendo a proporção) até MAX_DIMENSION_PX no lado
  // maior e reexporta como JPEG na qualidade configurada. Roda 100% no
  // navegador (canvas), sem enviar a foto original pesada para lugar
  // nenhum. Fotos já pequenas não são ampliadas.
  function resizeAndCompress(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Falha ao comprimir imagem."));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Não foi possível ler a imagem."));
      };

      img.src = objectUrl;
    });
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /* ===================== Envio de fotos ===================== */
  function slugify(text) {
    return text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const categoryLabels = {
    casamento: "Casamento",
    "pre-wedding": "Pré-Wedding",
    "making-of": "Making Of",
    video: "Vídeo"
  };

  function uploadOne(blob, filename, tags) {
    const body = new FormData();
    body.append("file", blob, filename);
    body.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    body.append("tags", tags.join(","));

    return fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body
    }).then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const reason = data?.error?.message || `HTTP ${res.status}`;
        throw new Error(reason);
      }
      return data;
    });
  }

  // A Cloudinary bloqueia a listagem pública de fotos por tag nesta conta,
  // então depois que as fotos já foram enviadas com sucesso, registramos o
  // evento no nosso próprio endpoint (api/gallery.js) — é isso que faz a
  // foto aparecer no site, sem precisar editar código.
  function publishEvent(eventName, eventDate, category, photos) {
    return fetch("/api/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": CONFIG.ADMIN_PASSWORD_SHA256
      },
      body: JSON.stringify({ eventName, eventDate, category, photos })
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
    });
  }

  /* ===================== Fotos publicadas (excluir) ===================== */
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cloudinaryThumbUrl(publicId, format) {
    return `https://res.cloudinary.com/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_fill,w_200,h_200/${publicId}.${format}`;
  }

  function formatDateBR(isoDate) {
    const [y, m, d] = String(isoDate || "").split("-");
    if (!y || !m || !d) return isoDate || "";
    return `${d}/${m}/${y}`;
  }

  function renderPublishedEvents(events) {
    publishedEvents.innerHTML = events
      .map(
        (event) => `
      <div class="bg-white rounded-2xl border border-black/5 shadow-sm p-5" data-event-id="${escapeHtml(event.id)}">
        <p class="font-medium">${escapeHtml(event.eventName)}</p>
        <p class="text-xs text-brand-ink/50 mb-3">${escapeHtml(categoryLabels[event.category] || event.category)} · ${escapeHtml(formatDateBR(event.eventDate))}</p>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          ${(event.photos || [])
            .map(
              (photo) => `
            <div class="relative aspect-square rounded-lg overflow-hidden bg-brand-cream">
              <img src="${cloudinaryThumbUrl(photo.publicId, photo.format)}" alt="" loading="lazy" class="w-full h-full object-cover">
              <button
                type="button"
                class="delete-photo-btn absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                data-event-id="${escapeHtml(event.id)}"
                data-public-id="${escapeHtml(photo.publicId)}"
                aria-label="Excluir esta foto"
                title="Excluir esta foto"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>`
            )
            .join("")}
        </div>
      </div>`
      )
      .join("");
  }

  async function loadPublishedGalleryAdmin() {
    publishedStatus.textContent = "Carregando fotos publicadas...";
    publishedEvents.innerHTML = "";
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const events = data.events || [];
      if (events.length === 0) {
        publishedStatus.textContent = "Nenhuma foto publicada ainda.";
        return;
      }
      publishedStatus.textContent = "";
      renderPublishedEvents(events);
    } catch (err) {
      publishedStatus.textContent = "Não foi possível carregar as fotos publicadas agora.";
    }
  }

  function deletePhoto(eventId, publicId) {
    return fetch("/api/gallery", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": CONFIG.ADMIN_PASSWORD_SHA256
      },
      body: JSON.stringify({ eventId, publicId })
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
    });
  }

  refreshPublishedBtn.addEventListener("click", loadPublishedGalleryAdmin);

  publishedEvents.addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-photo-btn");
    if (!btn) return;

    if (!confirm("Excluir esta foto da galeria do site? Essa ação não pode ser desfeita.")) {
      return;
    }

    btn.disabled = true;
    btn.classList.add("opacity-50");

    try {
      await deletePhoto(btn.dataset.eventId, btn.dataset.publicId);
      await loadPublishedGalleryAdmin();
    } catch (err) {
      alert(`Erro ao excluir a foto: ${err.message}`);
      btn.disabled = false;
      btn.classList.remove("opacity-50");
    }
  });

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isCloudinaryConfigured) {
      alert(
        "O painel ainda não está conectado ao Cloudinary. Veja o aviso no topo da página."
      );
      return;
    }

    const eventName = document.getElementById("event-name").value.trim();
    const eventDate = document.getElementById("event-date").value;
    const category = document.getElementById("event-category").value;
    const files = Array.from(document.getElementById("event-photos").files);

    if (!eventName || !eventDate || !category || files.length === 0) {
      alert("Preencha o nome do evento, a data, a categoria e selecione ao menos uma foto.");
      return;
    }

    const eventSlug = slugify(eventName) + "-" + eventDate;
    const tags = [GALLERY_TAG, category, eventSlug];

    uploadSubmit.disabled = true;
    uploadSubmit.textContent = "Enviando...";
    uploadProgress.classList.remove("hidden");
    uploadDoneLink.classList.add("hidden");
    uploadSummary.textContent = `Preparando 0 de ${files.length} foto(s) — ${categoryLabels[category]}: ${eventName}`;
    uploadList.innerHTML = files
      .map((f, i) => `<li id="upload-row-${i}" class="flex items-center justify-between gap-3"><span class="truncate">${f.name}</span><span class="text-brand-ink/40">aguardando</span></li>`)
      .join("");

    let done = 0;
    let ok = 0;
    const uploadedPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const row = document.getElementById(`upload-row-${i}`);
      const statusEl = row.querySelector("span:last-child");
      const originalFile = files[i];

      try {
        statusEl.textContent = "otimizando...";
        const compressedBlob = await resizeAndCompress(originalFile);
        const compressedName = originalFile.name.replace(/\.[^.]+$/, "") + ".jpg";

        statusEl.textContent = "enviando...";
        const result = await uploadOne(compressedBlob, compressedName, tags);
        uploadedPhotos.push({ publicId: result.public_id, format: result.format });

        ok++;
        statusEl.textContent = `✓ enviada (${formatSize(compressedBlob.size)}, era ${formatSize(originalFile.size)})`;
        statusEl.classList.add("text-emerald-600");
      } catch (err) {
        statusEl.textContent = `✗ erro: ${err.message}`;
        statusEl.classList.add("text-red-600");
      }

      done++;
      uploadSummary.textContent = `Enviando ${done} de ${files.length} foto(s) — ${categoryLabels[category]}: ${eventName}`;
    }

    if (uploadedPhotos.length > 0) {
      try {
        uploadSummary.textContent = `Publicando evento no site...`;
        await publishEvent(eventName, eventDate, category, uploadedPhotos);
        uploadSummary.textContent = `Concluído: ${ok} de ${files.length} foto(s) enviadas e publicadas — ${categoryLabels[category]}: ${eventName}`;
        uploadDoneLink.classList.remove("hidden");
        loadPublishedGalleryAdmin();
      } catch (err) {
        uploadSummary.textContent = `Fotos enviadas ao Cloudinary, mas houve um erro ao publicar no site: ${err.message}`;
      }
    } else {
      uploadSummary.textContent = `Concluído: 0 de ${files.length} foto(s) enviadas — ${categoryLabels[category]}: ${eventName}`;
    }

    uploadSubmit.disabled = false;
    uploadSubmit.textContent = "Enviar fotos";
    uploadForm.reset();
  });
})();
