const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const grid = $("#listing-grid");
const form = $("#sell-form");
const saved = new Set();
let category = "All items";
let savedOnly = false;
let photo = "";
let sequence = 0;

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Number(value));

function refresh() {
  const query = $("#market-search").value.trim().toLowerCase();
  let visible = 0;
  $$(".listing-card", grid).forEach((card) => {
    const text = `${card.dataset.title} ${card.dataset.category} ${card.dataset.condition} ${card.dataset.seller} ${card.dataset.campus}`.toLowerCase();
    const show = (category === "All items" || card.dataset.category === category)
      && (!query || text.includes(query))
      && (!savedOnly || saved.has(card.dataset.title));
    card.parentElement.hidden = !show;
    visible += Number(show);
  });
  $("#empty-state").hidden = visible > 0;
  $("#empty-icon").textContent = savedOnly ? "♡" : "⌕";
  $("#empty-title").textContent = savedOnly ? "Your saved list is waiting" : "No finds just yet";
  $("#empty-description").textContent = savedOnly
    ? "Tap the heart on anything you love and it’ll show up here."
    : "Try another search or category. Your next great find is out there.";
  $("#listings-kicker").textContent = savedOnly ? "Your little collection" : "Course essentials";
  $("#listings-title").textContent = savedOnly ? "Your saved finds" : "Course essentials";
  $("#listings-subtitle").textContent = savedOnly
    ? "All the things you’ve had your eye on."
    : "Affordable books, kits and study tools for your RV University subjects.";
  $("#saved-count").textContent = saved.size;
  $("#saved-count").hidden = saved.size === 0;
  $("#saved-toggle").classList.toggle("active", savedOnly);
  $("#saved-toggle").setAttribute("aria-pressed", String(savedOnly));
  $$("[data-category]").forEach((button) => {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.classList.toggle("selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function sortListings() {
  const direction = $("#sort-listings").value;
  $$(".listing-card", grid)
    .sort((a, b) => direction === "low"
      ? Number(a.dataset.price) - Number(b.dataset.price)
      : direction === "high"
        ? Number(b.dataset.price) - Number(a.dataset.price)
        : Number(a.dataset.date) - Number(b.dataset.date))
    .forEach((card) => grid.append(card.parentElement));
  refresh();
}

function showModal(modal, show) {
  modal.hidden = !show;
  if (show) $("button, input, select, textarea, a[href]", modal)?.focus();
}

function showDetails(card) {
  const data = card.dataset;
  const fields = {
    "detail-category": data.category,
    "detail-posted": data.posted || $(".listing-category", card).lastChild.textContent.trim(),
    "detail-title": data.title,
    "detail-price": money(data.price),
    "detail-original": data.originalPrice ? `${money(data.originalPrice)} new` : "",
    "detail-condition": `${data.condition} condition`,
    "detail-description": data.description,
    "detail-initials": data.initials,
    "detail-seller": data.seller,
    "detail-campus": data.campus,
  };
  Object.entries(fields).forEach(([id, value]) => { $(`#${id}`).textContent = value; });
  $("#detail-photo").src = data.image;
  $("#detail-photo").alt = data.title;
  const accent = $(".listing-image", card).classList[1] || "mint";
  $("#detail-image").className = `detail-image ${accent}`;
  const message = `Hi ${data.seller}, I saw your listing for ${data.title} on Campus Cart. Is it still available?`;
  $("#contact-seller").href = `mailto:?subject=${encodeURIComponent(`Hi, I'm interested in ${data.title}`)}&body=${encodeURIComponent(message)}`;
  showModal($("#details-modal"), true);
}

function addListing(data) {
  const card = $("#listing-template").content.firstElementChild.cloneNode(true);
  const item = card.querySelector(".listing-card");
  Object.entries(data).forEach(([key, value]) => { item.dataset[key] = value; });
  $("[data-image]", item).classList.add(data.accent);
  $("[data-photo]", item).src = data.image;
  $("[data-condition]", item).textContent = data.condition;
  $("[data-view]", item).setAttribute("aria-label", `View ${data.title}`);
  $("[data-save]", item).setAttribute("aria-label", `Save ${data.title}`);
  $(".listing-category", item).innerHTML = `${data.category}<span>·</span>Just now`;
  $(".listing-title", item).textContent = data.title;
  $(".price-row strong", item).textContent = money(data.price);
  $(".price-row del", item).textContent = data.originalPrice ? money(data.originalPrice) : "";
  $(".seller-avatar", item).textContent = data.initials;
  $(".seller-name", item).textContent = data.seller;
  $(".seller-campus", item).textContent = data.campus;
  grid.prepend(card);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.category) {
    category = button.dataset.category;
    savedOnly = false;
    refresh();
    $("#listings").scrollIntoView({ behavior: "smooth" });
  } else if (button.matches("[data-save]")) {
    const title = button.closest(".listing-card").dataset.title;
    saved.has(title) ? saved.delete(title) : saved.add(title);
    button.classList.toggle("saved", saved.has(title));
    button.setAttribute("aria-pressed", String(saved.has(title)));
    button.setAttribute("aria-label", `${saved.has(title) ? "Remove" : "Save"} ${title}`);
    refresh();
  } else if (button.matches("[data-open-details]")) {
    showDetails(button.closest(".listing-card"));
  } else if (button.matches("[data-open-sell]")) {
    showModal($("#sell-modal"), true);
  } else if (button.matches("[data-close-modal]")) {
    showModal(button.closest(".modal-backdrop-custom"), false);
  } else if (button.id === "saved-toggle") {
    savedOnly = !savedOnly;
    refresh();
    $("#listings").scrollIntoView({ behavior: "smooth" });
  } else if (button.id === "reset-filters") {
    $("#market-search").value = "";
    category = "All items";
    savedOnly = false;
    refresh();
  }
});

$$(".modal-backdrop-custom").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) showModal(modal, false);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $$(".modal-backdrop-custom").forEach((modal) => showModal(modal, false));
});
$("#market-search").addEventListener("input", refresh);
$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#listings").scrollIntoView({ behavior: "smooth" });
});
$("#sort-listings").addEventListener("change", sortListings);
$("#contact-seller").addEventListener("click", () => showModal($("#details-modal"), false));

$("#photo-prompt").addEventListener("click", () => $("#listing-photo").click());
$("#photo-preview").addEventListener("click", () => $("#listing-photo").click());
$("#listing-photo").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file?.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    photo = reader.result;
    $("#photo-preview").innerHTML = `<img src="${photo}" alt="Listing photo preview"><span>Change photo</span>`;
    $("#photo-prompt").hidden = true;
    $("#photo-preview").hidden = false;
  };
  reader.readAsDataURL(file);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const seller = values.get("seller").trim();
  addListing({
    category: values.get("category"),
    condition: values.get("condition"),
    date: --sequence,
    description: values.get("description").trim(),
    image: photo || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85",
    initials: seller.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    price: Number(values.get("price")),
    seller,
    campus: values.get("campus").trim(),
    title: values.get("title").trim(),
    saved: "false",
    accent: "mint",
  });
  form.reset();
  photo = "";
  $("#photo-preview").replaceChildren();
  $("#photo-preview").hidden = true;
  $("#photo-prompt").hidden = false;
  category = "All items";
  savedOnly = false;
  $("#sort-listings").value = "newest";
  sortListings();
  showModal($("#sell-modal"), false);
  $("#toast-message").textContent = "Your listing is live on this page!";
  $("#toast-message").hidden = false;
  setTimeout(() => { $("#toast-message").hidden = true; }, 2600);
});

sortListings();
