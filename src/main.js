// Find page elements using their IDs.
function byId(id) {
  return document.getElementById(id);
}

var selectedCategory = "All items";
var showingSaved = false;
var nextDate = 0;

// Format prices using Indian rupees.
function showPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

// Show cards that match the search, category, and saved filter.
function updateCards() {
  var cards = document.querySelectorAll(".listing");
  var search = byId("search-input").value.toLowerCase();
  var shown = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var matchesCategory =
      selectedCategory === "All items" ||
      card.dataset.category === selectedCategory;
    var matchesSearch = card.dataset.title.toLowerCase().includes(search);
    var matchesSaved = !showingSaved || card.dataset.saved === "true";
    var shouldShow = matchesCategory && matchesSearch && matchesSaved;

    card.hidden = !shouldShow;
    if (shouldShow) shown++;
  }

  byId("empty-message").hidden = shown > 0;
  byId("saved-count").textContent = countSaved();
}

// Count listings saved by clicking the heart buttons.
function countSaved() {
  var cards = document.querySelectorAll(".listing");
  var count = 0;

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].dataset.saved === "true") count++;
  }

  return count;
}

// Sort cards by their price or date.
function sortCards() {
  var cards = document.querySelectorAll(".listing");
  var list = [];
  var order = byId("sort").value;

  for (var i = 0; i < cards.length; i++) list.push(cards[i]);

  // Simple bubble sort: swap neighboring cards that are in the wrong order.
  for (var j = 0; j < list.length; j++) {
    for (var k = 0; k < list.length - 1; k++) {
      var first;
      var second;

      if (order === "low") {
        first = Number(list[k].dataset.price);
        second = Number(list[k + 1].dataset.price);
      } else if (order === "high") {
        first = Number(list[k + 1].dataset.price);
        second = Number(list[k].dataset.price);
      } else {
        first = Number(list[k].dataset.date);
        second = Number(list[k + 1].dataset.date);
      }

      if (first > second) {
        var oldCard = list[k];
        list[k] = list[k + 1];
        list[k + 1] = oldCard;
      }
    }
  }

  for (var m = 0; m < list.length; m++) {
    byId("listing-grid").appendChild(list[m]);
  }

  updateCards();
}

// Add click actions to a listing's heart and title.
function connectCard(card) {
  card.querySelector(".save").addEventListener("click", function () {
    if (card.dataset.saved === "true") {
      card.dataset.saved = "false";
      this.textContent = "♡";
    } else {
      card.dataset.saved = "true";
      this.textContent = "♥";
    }
    updateCards();
  });

  card.querySelector(".details").addEventListener("click", function () {
    byId("detail-image").src = card.dataset.image;
    byId("detail-image").alt = card.dataset.title;
    byId("detail-title").textContent = card.dataset.title;
    byId("detail-price").textContent = showPrice(card.dataset.price);
    byId("detail-description").textContent = card.dataset.description;
    byId("detail-seller").textContent =
      card.dataset.seller + " · " + card.dataset.place;

    var subject = "Interested in " + card.dataset.title;
    var message =
      "Hi " + card.dataset.seller + ", is " + card.dataset.title + " available?";
    byId("contact-link").href =
      "mailto:?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message);

    byId("details-modal").hidden = false;
  });
}

// Make the category buttons filter the cards.
var categoryButtons = document.querySelectorAll("[data-category]");
for (var i = 0; i < categoryButtons.length; i++) {
  categoryButtons[i].addEventListener("click", function () {
    selectedCategory = this.dataset.category;
    showingSaved = false;

    for (var j = 0; j < categoryButtons.length; j++) {
      categoryButtons[j].classList.remove("active");
    }
    this.classList.add("active");
    updateCards();
  });
}

// Set up buttons on the sample cards.
var sampleCards = document.querySelectorAll(".listing");
for (var j = 0; j < sampleCards.length; j++) {
  sampleCards[j].dataset.saved = "false";
  connectCard(sampleCards[j]);
}

// Search as the user types.
byId("search-input").addEventListener("input", updateCards);
byId("search-form").addEventListener("submit", function (event) {
  event.preventDefault();
  updateCards();
});

// Change the card order when the sort menu changes.
byId("sort").addEventListener("change", sortCards);

// Show only saved cards when the Saved button is clicked.
byId("saved-button").addEventListener("click", function () {
  showingSaved = !showingSaved;
  updateCards();
});

// Open the sell form from either button.
var sellButtons = document.querySelectorAll(".open-sell");
for (var k = 0; k < sellButtons.length; k++) {
  sellButtons[k].addEventListener("click", function () {
    byId("sell-modal").hidden = false;
  });
}

// Close a dialog using its close button or by clicking outside the box.
var closeButtons = document.querySelectorAll("[data-close]");
for (var m = 0; m < closeButtons.length; m++) {
  closeButtons[m].addEventListener("click", function () {
    byId(this.dataset.close).hidden = true;
  });
}

var modals = document.querySelectorAll(".modal");
for (var n = 0; n < modals.length; n++) {
  modals[n].addEventListener("click", function (event) {
    if (event.target === this) this.hidden = true;
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    byId("details-modal").hidden = true;
    byId("sell-modal").hidden = true;
  }
});

// Create a new card from the information typed into the sell form.
function addCard(title, price, category, seller, place, description, image) {
  var card = document.createElement("article");
  card.className = "listing";
  card.dataset.title = title;
  card.dataset.category = category;
  card.dataset.price = price;
  card.dataset.date = nextDate;
  card.dataset.seller = seller;
  card.dataset.place = place;
  card.dataset.description = description;
  card.dataset.image = image;
  card.dataset.saved = "false";

  var picture = document.createElement("img");
  picture.src = image;
  picture.alt = title;

  var info = document.createElement("div");
  info.className = "listing-info";

  var saveButton = document.createElement("button");
  saveButton.className = "save";
  saveButton.textContent = "♡";

  var titleButton = document.createElement("button");
  titleButton.className = "title details";
  titleButton.textContent = title;

  var priceText = document.createElement("p");
  priceText.className = "price";
  priceText.textContent = showPrice(price);

  var sellerText = document.createElement("p");
  sellerText.className = "seller";
  sellerText.textContent = seller + " · " + place;

  info.appendChild(saveButton);
  info.appendChild(titleButton);
  info.appendChild(priceText);
  info.appendChild(sellerText);
  card.appendChild(picture);
  card.appendChild(info);
  byId("listing-grid").appendChild(card);
  connectCard(card);
}

// Preview the optional photo selected in the sell form.
var selectedPhoto = "";
byId("sell-form").elements.photo.addEventListener("change", function () {
  var file = this.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function () {
    selectedPhoto = reader.result;
  };
  reader.readAsDataURL(file);
});

// Check the sell form and add its item to the page.
byId("sell-form").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!this.reportValidity()) return;

  var title = this.elements.title.value.trim();
  var image = selectedPhoto;
  if (image === "") {
    image =
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80";
  }

  nextDate = nextDate - 1;
  addCard(
    title,
    this.elements.price.value,
    this.elements.category.value,
    this.elements.seller.value.trim(),
    this.elements.place.value.trim(),
    this.elements.description.value.trim(),
    image,
  );

  this.reset();
  selectedPhoto = "";
  byId("sell-modal").hidden = true;
  sortCards();
});

// Sort the sample listings when the page first opens.
sortCards();
