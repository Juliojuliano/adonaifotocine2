const { put, head } = require("@vercel/blob");

// A Cloudinary bloqueia a listagem pública de fotos por tag nesta conta
// (erro "Resources of type list are restricted"), então guardamos aqui —
// num único arquivo JSON no Vercel Blob — a lista de eventos publicados
// pelo painel do fotógrafo. O site (assets/js/main.js) lê esse arquivo
// para montar a galeria; o painel (admin/js/upload.js) escreve nele
// depois que as fotos já foram enviadas ao Cloudinary com sucesso.
const MANIFEST_PATHNAME = "adonai-gallery-manifest.json";

async function readManifest() {
  try {
    const blob = await head(MANIFEST_PATHNAME, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return { events: [] };
    return await response.json();
  } catch (err) {
    return { events: [] };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Admin-Password");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    const manifest = await readManifest();
    res.status(200).json(manifest);
    return;
  }

  if (req.method === "POST") {
    const providedHash = req.headers["x-admin-password"];
    if (!providedHash || providedHash !== process.env.ADMIN_PASSWORD_SHA256) {
      res.status(401).json({ error: "Senha inválida." });
      return;
    }

    const { eventName, eventDate, category, photos } = req.body || {};
    if (
      !eventName ||
      !eventDate ||
      !category ||
      !Array.isArray(photos) ||
      photos.length === 0
    ) {
      res.status(400).json({ error: "Dados do evento incompletos." });
      return;
    }

    const manifest = await readManifest();
    manifest.events = manifest.events || [];
    manifest.events.unshift({
      id: `${Date.now()}`,
      eventName: String(eventName).slice(0, 200),
      eventDate: String(eventDate).slice(0, 20),
      category: String(category).slice(0, 50),
      photos: photos.slice(0, 200).map((p) => ({
        publicId: String(p.publicId).slice(0, 300),
        format: String(p.format || "jpg").slice(0, 10)
      })),
      createdAt: new Date().toISOString()
    });

    await put(MANIFEST_PATHNAME, JSON.stringify(manifest), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ ok: true, totalEvents: manifest.events.length });
    return;
  }

  if (req.method === "DELETE") {
    const providedHash = req.headers["x-admin-password"];
    if (!providedHash || providedHash !== process.env.ADMIN_PASSWORD_SHA256) {
      res.status(401).json({ error: "Senha inválida." });
      return;
    }

    const { eventId, publicId } = req.body || {};
    if (!eventId || !publicId) {
      res.status(400).json({ error: "Dados incompletos para excluir a foto." });
      return;
    }

    const manifest = await readManifest();
    manifest.events = manifest.events || [];
    const event = manifest.events.find((e) => e.id === String(eventId));
    if (!event) {
      res.status(404).json({ error: "Evento não encontrado." });
      return;
    }

    const beforeCount = event.photos.length;
    event.photos = event.photos.filter((p) => p.publicId !== publicId);
    if (event.photos.length === beforeCount) {
      res.status(404).json({ error: "Foto não encontrada neste evento." });
      return;
    }

    // Evento sem fotos não faz mais sentido aparecer na lista.
    if (event.photos.length === 0) {
      manifest.events = manifest.events.filter((e) => e.id !== event.id);
    }

    await put(MANIFEST_PATHNAME, JSON.stringify(manifest), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.status(200).json({ ok: true, totalEvents: manifest.events.length });
    return;
  }

  res.status(405).json({ error: "Método não suportado." });
};
