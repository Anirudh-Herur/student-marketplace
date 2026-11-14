// Small helpers keep the page code easier to read.
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];

const listingGrid = $("#listing-grid");
const sellForm = $("#sell-form");

// These values describe the current page view. They are not saved to a server.
const savedListings = new Set();
let selectedCategory = "All items";
let showSavedOnly = false;
let uploadedPhoto = "";
let newListingOrder = 0;

// Change the currency here if the marketplace uses a different one.
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

// Show only listings that match the search, category, and saved-items filters.
function updateListings() {
  const searchText = $("#market-search").value.trim().toLowerCase();
  let visibleCount = 0;

  $$(".listing-card", listingGrid).forEach((card) => {
    const listingText = [
      card.dataset.title,
      card.dataset.category,
      card.dataset.condition,
      card.dataset.seller,
      card.dataset.campus,
    ]
      .join(" ")
      .toLowerCase();

    const matchesCategory =
      selectedCategory === "All items" ||
      card.dataset.category === selectedCategory;
    const matchesSearch = listingText.includes(searchText);
    const isSaved = savedListings.has(card.dataset.title);
    const shouldShow =
      matchesCategory && matchesSearch && (!showSavedOnly || isSaved);

    card.parentElement.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  // Update the empty message when no listings match the current filters.
  $("#empty-state").hidden = visibleCount > 0;
  $("#empty-icon").textContent = showSavedOnly ? "♡" : "⌕";
  $("#empty-title").textContent = showSavedOnly
    ? "Your saved list is waiting"
    : "No finds just yet";
  $("#empty-description").textContent = showSavedOnly
    ? "Tap the heart on anything you love and it’ll show up here."
    : "Try another search or category. Your next great find is out there.";

  // Keep the listings heading and saved-items button in sync with the filters.
  $("#listings-kicker").textContent = showSavedOnly
    ? "Your little collection"
    : "Course essentials";
  $("#listings-title").textContent = showSavedOnly
    ? "Your saved finds"
    : "Course essentials";
  $("#listings-subtitle").textContent = showSavedOnly
    ? "All the things you’ve had your eye on."
    : "Affordable books, kits and study tools for your RV University subjects.";
  $("#saved-count").textContent = savedListings.size;
  $("#saved-count").hidden = savedListings.size === 0;
  $("#saved-toggle").classList.toggle("active", showSavedOnly);
  $("#saved-toggle").setAttribute("aria-pressed", String(showSavedOnly));

  // Highlight the currently selected category buttons.
  $$("[data-category]").forEach((button) => {
    const isSelected = button.dataset.category === selectedCategory;
    button.classList.toggle("active", isSelected);
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

// Sort listings by their data-price or data-date values in index.html.
function sortListings() {
  const sortOrder = $("#sort-listings").value;
  const cards = $$(".listing-card", listingGrid);

  cards.sort((first, second) => {
    if (sortOrder === "low") {
      return Number(first.dataset.price) - Number(second.dataset.price);
    }

    if (sortOrder === "high") {
      return Number(second.dataset.price) - Number(first.dataset.price);
    }

    return Number(first.dataset.date) - Number(second.dataset.date);
  });

  cards.forEach((card) => listingGrid.append(card.parentElement));
  updateListings();
}

// Open or close either of the page's dialogs.
function setModalOpen(modal, isOpen) {
  modal.hidden = !isOpen;

  if (isOpen) {
    const firstControl = $("button, input, select, textarea, a[href]", modal);

    if (firstControl) {
      firstControl.focus();
    }
  }
}

// Fill the details dialog using the selected listing's data attributes.
function showListingDetails(card) {
  const listing = card.dataset;
  const details = {
    "detail-category": listing.category,
    "detail-posted":
      listing.posted ||
      $(".listing-category", card).lastChild.textContent.trim(),
    "detail-title": listing.title,
    "detail-price": formatPrice(listing.price),
    "detail-original": listing.originalPrice
      ? `${formatPrice(listing.originalPrice)} new`
      : "",
    "detail-condition": `${listing.condition} condition`,
    "detail-description": listing.description,
    "detail-initials": listing.initials,
    "detail-seller": listing.seller,
    "detail-campus": listing.campus,
  };

  Object.entries(details).forEach(([elementId, value]) => {
    $(`#${elementId}`).textContent = value;
  });

  $("#detail-photo").src = listing.image;
  $("#detail-photo").alt = listing.title;

  const imageColor = $(".listing-image", card).classList[1] || "mint";
  $("#detail-image").className = `detail-image ${imageColor}`;

  // This link opens an email app; it does not send a message automatically.
  const message =
    `Hi ${listing.seller}, I saw your listing for ${listing.title} ` +
    "on Campus Cart. Is it still available?";
  const subject = `Hi, I'm interested in ${listing.title}`;
  $("#contact-seller").href =
    `mailto:?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;

  setModalOpen($("#details-modal"), true);
}

// Add a new listing by copying the HTML template in index.html.
function addListing(listing) {
  const listingElement =
    $("#listing-template").content.firstElementChild.cloneNode(true);
  const card = $(".listing-card", listingElement);

  // Store listing details on the card so search and details can read them.
  Object.entries(listing).forEach(([name, value]) => {
    card.dataset[name] = value;
  });

  $("[data-image]", card).classList.add(listing.accent);
  $("[data-photo]", card).src = listing.image;
  $("[data-condition]", card).textContent = listing.condition;
  $("[data-view]", card).setAttribute("aria-label", `View ${listing.title}`);
  $("[data-save]", card).setAttribute("aria-label", `Save ${listing.title}`);
  $(".listing-category", card).innerHTML =
    `${listing.category}<span>·</span>Just now`;
  $(".listing-title", card).textContent = listing.title;
  $(".price-row strong", card).textContent = formatPrice(listing.price);
  $(".price-row del", card).textContent = listing.originalPrice
    ? formatPrice(listing.originalPrice)
    : "";
  $(".seller-avatar", card).textContent = listing.initials;
  $(".seller-name", card).textContent = listing.seller;
  $(".seller-campus", card).textContent = listing.campus;

  listingGrid.prepend(listingElement);
}

// One click listener handles filters, saved items, and dialog buttons.
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  if (button.dataset.category) {
    selectedCategory = button.dataset.category;
    showSavedOnly = false;
    updateListings();
    $("#listings").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (button.matches("[data-save]")) {
    const title = button.closest(".listing-card").dataset.title;

    if (savedListings.has(title)) {
      savedListings.delete(title);
    } else {
      savedListings.add(title);
    }

    const isSaved = savedListings.has(title);
    button.classList.toggle("saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    button.setAttribute(
      "aria-label",
      `${isSaved ? "Remove" : "Save"} ${title}`,
    );
    updateListings();
    return;
  }

  if (button.matches("[data-open-details]")) {
    showListingDetails(button.closest(".listing-card"));
    return;
  }

  if (button.matches("[data-open-sell]")) {
    setModalOpen($("#sell-modal"), true);
    return;
  }

  if (button.matches("[data-close-modal]")) {
    setModalOpen(button.closest(".modal-backdrop-custom"), false);
    return;
  }

  if (button.id === "saved-toggle") {
    showSavedOnly = !showSavedOnly;
    updateListings();
    $("#listings").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (button.id === "reset-filters") {
    $("#market-search").value = "";
    selectedCategory = "All items";
    showSavedOnly = false;
    updateListings();
  }
});

// Clicking outside a dialog or pressing Escape closes it.
$$(".modal-backdrop-custom").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      setModalOpen(modal, false);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $$(".modal-backdrop-custom").forEach((modal) => {
      setModalOpen(modal, false);
    });
  }
});

// Search updates as the user types. Submitting the form scrolls to the results.
$("#market-search").addEventListener("input", updateListings);
$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#listings").scrollIntoView({ behavior: "smooth" });
});
$("#sort-listings").addEventListener("change", sortListings);
$("#contact-seller").addEventListener("click", () => {
  setModalOpen($("#details-modal"), false);
});

// Let the user choose a photo, then show a preview in the listing form.
$("#photo-prompt").addEventListener("click", () => {
  $("#listing-photo").click();
});
$("#photo-preview").addEventListener("click", () => {
  $("#listing-photo").click();
});
$("#listing-photo").addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file || !file.type.startsWith("image/")) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    uploadedPhoto = reader.result;
    $("#photo-preview").innerHTML =
      `<img src="${uploadedPhoto}" alt="Listing photo preview">` +
      "<span>Change photo</span>";
    $("#photo-prompt").hidden = true;
    $("#photo-preview").hidden = false;
  };

  reader.readAsDataURL(file);
});

// Check the form and add its listing to this page only.
sellForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!sellForm.reportValidity()) {
    return;
  }

  const formValues = new FormData(sellForm);
  const sellerName = formValues.get("seller").trim();
  const sellerInitials = sellerName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  addListing({
    category: formValues.get("category"),
    condition: formValues.get("condition"),
    date: --newListingOrder,
    description: formValues.get("description").trim(),
    image:
      uploadedPhoto ||
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85",
    initials: sellerInitials,
    price: Number(formValues.get("price")),
    seller: sellerName,
    campus: formValues.get("campus").trim(),
    title: formValues.get("title").trim(),
    saved: "false",
    accent: "mint",
  });

  // Clear the form and photo preview after the listing is added.
  sellForm.reset();
  uploadedPhoto = "";
  $("#photo-preview").replaceChildren();
  $("#photo-preview").hidden = true;
  $("#photo-prompt").hidden = false;

  selectedCategory = "All items";
  showSavedOnly = false;
  $("#sort-listings").value = "newest";
  sortListings();
  setModalOpen($("#sell-modal"), false);

  // This message confirms the listing was added to the current page.
  $("#toast-message").textContent = "Your listing is live on this page!";
  $("#toast-message").hidden = false;
  setTimeout(() => {
    $("#toast-message").hidden = true;
  }, 2600);
});

// Apply the selected sort order when the page first opens.
sortListings();
