const listingGrid = document.getElementById("listing-grid");
const searchInput = document.getElementById("market-search");
const sortSelect = document.getElementById("sort-listings");
const savedToggle = document.getElementById("saved-toggle");
const savedCount = document.getElementById("saved-count");
const emptyState = document.getElementById("empty-state");
const searchForm = document.getElementById("search-form");
const detailsModal = document.getElementById("details-modal");
const sellModal = document.getElementById("sell-modal");
const sellForm = document.getElementById("sell-form");
const listingPhoto = document.getElementById("listing-photo");
const photoPrompt = document.getElementById("photo-prompt");
const photoPreview = document.getElementById("photo-preview");
const toastMessage = document.getElementById("toast-message");

let activeCategory = "All items";
let savedOnly = false;
let currentPhoto = "";
let nextListingDate = 0;
let toastTimer;
let lastFocusedElement;
const categoryButtons = document.querySelectorAll(
  ".category-tile[data-category], .filter-pill[data-category], .text-link[data-category]",
);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function getCards() {
  return Array.from(listingGrid.querySelectorAll(".listing-card"));
}

function updateSavedCount() {
  const count = getCards().filter((card) => card.dataset.saved === "true").length;
  savedCount.textContent = count;
  savedCount.hidden = count === 0;
}

function setCategory(category) {
  activeCategory = category;
  savedOnly = false;
  savedToggle.classList.remove("active");
  savedToggle.setAttribute("aria-pressed", "false");

  categoryButtons.forEach((button) => {
    const selected = button.dataset.category === category;
    button.classList.toggle("active", selected);
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  filterListings();
}

function filterListings() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = getCards();
  let visibleCount = 0;

  cards.forEach((card) => {
    const searchable = [
      card.dataset.title,
      card.dataset.category,
      card.dataset.condition,
      card.dataset.campus,
      card.dataset.seller,
    ].join(" ").toLowerCase();
    const matchesCategory = activeCategory === "All items" || card.dataset.category === activeCategory;
    const matchesSearch = !query || searchable.includes(query);
    const matchesSaved = !savedOnly || card.dataset.saved === "true";
    const visible = matchesCategory && matchesSearch && matchesSaved;
    card.parentElement.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const isEmpty = visibleCount === 0;
  emptyState.hidden = !isEmpty;
  document.getElementById("empty-icon").textContent = savedOnly ? "♡" : "⌕";
  document.getElementById("empty-title").textContent = savedOnly ? "Your saved list is waiting" : "No finds just yet";
  document.getElementById("empty-description").textContent = savedOnly
    ? "Tap the heart on anything you love and it’ll show up here."
    : "Try another search or category. Your next great find is out there.";
  document.getElementById("listings-kicker").textContent = savedOnly ? "Your little collection" : "Fresh from around campus";
  document.getElementById("listings-title").textContent = savedOnly ? "Your saved finds" : "Recently listed";
  document.getElementById("listings-subtitle").textContent = savedOnly
    ? "All the things you’ve had your eye on."
    : "One student’s done-with-it is another’s just-what-I-needed.";
}

function sortListings() {
  const cards = getCards();
  const sortBy = sortSelect.value;
  cards.sort((left, right) => {
    if (sortBy === "low") return Number(left.dataset.price) - Number(right.dataset.price);
    if (sortBy === "high") return Number(right.dataset.price) - Number(left.dataset.price);
    return Number(left.dataset.date) - Number(right.dataset.date);
  });
  cards.forEach((card) => listingGrid.appendChild(card.parentElement));
  filterListings();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toastMessage.hidden = false;
  toastTimer = window.setTimeout(() => {
    toastMessage.hidden = true;
  }, 2600);
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  const focusTarget = modal.querySelector("button, input, select, textarea, a[href]");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function openDetails(card) {
  const details = card.dataset;
  const image = document.getElementById("detail-photo");
  const imageBox = document.getElementById("detail-image");
  const accent = card.querySelector(".listing-image").className.split(" ").find((name) =>
    ["mint", "lavender", "peach", "sky", "yellow", "pink"].includes(name));

  document.getElementById("detail-category").textContent = details.category;
  document.getElementById("detail-posted").textContent = details.posted || card.querySelector(".listing-category").lastChild.textContent.trim();
  document.getElementById("detail-title").textContent = details.title;
  document.getElementById("detail-price").textContent = `$${details.price}`;
  document.getElementById("detail-original").textContent = details.originalPrice ? `$${details.originalPrice} new` : "";
  document.getElementById("detail-condition").textContent = `${details.condition} condition`;
  document.getElementById("detail-description").textContent = details.description;
  document.getElementById("detail-initials").textContent = details.initials;
  document.getElementById("detail-seller").textContent = details.seller;
  document.getElementById("detail-campus").textContent = details.campus;
  image.src = details.image;
  image.alt = details.title;
  imageBox.className = `detail-image ${accent || "mint"}`;
  const contactBody = `Hi ${details.seller}, I saw your listing for ${details.title} on Campus Cart. Is it still available?`;
  document.getElementById("contact-seller").href =
    `mailto:?subject=${encodeURIComponent(`Hi, I'm interested in ${details.title}`)}&body=${encodeURIComponent(contactBody)}`;
  openModal(detailsModal);
}

function createListingCard(listing) {
  const title = escapeHTML(listing.title);
  const category = escapeHTML(listing.category);
  const condition = escapeHTML(listing.condition);
  const seller = escapeHTML(listing.seller);
  const initials = escapeHTML(listing.initials);
  const campus = escapeHTML(listing.campus);
  const description = escapeHTML(listing.description);
  const image = escapeHTML(listing.image);
  const originalPrice = listing.originalPrice ? `<del>$${Number(listing.originalPrice)}</del>` : "";
  const accent = ["mint", "lavender", "peach", "sky", "yellow", "pink"].includes(listing.accent)
    ? listing.accent
    : "mint";
  const wrapper = document.createElement("div");
  wrapper.className = "col-12 col-sm-6 col-lg-3";
  wrapper.innerHTML = `
    <article class="listing-card"
      data-category="${category}" data-price="${Number(listing.price)}"
      data-date="${Number(listing.date)}" data-saved="false"
      data-title="${title}" data-condition="${condition}" data-seller="${seller}"
      data-initials="${initials}" data-campus="${campus}"
      data-description="${description}" data-image="${image}"
      data-original-price="${Number(listing.originalPrice) || ""}" data-posted="Just now">
      <button class="listing-image-button" type="button" data-open-details aria-label="View ${title}">
        <span class="listing-image ${accent}"><img src="${image}" alt="" loading="lazy" /><span class="condition-tag">${condition}</span></span>
      </button>
      <button class="save-button" type="button" data-save aria-label="Save ${title}" aria-pressed="false">
        <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
      </button>
      <div class="listing-body">
        <div class="listing-category">${category}<span>·</span>Just now</div>
        <button class="listing-title" type="button" data-open-details>${title}</button>
        <div class="price-row"><strong>$${Number(listing.price)}</strong>${originalPrice}</div>
        <div class="seller-row"><span class="seller-avatar">${initials}</span><span class="seller-name">${seller}</span><span class="seller-campus">${campus}</span></div>
      </div>
    </article>`;
  return wrapper;
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
    document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
  });
});

listingGrid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const card = saveButton.closest(".listing-card");
    const isSaved = card.dataset.saved !== "true";
    card.dataset.saved = String(isSaved);
    saveButton.classList.toggle("saved", isSaved);
    saveButton.setAttribute("aria-pressed", String(isSaved));
    saveButton.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${card.dataset.title}${isSaved ? " from saved items" : ""}`);
    updateSavedCount();
    filterListings();
    return;
  }

  const detailsButton = event.target.closest("[data-open-details]");
  if (detailsButton) openDetails(detailsButton.closest(".listing-card"));
});

savedToggle.addEventListener("click", () => {
  savedOnly = !savedOnly;
  savedToggle.classList.toggle("active", savedOnly);
  savedToggle.setAttribute("aria-pressed", String(savedOnly));
  filterListings();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", filterListings);
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});
sortSelect.addEventListener("change", sortListings);
document.getElementById("reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  savedOnly = false;
  savedToggle.classList.remove("active");
  savedToggle.setAttribute("aria-pressed", "false");
  setCategory("All items");
});

document.querySelectorAll("[data-open-sell]").forEach((button) => {
  button.addEventListener("click", () => openModal(sellModal));
});
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal-backdrop-custom");
    closeModal(modal);
  });
});
document.querySelectorAll(".modal-backdrop-custom").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    [detailsModal, sellModal].forEach((modal) => {
      if (!modal.hidden) closeModal(modal);
    });
  }
});

photoPrompt.addEventListener("click", () => listingPhoto.click());
photoPreview.addEventListener("click", () => listingPhoto.click());
listingPhoto.addEventListener("change", () => {
  const file = listingPhoto.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    listingPhoto.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentPhoto = reader.result;
    photoPreview.replaceChildren();
    const previewImage = document.createElement("img");
    previewImage.src = currentPhoto;
    previewImage.alt = "Listing photo preview";
    const caption = document.createElement("span");
    caption.textContent = "Change photo";
    photoPreview.append(previewImage, caption);
    photoPrompt.hidden = true;
    photoPreview.hidden = false;
  });
  reader.readAsDataURL(file);
});

sellForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!sellForm.reportValidity()) return;

  const values = new FormData(sellForm);
  const title = values.get("title").trim();
  const seller = values.get("seller").trim();
  const listing = {
    title,
    category: values.get("category"),
    price: Number(values.get("price")),
    condition: values.get("condition"),
    seller,
    initials: seller.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    campus: values.get("campus").trim(),
    description: values.get("description").trim(),
    image: currentPhoto || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85",
    date: --nextListingDate,
    accent: "mint",
  };
  listingGrid.prepend(createListingCard(listing));
  sellForm.reset();
  currentPhoto = "";
  listingPhoto.value = "";
  photoPreview.replaceChildren();
  photoPreview.hidden = true;
  photoPrompt.hidden = false;
  setCategory("All items");
  savedOnly = false;
  savedToggle.classList.remove("active");
  savedToggle.setAttribute("aria-pressed", "false");
  sortSelect.value = "newest";
  sortListings();
  closeModal(sellModal);
  showToast("Your listing is live on this page!");
});

document.getElementById("contact-seller").addEventListener("click", () => {
  closeModal(detailsModal);
});

updateSavedCount();
sortListings();
