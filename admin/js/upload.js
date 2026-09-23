(function () {
  "use strict";

  const CONFIG = window.SITE_CONFIG;
  const isCloudinaryConfigured =
    !CONFIG.CLOUDINARY_CLOUD_NAME.includes("SEU_CLOUD_NAME") &&
    !CONFIG.CLOUDINARY_UPLOAD_PRESET.includes("SEU_UPLOAD_PRESET");

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

  if (!isCloudinaryConfigured) {
    configWarning.classList.remove("hidden");
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
      gateError.textContent = "Senha incorreta. Confira com a Adonai FotoCine.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showGate();
  });

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

  function uploadOne(file, tags) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    body.append("tags", tags.join(","));

    return fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body
    }).then((res) => {
      if (!res.ok) throw new Error("Falha no envio (" + res.status + ")");
      return res.json();
    });
  }

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
    uploadSummary.textContent = `Enviando 0 de ${files.length} foto(s) — ${categoryLabels[category]}: ${eventName}`;
    uploadList.innerHTML = files
      .map((f, i) => `<li id="upload-row-${i}" class="flex items-center justify-between gap-3"><span class="truncate">${f.name}</span><span class="text-brand-ink/40">aguardando</span></li>`)
      .join("");

    let done = 0;
    let ok = 0;

    for (let i = 0; i < files.length; i++) {
      const row = document.getElementById(`upload-row-${i}`);
      const statusEl = row.querySelector("span:last-child");
      statusEl.textContent = "enviando...";

      try {
        await uploadOne(files[i], tags);
        ok++;
        statusEl.textContent = "✓ enviada";
        statusEl.classList.add("text-emerald-600");
      } catch (err) {
        statusEl.textContent = "✗ erro";
        statusEl.classList.add("text-red-600");
      }

      done++;
      uploadSummary.textContent = `Enviando ${done} de ${files.length} foto(s) — ${categoryLabels[category]}: ${eventName}`;
    }

    uploadSummary.textContent = `Concluído: ${ok} de ${files.length} foto(s) enviadas — ${categoryLabels[category]}: ${eventName}`;
    if (ok > 0) {
      uploadDoneLink.classList.remove("hidden");
    }

    uploadSubmit.disabled = false;
    uploadSubmit.textContent = "Enviar fotos";
    uploadForm.reset();
  });
})();
