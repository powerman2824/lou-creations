/**
 * Lou's Creations — main.js (no modal)
 * Folder-per-piece layout:
 *   assets/images/<slug>/<slug>-master.png
 *   assets/images/<slug>/<slug>-thumbnail.png
 *   assets/images/<slug>/<slug>.webp
 */

console.log("main.js loaded ✅");

const PIECES = [
  { title: "Atlantic Lightning", slug: "atlantic-lighting", type: "panel" },
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

const $ = (sel) => document.querySelector(sel);

const galleryGrid = $("#galleryGrid");
const searchInput = $("#searchInput");
const filterSelect = $("#filterSelect");
const yearEl = $("#year");

function pathsFor(slug) {
  // folder-per-piece
  const base = `assets/images/${slug}/${slug}`;
  return {
    master: `${base}-master.png`,
    thumbPng: `${base}-thumbnail.png`,
    thumbWebp: `${base}.webp`,
  };
}

function prettyType(type) {
  switch (type) {
    case "panel": return "Panel";
    case "rack": return "Rack";
    case "frame": return "Frame";
    case "heart": return "Heart";
    default: return "Piece";
  }
}

function createSmartImage(piece) {
  const p = pathsFor(piece.slug);

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = piece.title;
  img.src = p.thumbWebp;

  img.onerror = () => {
    // webp failed -> try thumbnail png
    img.onerror = () => {
      // thumbnail failed -> try master
      img.onerror = null;
      img.src = p.master;
    };
    img.src = p.thumbPng;
  };

  return img;
}

function buildCard(piece) {
  const p = pathsFor(piece.slug);

  const card = document.createElement("article");
  card.className = "card piece";
  card.tabIndex = 0;

  const imgWrap = document.createElement("div");
  imgWrap.className = "piece__img";
  imgWrap.appendChild(createSmartImage(piece));

  const meta = document.createElement("div");
  meta.className = "piece__meta";

  const title = document.createElement("h3");
  title.className = "piece__title";
  title.textContent = piece.title;

  const chip = document.createElement("div");
  chip.className = "piece__chip";
  chip.textContent = prettyType(piece.type);

  const actions = document.createElement("div");
  actions.style.marginTop = "10px";
  actions.style.display = "flex";
  actions.style.gap = "10px";
  actions.style.flexWrap = "wrap";

  const openBtn = document.createElement("a");
  openBtn.className = "btn btn--ghost btn--sm";
  openBtn.href = p.master;
  openBtn.target = "_blank";
  openBtn.rel = "noopener";
  openBtn.textContent = "Open";

  actions.appendChild(openBtn);

  meta.appendChild(title);
  meta.appendChild(chip);
  meta.appendChild(actions);

  card.appendChild(imgWrap);
  card.appendChild(meta);

  const openMaster = () => window.open(p.master, "_blank", "noopener");

  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return; // let button behave normally
    openMaster();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMaster();
    }
  });

  return card;
}

function renderGallery(list) {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.padding = "16px";
    empty.textContent = "No pieces match your search/filter.";
    galleryGrid.appendChild(empty);
    return;
  }

  list.forEach((piece) => galleryGrid.appendChild(buildCard(piece)));
}

function getFilteredList() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  const type = filterSelect?.value || "all";

  return PIECES.filter((p) => {
    const matchesText =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q);

    const matchesType = type === "all" || p.type === type;
    return matchesText && matchesType;
  });
}

function wireControls() {
  searchInput?.addEventListener("input", () => renderGallery(getFilteredList()));
  filterSelect?.addEventListener("change", () => renderGallery(getFilteredList()));
}

function setYear() {
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function init() {
  setYear();
  wireControls();
  renderGallery(PIECES);
}

init();