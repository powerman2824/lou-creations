console.log("main.js loaded ✅");

const PIECES = [
  { title: "Atlantic Lightning", slug: "atlantic-lightning", type: "panel" },
  { title: "Ballistic Lightning Rack", slug: "ballistic-lightning-rack", type: "rack" },
  { title: "Crimson Heartstorm Frame", slug: "crimson-heartstorm-frame", type: "frame" },
  { title: "Crimson Thunder Key Rack", slug: "crimson-thunder-key-rack", type: "rack" },
  { title: "Crimson Vein Heart", slug: "crimson-vein-heart", type: "heart" },
  { title: "Emerald Storm Panel", slug: "emerald-storm-panel", type: "panel" },
  { title: "Heartstorm Frame", slug: "heartstorm-frame", type: "frame" },
  { title: "Lightning Ribbon Tribute", slug: "lightning-ribbon-tribute", type: "panel" },
  { title: "Rust Vein Rope Heart", slug: "rust-vein-rope-heart", type: "heart" },
  { title: "Tidal Lightning Panels", slug: "tidal-lightning-panels", type: "panel" },
  { title: "Twin Current Panel", slug: "twin-current-panel", type: "panel" },
];

// Build file paths from your flat assets/images layout
function pathsFor(slug) {
  return {
    img: `assets/images/${slug}-master.png`,
    thumbPng: `assets/images/${slug}-thumbnail.png`,
    thumbWebp: `assets/images/${slug}.webp`,
  };
}

const $ = (sel) => document.querySelector(sel);

const galleryGrid = $("#galleryGrid");
const searchInput = $("#searchInput");
const filterSelect = $("#filterSelect");

const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const downloadLink = $("#downloadLink");
const askBtn = $("#askBtn");
const pieceField = $("#pieceField");

const form = $("#contactForm");
const statusEl = $("#formStatus");

function typeLabel(type) {
  switch (type) {
    case "panel": return "Panel";
    case "rack": return "Rack";
    case "frame": return "Frame";
    case "heart": return "Heart";
    default: return "Piece";
  }
}

function pieceCard(piece) {
  const card = document.createElement("article");
  card.className = "card piece";
  card.tabIndex = 0;

  const imgWrap = document.createElement("div");
  imgWrap.className = "piece__img";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = piece.title;

  const p = pathsFor(piece.slug);
  // Prefer webp, then png thumb, then master
  img.src = p.thumbWebp;
  img.onerror = () => {
    img.onerror = null;
    img.src = p.thumbPng;
    img.onerror = () => {
      img.onerror = null;
      img.src = p.img;
    };
  };

  imgWrap.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "piece__meta";

  const title = document.createElement("h3");
  title.className = "piece__title";
  title.textContent = piece.title;

  const chip = document.createElement("div");
  chip.className = "piece__chip";
  chip.textContent = typeLabel(piece.type);

  meta.appendChild(title);
  meta.appendChild(chip);

  card.appendChild(imgWrap);
  card.appendChild(meta);

  card.addEventListener("click", () => openModal(piece));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(piece);
    }
  });

  return card;
}

function renderGallery(list) {
  galleryGrid.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.padding = "16px";
    empty.textContent = "No pieces match your search/filter.";
    galleryGrid.appendChild(empty);
    return;
  }
  list.forEach(p => galleryGrid.appendChild(pieceCard(p)));
}

function getFiltered() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const type = filterSelect.value;

  return PIECES.filter(p => {
    const matchesText = !q || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    const matchesType = type === "all" || p.type === type;
    return matchesText && matchesType;
  });
}

function wireFilters() {
  searchInput?.addEventListener("input", () => renderGallery(getFiltered()));
  filterSelect?.addEventListener("change", () => renderGallery(getFiltered()));
}

function wireForm() {
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (statusEl) {
      statusEl.hidden = true;
      statusEl.textContent = "";
    }

    try {
      const resp = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = resp.ok
          ? "✅ Message sent! Lou will get back to you soon."
          : "❌ Something went wrong. Please try again.";
      }

      if (resp.ok) form.reset();
    } catch (err) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "❌ Network error. Please try again.";
      }
    }
  });
}

function init() {
  const year = new Date().getFullYear();
  const y = $("#year");
  if (y) y.textContent = String(year);

  renderGallery(PIECES);
  wireFilters();
  wireModal();
  wireForm();
}

init();