/**
 * Lou's Creations — main.js (parallax + reveal)
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

/* =========================
   Helpers (existing)
   ========================= */

function pathsFor(slug) {
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
  card.className = "card piece"; // NOTE: reveal is applied after renderGallery()
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
    if (e.target.closest("a")) return;
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

/* =========================
   Reveal + Parallax (NEW)
   ========================= */

let revealObserver = null;

function setupRevealObserver() {
  // If browser doesn't support it, just show everything.
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Disconnect any previous observer (important when re-rendering gallery)
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const el = entry.target;
      const idx = Number(el.getAttribute("data-index") || "0");
      el.style.transitionDelay = `${Math.min(idx * 60, 420)}ms`;

      el.classList.add("is-visible");
      revealObserver.unobserve(el);
    }
  }, { threshold: 0.12 });
}

function observeReveals(scope = document) {
  if (!revealObserver) setupRevealObserver();

  const els = Array.from(scope.querySelectorAll(".reveal"));
  els.forEach((el) => revealObserver.observe(el));
}

function applyGalleryRevealStagger() {
  // Your cards are .piece (not .gallery-card)
  const cards = Array.from(document.querySelectorAll(".piece"));

  cards.forEach((card, i) => {
    card.classList.add("reveal");
    card.setAttribute("data-index", String(i));
  });

  // Observe the newly added reveal elements
  observeReveals(document);
}

function setupParallax() {
  const layerDefs = [
    { sel: ".layer-sky", speed: 0.10 },
    { sel: ".layer-clouds--back", speed: 0.18 },
    { sel: ".layer-clouds--front", speed: 0.28 },
    { sel: ".layer-horizon", speed: 0.38 },
    { sel: ".layer-waves", speed: 0.52 },
  ];

  const layers = layerDefs
    .map((x) => ({ ...x, el: document.querySelector(x.sel) }))
    .filter((x) => x.el);

  if (!layers.length) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      const y = window.scrollY || 0;

      for (const layer of layers) {
        layer.el.style.transform = `translate3d(0, ${y * layer.speed}px, 0)`;
      }

      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================
   Gallery render + controls
   ========================= */

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

  // NEW: after rendering, apply reveal + stagger
  applyGalleryRevealStagger();
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

  // NEW: setup reveal observer first, then observe hero elements
  setupRevealObserver();
  observeReveals(document); // observes your hero .reveal elements (Louie + hero copy)

  // NEW: parallax scroll
  setupParallax();

  // Render gallery (this will apply reveal + stagger)
  renderGallery(PIECES);
}

init();