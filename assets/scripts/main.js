// Lou's Creations — gallery + modal + contact autofill
// Keep this data list as your single source of truth.
// Add new pieces by copying an entry and updating title/slug/type/image paths.

const PIECES = [
  {
    title: "Atlantic Lightning",
    slug: "atlantic-lightning",
    type: "panel",
    img: "assets/images/atlantic-lightning/atlantic-lightning-master.png",
    thumbPng: "assets/images/atlantic-lightning/atlantic-lightning-thumbnail.png",
    thumbWebp: "assets/images/atlantic-lightning/atlantic-lightning-thumbnail.webp",
  },
  {
    title: "Ballistic Lightning Rack",
    slug: "ballistic-lightning-rack",
    type: "rack",
    img: "assets/images/ballistic-lightning-rack/ballistic-lightning-rack-master.png",
    thumbPng: "assets/images/ballistic-lightning-rack/ballistic-lightning-rack-thumbnail.png",
    thumbWebp: "assets/images/ballistic-lightning-rack/ballistic-lightning-rack-thumbnail.webp",
  },
  {
    title: "Crimson Thunder Key Rack",
    slug: "crimson-thunder-key-rack",
    type: "rack",
    img: "assets/images/crimson-thunder-key-rack/crimson-thunder-key-rack-master.png",
    thumbPng: "assets/images/crimson-thunder-key-rack/crimson-thunder-key-rack-thumbnail.png",
    thumbWebp: "assets/images/crimson-thunder-key-rack/crimson-thunder-key-rack-thumbnail.webp",
  },
  {
    title: "Crimson Heartstorm Frame",
    slug: "crimson-heartstorm-frame",
    type: "frame",
    img: "assets/images/crimson-heartstorm-frame/crimson-heartstorm-frame-master.png",
    thumbPng: "assets/images/crimson-heartstorm-frame/crimson-heartstorm-frame-thumbnail.png",
    thumbWebp: "assets/images/crimson-heartstorm-frame/crimson-heartstorm-frame-thumbnail.webp",
  },
  {
    title: "Crimson Vein Heart",
    slug: "crimson-vein-heart",
    type: "heart",
    img: "assets/images/crimson-vein-heart/crimson-vein-heart-master.png",
    thumbPng: "assets/images/crimson-vein-heart/crimson-vein-heart-thumbnail.png",
    thumbWebp: "assets/images/crimson-vein-heart/crimson-vein-heart-thumbnail.webp",
  },
  {
    title: "Emerald Storm Panel",
    slug: "emerald-storm-panel",
    type: "panel",
    img: "assets/images/emerald-storm-panel/emerald-storm-panel-master.png",
    thumbPng: "assets/images/emerald-storm-panel/emerald-storm-panel-thumbnail.png",
    thumbWebp: "assets/images/emerald-storm-panel/emerald-storm-panel-thumbnail.webp",
  },
  {
    title: "Heartstorm Frame",
    slug: "heartstorm-frame",
    type: "frame",
    img: "assets/images/heartstorm-frame/heartstorm-frame-master.png",
    thumbPng: "assets/images/heartstorm-frame/heartstorm-frame-thumbnail.png",
    thumbWebp: "assets/images/heartstorm-frame/heartstorm-frame-thumbnail.webp",
  },
  {
    title: "Lightning Ribbon Tribute",
    slug: "lightning-ribbon-tribute",
    type: "panel",
    img: "assets/images/lightning-ribbon-tribute/lightning-ribbon-tribute-master.png",
    thumbPng: "assets/images/lightning-ribbon-tribute/lightning-ribbon-tribute-thumbnail.png",
    thumbWebp: "assets/images/lightning-ribbon-tribute/lightning-ribbon-tribute-thumbnail.webp",
  },
  {
    title: "Rust Vein Rope Heart",
    slug: "rust-vein-rope-heart",
    type: "heart",
    img: "assets/images/rust-vein-rope-heart/rust-vein-rope-heart-master.png",
    thumbPng: "assets/images/rust-vein-rope-heart/rust-vein-rope-heart-thumbnail.png",
    thumbWebp: "assets/images/rust-vein-rope-heart/rust-vein-rope-heart-thumbnail.webp",
  },
  {
    title: "Tidal Lightning Panels",
    slug: "tidal-lightning-panels",
    type: "panel",
    img: "assets/images/tidal-lightning-panels/tidal-lightning-panels-master.png",
    thumbPng: "assets/images/tidal-lightning-panels/tidal-lightning-panels-thumbnail.png",
    thumbWebp: "assets/images/tidal-lightning-panels/tidal-lightning-panels-thumbnail.webp",
  },
  {
    title: "Twin Current Panel",
    slug: "twin-current-panel",
    type: "panel",
    img: "assets/images/twin-current-panel/twin-current-panel-master.png",
    thumbPng: "assets/images/twin-current-panel/twin-current-panel-thumbnail.png",
    thumbWebp: "assets/images/twin-current-panel/twin-current-panel-thumbnail.webp",
  },
];

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

function pieceCard(piece) {
  const card = document.createElement("article");
  card.className = "card piece";
  card.tabIndex = 0;
  card.dataset.slug = piece.slug;

  const imgWrap = document.createElement("div");
  imgWrap.className = "piece__img";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = piece.title;

  // Prefer webp thumb when available
  img.src = piece.thumbWebp || piece.thumbPng || piece.img;

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

  // Click / keyboard
  card.addEventListener("click", () => openModal(piece));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(piece);
    }
  });

  return card;
}

function typeLabel(type) {
  switch (type) {
    case "panel": return "Panel";
    case "rack": return "Rack";
    case "frame": return "Frame";
    case "heart": return "Heart";
    default: return "Piece";
  }
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

function openModal(piece) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  modalImg.src = piece.img;
  modalImg.alt = piece.title;
  modalTitle.textContent = piece.title;

  downloadLink.href = piece.img;
  downloadLink.setAttribute("download", `${piece.slug}-master.png`);

  askBtn.onclick = () => {
    pieceField.value = piece.title;
    closeModal();
    // smooth scroll to contact
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "start" });
    // focus name field
    const nameInput = form?.querySelector('input[name="name"]');
    if (nameInput) setTimeout(() => nameInput.focus(), 250);
  };
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function wireModal() {
  modal.addEventListener("click", (e) => {
    const close = e.target?.dataset?.close === "true";
    if (close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });
}

function wireFilters() {
  searchInput.addEventListener("input", () => renderGallery(getFiltered()));
  filterSelect.addEventListener("change", () => renderGallery(getFiltered()));
}

async function wireForm() {
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    // If you want classic form submit, remove this handler.
    e.preventDefault();

    statusEl.hidden = true;
    statusEl.textContent = "";

    try {
      const resp = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (resp.ok) {
        form.reset();
        statusEl.hidden = false;
        statusEl.textContent = "✅ Message sent! Lou will get back to you soon.";
      } else {
        statusEl.hidden = false;
        statusEl.textContent = "❌ Hmm—something went wrong. Please try again.";
      }
    } catch (err) {
      statusEl.hidden = false;
      statusEl.textContent = "❌ Network error. Please try again.";
    }
  });
}

function init() {
  // Footer year
  const year = new Date().getFullYear();
  const y = $("#year");
  if (y) y.textContent = String(year);

  renderGallery(PIECES);
  wireFilters();
  wireModal();
  wireForm();
}

init();