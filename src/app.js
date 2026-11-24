/*
  QUICK CODE GUIDE FOR COMMON QUESTIONS:
  - Search, category filters, wishlist, and sorting: updateListings() and sortListings().
  - Product card click actions and popup details: connectListing() and showItemDetails().
  - New item form and photo preview: setUpSellForm(); its fields are in sell.html.
  - Login demo, purchase history, and inquiries: setUpLogin(), setUpPurchaseButton(), and setUpInquiryForm().
  - Browser/folder saving: readBrowserData(), saveData(), and chooseDataFolder().
  - To add a sample product, edit a .listing card in index.html and buy.html.
  Styling and font sizes are in src/style.css; look for the matching class selector.
*/

// Find an element by its ID.
function byId(id) { // Helper: find an HTML element by its ID.
  return document.getElementById(id); // Return the HTML element with the requested ID.
} // End this code block.

// All information that can be saved to marketplace.json.
var data = { // Create a variable for all marketplace records.
  listings: [], // Store the student-created product listings.
  purchases: [], // Store the demo purchase-history records.
  inquiries: [], // Store the messages sent to sample sellers.
  users: [], // Store the demo student profiles.
  savedItems: [] // Store the IDs for items in the wishlist.
}; // End this code block.

// Make sure older or edited JSON files contain the lists used by the app.
function prepareData(savedData) { // Helper: check saved marketplace data and make sure its lists exist.
  if (!savedData || typeof savedData !== "object" || Array.isArray(savedData)) { // Reject missing data or a saved value that is not an object.
    throw new Error("Marketplace data must be a JSON object."); // Stop loading because this file is not a marketplace data object.
  } // End this code block.
  if (!Array.isArray(savedData.listings)) savedData.listings = []; // Create an empty list when this field is missing from older saved data.
  if (!Array.isArray(savedData.purchases)) savedData.purchases = []; // Create an empty list when this field is missing from older saved data.
  if (!Array.isArray(savedData.inquiries)) savedData.inquiries = []; // Create an empty list when this field is missing from older saved data.
  if (!Array.isArray(savedData.users)) savedData.users = []; // Create an empty list when this field is missing from older saved data.
  if (!Array.isArray(savedData.savedItems)) savedData.savedItems = []; // Create an empty list when this field is missing from older saved data.
  return savedData; // Return the checked marketplace data.
} // End this code block.

var currentUser = null; // Create a variable for the current demo student profile.
var storageFolder = null; // Create a variable for the folder selected for saving files.
var uploadedImage = ""; // Create a variable for the selected photo preview.
var selectedCategory = "All items"; // Create a variable for the active category filter.
var showingSaved = false; // Create a variable for whether the wishlist filter is active.
var sampleTitles = [ // Keep example titles in the same order as the cards in index.html.
  "Electrical and Electronics Lab Kit", // Name of one example item used in the inquiry menu.
  "Constitution of India course reader", // Name of one example item used in the inquiry menu.
  "Discrete Mathematics textbook", // Name of one example item used in the inquiry menu.
  "Scientific calculator", // Name of one example item used in the inquiry menu.
  "English Communication workbook", // Name of one example item used in the inquiry menu.
  "Exploring Science experiment kit", // Name of one example item used in the inquiry menu.
  "Programming in C textbook", // Name of one example item used in the inquiry menu.
  "Web Technology guide", // Name of one example item used in the inquiry menu.
  "Design Thinking workbook" // Name of one example item used in the inquiry menu.
]; // Finish this list of sample values.
var sampleSellers = ["Srikar", "Sahil", "Naman", "Anirudh", "Priya", "Aarav", "Naman", "Sahil", "Srikar"]; // Keep seller names matched to the sample titles above.

// Format prices using Indian rupees.
function formatPrice(price) { // Helper: format a price in Indian rupees.
  return "₹" + Number(price).toLocaleString("en-IN"); // Return the price with Indian digit grouping and the rupee sign.
} // End this code block.

// Read the browser's saved copy. This works when folder access is unavailable.
function readBrowserData() { // Helper: load marketplace data and the demo profile from this browser.
  var savedData = localStorage.getItem("campusCartData"); // Read the marketplace JSON text saved in this browser.
  if (savedData) { // Load marketplace data only when a saved copy exists.
    try { // Try this operation so a browser or file error can be handled.
      data = prepareData(JSON.parse(savedData)); // Replace the starting data with checked data loaded from storage.
    } catch (error) { // Handle the failed operation and show a useful status when needed.
      showStorageMessage("Saved browser data could not be read."); // Show the current save or error status.
    } // End this code block.
  } // End this code block.

  var savedUser = localStorage.getItem("campusCartUser"); // Read the demo student profile saved in this browser.
  if (savedUser) { // Load the profile only when a saved copy exists.
    try { // Try this operation so a browser or file error can be handled.
      currentUser = JSON.parse(savedUser); // Load the saved student profile from browser storage.
    } catch (error) { // Handle the failed operation and show a useful status when needed.
      localStorage.removeItem("campusCartUser"); // Remove this saved value from browser storage.
    } // End this code block.
  } // End this code block.
} // End this code block.

// Show information or an error above the current page.
function showStorageMessage(message) { // Helper: display a saving message above the page.
  var status = byId("storage-status"); // Create a variable for the status-message element above the page.
  if (status) status.textContent = message; // Update the message only when its page element exists.
} // End this code block.

// Save the data in this browser and, if chosen, in the selected folder.
async function saveData() { // Helper: save the current marketplace data.
  var browserSaved = true; // Create a variable for whether the browser save succeeded.
  try { // Try this operation so a browser or file error can be handled.
    localStorage.setItem("campusCartData", JSON.stringify(data)); // Save this value in browser storage.
  } catch (error) { // Handle the failed operation and show a useful status when needed.
    browserSaved = false; // Remember that the browser save did not work.
    showStorageMessage("Browser storage is full or unavailable. Choose a data folder or free browser storage space."); // Show the current save or error status.
  } // End this code block.

  if (!storageFolder) { // Use browser storage when no folder was selected.
    if (browserSaved) { // Show the success message when the browser save worked.
      showStorageMessage("Saved in this browser. Choose the project folder to also save files beside the website."); // Show the current save or error status.
    } // End this code block.
    return browserSaved; // Return this value to the code that called the helper.
  } // End this code block.

  try { // Try this operation so a browser or file error can be handled.
    var file = await storageFolder.getFileHandle("marketplace.json", { create: true }); // Open or create the marketplace JSON file in the chosen folder.
    var writer = await file.createWritable(); // Create a variable for the file writer used to save data.
    await writer.write(JSON.stringify(data, null, 2)); // Write the marketplace data as readable JSON.
    await writer.close(); // Finish writing and close the file.
    if (browserSaved) { // Show the success message when the browser save worked.
      showStorageMessage("Saved to marketplace.json in your chosen project folder."); // Show the current save or error status.
    } else { // Use this path when the previous condition was false.
      showStorageMessage("Saved to the chosen folder. Browser storage is full or unavailable."); // Show the current save or error status.
    } // End this code block.
    return true; // Return this value to the code that called the helper.
  } catch (error) { // Handle the failed operation and show a useful status when needed.
    showStorageMessage(browserSaved // Show the current save or error status.
      ? "Could not save the folder file. Your browser copy is still saved." // Explain that the browser copy is still available when folder saving fails.
      : "Could not save in the chosen folder or browser storage."); // Explain that neither saving location could be used.
    return false; // Return this value to the code that called the helper.
  } // End this code block.
} // End this code block.

// Copy an uploaded photo into the images folder.
async function saveImageFile(file, id) { // Helper: save an uploaded photo in the images folder.
  if (!storageFolder) return uploadedImage; // Use browser storage when no folder was selected.

  var imagesFolder = await storageFolder.getDirectoryHandle("images", { create: true }); // Open or create the folder for product photos.
  var extension = file.name.split(".").pop().toLowerCase(); // Create a variable for the photo file extension.
  var fileName = "item-" + id + "." + extension; // Create a variable for the new photo file name.
  var imageFile = await imagesFolder.getFileHandle(fileName, { create: true }); // Open or create the image file in the images folder.
  var writer = await imageFile.createWritable(); // Create a variable for the file writer used to save data.
  await writer.write(file); // Write the selected image file into the images folder.
  await writer.close(); // Finish writing and close the file.
  return "images/" + fileName; // Return this value to the code that called the helper.
} // End this code block.

// Move photos saved in browser storage into the chosen images folder.
async function saveOldPhotosToFolder() { // Helper: move browser-stored photos into the chosen folder.
  for (var i = 0; i < data.listings.length; i++) { // Repeat this block once for every student-created listing.
    var listing = data.listings[i]; // Get the current student listing so its photo can be checked.

    if (listing.image && listing.image.indexOf("data:image/") === 0) { // Copy only photos stored as browser image data into the folder.
      var response = await fetch(listing.image); // Read the browser-stored photo data.
      var imageBlob = await response.blob(); // Create a variable for the selected photo data.
      var imageFile = new File([imageBlob], "upload.jpg", { type: imageBlob.type }); // Wrap the saved image data in a File object so it can be written.
      listing.image = await saveImageFile(imageFile, listing.id); // Replace temporary photo data with its folder path.
    } // End this code block.
  } // End this code block.
} // End this code block.

// Ask the user to select the project folder for JSON and image files.
async function chooseDataFolder() { // Helper: let the student select a folder for marketplace files.
  if (!window.showDirectoryPicker) { // Check whether this browser supports folder selection.
    showStorageMessage("Folder saving needs Chrome or Edge. Browser-only saving is still available."); // Show the current save or error status.
    return; // Stop here because this page does not need more work.
  } // End this code block.

  try { // Try this operation so a browser or file error can be handled.
    storageFolder = await window.showDirectoryPicker({ mode: "readwrite" }); // Ask permission to use a folder selected by the student.

    try { // Try this operation so a browser or file error can be handled.
      var file = await storageFolder.getFileHandle("marketplace.json"); // Open or create the marketplace JSON file in the chosen folder.
      var savedFile = await file.getFile(); // Create a variable for the existing marketplace data file.
      data = prepareData(JSON.parse(await savedFile.text())); // Replace the starting data with checked data loaded from storage.
    } catch (error) { // Handle the failed operation and show a useful status when needed.
      if (error.name !== "NotFoundError") { // Treat errors other than a missing new file as a read failure.
        storageFolder = null; // Clear the folder handle because its data could not be read.
        showStorageMessage("The folder data file could not be read. The browser copy is unchanged."); // Show the current save or error status.
        return; // Stop here because this page does not need more work.
      } // End this code block.
    } // End this code block.

    await saveOldPhotosToFolder(); // Copy existing browser-stored photos into the selected folder.
    await saveData(); // Save the loaded marketplace data into the selected folder.
    renderSavedListings(); // Refresh the marketplace cards.
    renderHistory(); // Refresh the purchase history.
    renderInquiries(); // Refresh the inquiry list.
    fillInquiryChoices(); // Refresh the item choices in the inquiry form.
    showStorageMessage("Folder selected. Data is saved in marketplace.json and uploaded photos are saved in images/."); // Show the current save or error status.
  } catch (error) { // Handle the failed operation and show a useful status when needed.
    if (error.name !== "AbortError") { // Show an error unless the student cancelled folder selection.
      showStorageMessage("Could not open that folder. Browser-only saving is still available."); // Show the current save or error status.
    } // End this code block.
  } // End this code block.
} // End this code block.

// Add buttons to a sample or saved listing card.
function connectListing(card) { // Helper: connect the wishlist and details buttons on a product card.
  if (card.dataset.connected === "true") return; // Leave this helper early when the condition is true.
  card.dataset.connected = "true"; // Mark the buttons as connected so they are not added twice.

  card.querySelector(".save").addEventListener("click", async function () { // Run this code when the student clicks this control.
    var id = card.dataset.id; // Create a variable for this item unique ID.
    var savedIndex = data.savedItems.indexOf(id); // Create a variable for the product position in the wishlist.

    if (savedIndex === -1) { // Add this product only when it is not already in the wishlist.
      data.savedItems.push(id); // Add this product ID to the wishlist.
      this.textContent = "♥"; // Show a filled heart for a saved item.
    } else { // Use this path when the previous condition was false.
      data.savedItems.splice(savedIndex, 1); // Remove this product ID from the wishlist.
      this.textContent = "♡"; // Show an empty heart after removing the item.
    } // End this code block.

    await saveData(); // Save the updated wishlist.
    updateListings(); // Reapply the active search and filters.
  }); // Finish this event handler and its listener.

  card.querySelector(".details").addEventListener("click", function () { // Run this code when the student clicks this control.
    showItemDetails(card); // Open this product details.
  }); // Finish this event handler and its listener.
} // End this code block.

// Fill and open the item details window.
function showItemDetails(card) { // Helper: open the details dialog for one product.
  byId("detail-image").src = card.dataset.image; // Set the image URL that the browser should show.
  byId("detail-image").alt = card.dataset.title; // Describe the product photo for screen readers.
  byId("detail-title").textContent = card.dataset.title; // Set the text shown to the student.
  byId("detail-price").textContent = formatPrice(card.dataset.price); // Set the text shown to the student.
  byId("detail-description").textContent = card.dataset.description; // Set the text shown to the student.
  byId("detail-seller").textContent = card.dataset.seller + " · " + card.dataset.place; // Set the text shown to the student.
  byId("record-purchase").dataset.itemId = card.dataset.id; // Remember which item the purchase button refers to.
  byId("ask-about-item").href = "inquiries.html?item=" + encodeURIComponent(card.dataset.id); // Link the inquiry button to this selected item.
  byId("details-modal").hidden = false; // Display the details popup.
} // End this code block.

// Make a new listing card from the information in the JSON file.
function addListingCard(listing) { // Helper: build a product card from saved listing data.
  var card = document.createElement("article"); // Create an HTML element for the product card being created or updated.
  card.className = "listing user-listing"; // Give this element the CSS class that styles it.
  card.dataset.id = listing.id; // Store the unique listing ID on the card.
  card.dataset.title = listing.title; // Store the title so search can find this card.
  card.dataset.category = listing.category; // Store the category so category filters can find this card.
  card.dataset.price = listing.price; // Store the price so the card can be sorted.
  card.dataset.date = listing.date; // Store the date/order value so the card can be sorted.
  card.dataset.seller = listing.seller; // Store the seller name for item details and inquiries.
  card.dataset.place = listing.place; // Store the campus meetup spot for item details.
  card.dataset.description = listing.description; // Store the item description for the details dialog.
  card.dataset.image = listing.image; // Store the photo path for the card and details dialog.

  var image = document.createElement("img"); // Create the product photo element for this card.
  image.src = listing.image; // Set the image URL that the browser should show.
  image.alt = listing.title; // Use the item title as alternative text for the product photo.

  var info = document.createElement("div"); // Create an HTML element for the text area inside the product card.
  info.className = "listing-info"; // Give this element the CSS class that styles it.

  var saveButton = document.createElement("button"); // Create an HTML element for the wishlist heart button.
  saveButton.className = "save"; // Give this element the CSS class that styles it.
  saveButton.type = "button"; // Keep this control from submitting a form.
  saveButton.textContent = data.savedItems.indexOf(listing.id) === -1 ? "♡" : "♥"; // Show a filled heart when this listing is saved.
  saveButton.setAttribute("aria-label", "Save item"); // Give this control an accessible label.

  var title = document.createElement("button"); // Create an HTML element for the product title element.
  title.className = "title details"; // Give this element the CSS class that styles it.
  title.type = "button"; // Make the title a button that opens product details.
  title.textContent = listing.title; // Set the text shown to the student.

  var price = document.createElement("p"); // Create an HTML element for the formatted price element.
  price.className = "price"; // Give this element the CSS class that styles it.
  price.textContent = formatPrice(listing.price); // Set the text shown to the student.

  var seller = document.createElement("p"); // Create an HTML element for the seller detail element.
  seller.className = "seller"; // Give this element the CSS class that styles it.
  seller.textContent = listing.seller + " · " + listing.place; // Set the text shown to the student.

  info.appendChild(saveButton); // Add this new element inside its parent on the page.
  info.appendChild(title); // Add this new element inside its parent on the page.
  info.appendChild(price); // Add this new element inside its parent on the page.
  info.appendChild(seller); // Add this new element inside its parent on the page.
  card.appendChild(image); // Add this new element inside its parent on the page.
  card.appendChild(info); // Add this new element inside its parent on the page.
  byId("listing-grid").appendChild(card); // Add this new element inside its parent on the page.
  connectListing(card); // Enable this card wishlist and details buttons.
} // End this code block.

// Add saved listings from the JSON data to the marketplace.
function renderSavedListings() { // Helper: show sample and student-created listings.
  var grid = byId("listing-grid"); // Create a variable for the marketplace card container.
  if (!grid) return; // Stop when this page has no product grid.

  var oldUserListings = grid.querySelectorAll(".user-listing"); // Create a variable for the student-created cards already on screen.
  for (var j = 0; j < oldUserListings.length; j++) { // Repeat this block once for every old student-created card.
    oldUserListings[j].remove(); // Remove this old card from the page.
  } // End this code block.

  // Sample items are written directly in index.html for easy editing.
  var sampleCards = grid.querySelectorAll(".listing"); // Create a variable for the sample listing cards in the HTML.
  for (var i = 0; i < sampleCards.length; i++) { // Repeat this block once for every sample card.
    if (!sampleCards[i].dataset.id) { // Give the sample card an ID only when it does not already have one.
      sampleCards[i].dataset.id = "sample-" + i; // Give the example card a stable ID for the wishlist.
    } // End this code block.
    sampleCards[i].querySelector(".save").textContent = // Find this card's wishlist button.
      data.savedItems.indexOf(sampleCards[i].dataset.id) === -1 ? "♡" : "♥"; // Show a filled heart if the item is already saved.
    connectListing(sampleCards[i]); // Enable this card wishlist and details buttons.
  } // End this code block.

  for (var k = 0; k < data.listings.length; k++) { // Repeat this block once for every student-created listing.
    addListingCard(data.listings[k]); // Add a card for this student-created listing.
  } // End this code block.

  updateListings(); // Reapply the active search and filters.
  fillInquiryChoices(); // Refresh the item choices in the inquiry form.
} // End this code block.

// Search, category buttons, and saved items share these filters. Change the matching controls in index.html or buy.html.
function updateListings() { // Helper: apply filters and update the wishlist count.
  var cards = document.querySelectorAll(".listing"); // Find every page element needed for the product cards on the page.
  var search = byId("search-input").value.toLowerCase(); // Create a variable for the lowercase search words.
  var shown = 0; // Create a variable for the number of matching cards.

  for (var i = 0; i < cards.length; i++) { // Repeat this block once for every product card.
    var matchesSearch = cards[i].dataset.title.toLowerCase().includes(search); // Create a variable for whether the title matches the search.
    var matchesCategory = selectedCategory === "All items" || cards[i].dataset.category === selectedCategory; // Create a variable for whether the listing matches the chosen category.
    var matchesSaved = !showingSaved || data.savedItems.indexOf(cards[i].dataset.id) !== -1; // Create a variable for whether the listing is in the wishlist.
    cards[i].hidden = !(matchesSearch && matchesCategory && matchesSaved); // Hide cards that fail any active filter.
    if (!cards[i].hidden) shown++; // Count this card when it is visible after filtering.
  } // End this code block.

  var emptyMessage = byId("empty-message"); // Create a variable for the no-results message.
  if (emptyMessage) emptyMessage.hidden = shown > 0; // Update the empty-state message when that element exists.

  var savedCount = byId("saved-count"); // Find the element that displays the wishlist count.
  if (savedCount) savedCount.textContent = data.savedItems.length; // Update the wishlist count when its element exists.
} // End this code block.

// Sort the cards using the selected option in index.html or buy.html.
function sortListings() { // Helper: order product cards by date or price.
  var cards = document.querySelectorAll(".listing"); // Find every page element needed for the product cards on the page.
  var list = []; // Make a temporary list that can be reordered.
  for (var i = 0; i < cards.length; i++) list.push(cards[i]); // Repeat this block once for every product card.

  var order = byId("sort").value; // Create a variable for the selected sort option.
  for (var j = 0; j < list.length; j++) { // Repeat this block once for each item in the list.
    for (var k = 0; k < list.length - 1; k++) { // Repeat this block once for each item in the list.
      var first; // Create a variable for the first value being compared.
      var second; // Create a variable for the next value being compared.
      if (order === "low") { // Compare prices from lowest to highest.
        first = Number(list[k].dataset.price); // Read the current card's price for comparison.
        second = Number(list[k + 1].dataset.price); // Read the next card's price for comparison.
      } else if (order === "high") { // Compare prices from highest to lowest.
        first = Number(list[k + 1].dataset.price); // Use the next card's price as the first comparison value.
        second = Number(list[k].dataset.price); // Use the current card's price as the second comparison value.
      } else { // Use this path when the previous condition was false.
        first = Number(list[k].dataset.date); // Use the current card's date for newest-first sorting.
        second = Number(list[k + 1].dataset.date); // Compare it with the next card's date.
      } // End this code block.
      if (first > second) { // Swap these cards because they are in the wrong order.
        var oldCard = list[k]; // Keep this card while switching the two cards' positions.
        list[k] = list[k + 1]; // Move the next card into the current position.
        list[k + 1] = oldCard; // Move the current card into the next position.
      } // End this code block.
    } // End this code block.
  } // End this code block.

  for (var m = 0; m < list.length; m++) { // Repeat this block once for each item in the list.
    byId("listing-grid").appendChild(list[m]); // Add this new element inside its parent on the page.
  } // End this code block.
  updateListings(); // Reapply the active search and filters.
} // End this code block.

// Return the signed-in student's email, or an empty string.
function signedInEmail() { // Helper: get the email of the current demo profile.
  return currentUser ? currentUser.email.toLowerCase() : ""; // Return the profile email, or an empty string when no one is signed in.
} // End this code block.

// Find an item on any page, including pages without marketplace cards.
function findListing(itemId) { // Helper: find a sample or student-created listing by its ID.
  for (var i = 0; i < data.listings.length; i++) { // Repeat this block once for every student-created listing.
    if (data.listings[i].id === itemId) return data.listings[i]; // Return the student listing when its ID matches.
  } // End this code block.

  if (itemId.indexOf("sample-") === 0) { // Check whether this ID belongs to an example listing.
    var sampleIndex = Number(itemId.replace("sample-", "")); // Create a variable for the position of this sample listing.
    if (sampleIndex >= 0 && sampleIndex < sampleTitles.length) { // Use the sample item only when its index is inside the sample list.
      return { // Return this value to the code that called the helper.
        id: itemId, // Store the unique item ID.
        title: sampleTitles[sampleIndex], // Store the product title.
        seller: sampleSellers[sampleIndex] // Store the seller name.
      }; // End this code block.
    } // End this code block.
  } // End this code block.
  return null; // Return no listing when this ID does not match an item.
} // End this code block.

// Show only purchases made by the current demo profile.
function renderHistory() { // Helper: show demo purchases for the current profile.
  var list = byId("history-list"); // Find the element that will hold purchase records.
  if (!list) return; // Skip rendering when this page has no matching list.
  list.innerHTML = ""; // Replace the content inside this page element.

  var count = 0; // Create a variable for the number of matching records.
  for (var i = 0; i < data.purchases.length; i++) { // Repeat this block once for every saved purchase.
    var purchase = data.purchases[i]; // Create a variable for the purchase currently being displayed.
    if (purchase.email.toLowerCase() !== signedInEmail()) continue; // Skip purchase records for other demo profiles.

    var row = document.createElement("article"); // Create one card for this purchase-history entry.
    row.className = "item-row"; // Give this element the CSS class that styles it.
    row.textContent = purchase.title + " · " + formatPrice(purchase.price) + " · " + purchase.date; // Set the text shown to the student.
    list.appendChild(row); // Add this new element inside its parent on the page.
    count++; // Add one to the number of matching records.
  } // End this code block.

  byId("history-empty").hidden = count > 0; // Hide the empty message when at least one purchase is shown.
} // End this code block.

// Add marketplace items to the inquiry form's dropdown.
function fillInquiryChoices() { // Helper: fill the item menu on the inquiry form.
  var select = byId("inquiry-listing"); // Create a variable for the item dropdown in the inquiry form.
  if (!select) return; // Skip filling choices when this page has no item dropdown.
  select.innerHTML = ""; // Replace the content inside this page element.

  for (var i = 0; i < sampleTitles.length; i++) { // Repeat this block once for every sample item.
    var option = document.createElement("option"); // Create an HTML element for one example choice in the inquiry menu.
    option.value = "sample-" + i; // Store the example listing ID in this menu choice.
    option.textContent = sampleTitles[i]; // Set the text shown to the student.
    select.appendChild(option); // Add this new element inside its parent on the page.
  } // End this code block.

  for (var j = 0; j < data.listings.length; j++) { // Repeat this block once for every student-created listing.
    var savedOption = document.createElement("option"); // Create an HTML element for one student-created choice in the inquiry menu.
    savedOption.value = data.listings[j].id; // Store this student listing ID in the menu choice.
    savedOption.textContent = data.listings[j].title; // Set the text shown to the student.
    select.appendChild(savedOption); // Add this new element inside its parent on the page.
  } // End this code block.

  var wantedItem = new URLSearchParams(location.search).get("item"); // Read the page link to get the item ID in the page URL.
  if (wantedItem) select.value = wantedItem; // Preselect the item named in the inquiry-page link.
} // End this code block.

// Show inquiries belonging to the signed-in demo profile.
function renderInquiries() { // Helper: show messages for the current profile.
  var list = byId("inquiry-list"); // Find the element that will hold inquiry records.
  if (!list) return; // Skip rendering when this page has no matching list.
  list.innerHTML = ""; // Replace the content inside this page element.

  var count = 0; // Create a variable for the number of matching records.
  for (var i = 0; i < data.inquiries.length; i++) { // Repeat this block once for every saved inquiry.
    var inquiry = data.inquiries[i]; // Create a variable for the inquiry currently being displayed.
    if (inquiry.email.toLowerCase() !== signedInEmail()) continue; // Skip inquiry records for other demo profiles.

    var row = document.createElement("article"); // Create an HTML element for one saved history or inquiry card.
    row.className = "item-row"; // Give this element the CSS class that styles it.
    row.innerHTML = "<strong>" + escapeText(inquiry.title) + "</strong><p>" + // Start the inquiry card with the escaped item title.
      escapeText(inquiry.message) + "</p><p>Status: " + escapeText(inquiry.status) + " · " + // Add the escaped message and demo status.
      escapeText(inquiry.date) + "</p>"; // Finish the card with the escaped date.
    list.appendChild(row); // Add this new element inside its parent on the page.
    count++; // Add one to the number of matching records.
  } // End this code block.
  byId("inquiry-empty").hidden = count > 0; // Hide the empty message when at least one inquiry is shown.
} // End this code block.

// Escape text before displaying it inside inquiry markup.
function escapeText(text) { // Helper: make user-entered text safe to show on the page.
  var safe = document.createElement("span"); // Create a temporary element for safely displaying user text.
  safe.textContent = text; // Set the text shown to the student.
  return safe.innerHTML; // Return this value to the code that called the helper.
} // End this code block.

// Save the current profile on this device. This is a demo, not secure login.
function setUpLogin() { // Helper: connect the demo profile form.
  var form = byId("login-form"); // Create a variable for the form handled on this page.
  if (!form) return; // Skip this form setup when the current page has no matching form.

  form.addEventListener("submit", async function (event) { // Run this code when the form is submitted.
    event.preventDefault(); // Stop the browser from reloading the page for this action.
    currentUser = { // Build the demo profile from the name and email fields.
      name: form.elements.name.value.trim(), // Store the student name.
      email: form.elements.email.value.trim().toLowerCase() // Store the student email.
    }; // End this code block.
    localStorage.setItem("campusCartUser", JSON.stringify(currentUser)); // Save this value in browser storage.
    var existingUser = -1; // Start with no matching profile; the loop will search the saved users.
    for (var i = 0; i < data.users.length; i++) { // Repeat this block once for every demo user.
      if (data.users[i].email.toLowerCase() === currentUser.email) { // Find a saved profile with the same email.
        existingUser = i; // Remember the saved profile that matches this email.
        break; // Stop searching because the matching record was found.
      } // End this code block.
    } // End this code block.
    if (existingUser === -1) data.users.push(currentUser); // Add a new profile when this email is not saved yet.
    else data.users[existingUser] = currentUser; // Update the matching profile with the latest name.
    await saveData(); // Save the new demo profile and marketplace data.
    location.href = "index.html"; // Open the named page in the browser.
  }); // Finish this event handler and its listener.
} // End this code block.

// Record a demo purchase in the user's history. This does not take payment.
function setUpPurchaseButton() { // Helper: connect the demo purchase button.
  var button = byId("record-purchase"); // Create a variable for the button connected to its action.
  if (!button) return; // Skip this setup when the current page has no purchase button.

  button.addEventListener("click", async function () { // Run this code when the student clicks this control.
    if (!currentUser) { // Ask the student to sign in before recording this action.
      location.href = "login.html"; // Open the named page in the browser.
      return; // Stop here because this page does not need more work.
    } // End this code block.

    var card = document.querySelector('[data-id="' + button.dataset.itemId + '"]'); // Find the card for the item being recorded as purchased.
    data.purchases.push({ // Add this demo record to the purchase history.
      email: currentUser.email, // Store the student email.
      title: card.dataset.title, // Store the product title.
      price: card.dataset.price, // Store the product price.
      date: new Date().toLocaleDateString("en-IN") // Record the date this demo purchase was added.
    }); // Finish this event handler and its listener.
    await saveData(); // Save the new demo purchase to browser or folder storage.
    byId("details-modal").hidden = true; // Close the item details popup after recording the purchase.
    alert("Demo purchase added to your history. No payment was made."); // Show a short confirmation message to the student.
  }); // Finish this event handler and its listener.
} // End this code block.

// Save a message from a student to a seller.
function setUpInquiryForm() { // Helper: connect the seller inquiry form.
  var form = byId("inquiry-form"); // Create a variable for the form handled on this page.
  if (!form) return; // Skip this form setup when the current page has no matching form.

  form.addEventListener("submit", async function (event) { // Run this code when the form is submitted.
    event.preventDefault(); // Stop the browser from reloading the page for this action.
    if (!currentUser) { // Ask the student to sign in before recording this action.
      location.href = "login.html"; // Open the named page in the browser.
      return; // Stop here because this page does not need more work.
    } // End this code block.

    var itemId = form.elements.listing.value; // Create a variable for the selected item ID.
    var listing = findListing(itemId); // Get the listing selected in the inquiry dropdown.
    if (!listing) { // Stop or show a message when the required value is missing.
      showStorageMessage("That item could not be found. Choose an item from the list."); // Show the current save or error status.
      return; // Stop here because this page does not need more work.
    } // End this code block.
    data.inquiries.push({ // Add this demo message to the inquiry list.
      email: currentUser.email, // Store the student email.
      title: listing.title, // Store the product title.
      seller: listing.seller, // Store the seller name.
      message: form.elements.message.value.trim(), // Store the inquiry text.
      status: "Sent in demo", // Store the demo-only inquiry status.
      date: new Date().toLocaleDateString("en-IN") // Record the date this demo inquiry was added.
    }); // Finish this event handler and its listener.
    await saveData(); // Save the inquiry so it appears in the student's inquiry list.
    form.reset(); // Clear the form after its information is saved.
    renderInquiries(); // Refresh the inquiry list.
  }); // Finish this event handler and its listener.
} // End this code block.

// Connect the buttons that open and close the item-details window.
function setUpModals() { // Helper: connect buttons that open and close dialogs.
  var closeButtons = document.querySelectorAll("[data-close]"); // Find every page element needed for the dialog close buttons.
  for (var i = 0; i < closeButtons.length; i++) { // Repeat this block once for every close button.
    closeButtons[i].addEventListener("click", function () { // Run this code when the student clicks this control.
      byId(this.dataset.close).hidden = true; // Hide the popup whose ID is stored on this close button.
    }); // Finish this event handler and its listener.
  } // End this code block.

  var modals = document.querySelectorAll(".modal"); // Find every page element needed for the dialogs on this page.
  for (var j = 0; j < modals.length; j++) { // Repeat this block once for every dialog.
    modals[j].addEventListener("click", function (event) { // Run this code when the student clicks this control.
      if (event.target === this) this.hidden = true; // Close the dialog only when its background is clicked.
    }); // Finish this event handler and its listener.
  } // End this code block.
} // End this code block.

// Post a new item and save its photo in the images folder when possible. The matching form is in sell.html.
function setUpSellForm() { // Helper: connect the photo preview and new listing form.
  var form = byId("sell-form"); // Create a variable for the form handled on this page.
  if (!form) return; // Skip this form setup when the current page has no matching form.

  // The "photo" name here must match name="photo" on the file input in sell.html.
  form.elements.photo.addEventListener("change", function () { // Preview the photo whenever a different file is selected.
    var file = this.files[0]; // Get the photo file selected in the sell form.
    if (!file) return; // Stop when the student has not selected a photo.

    if (file.size > 2000000) { // Reject photos larger than 2 MB.
      showStorageMessage("Choose an image smaller than 2 MB."); // Show the current save or error status.
      this.value = ""; // Clear this input after rejecting the oversized photo.
      return; // Stop here because this page does not need more work.
    } // End this code block.

    var reader = new FileReader(); // Create a browser reader to show the selected photo preview.
    reader.onload = function () { // Run this function after the browser finishes reading the photo.
      uploadedImage = reader.result; // Keep the photo data ready for the new listing.
      byId("photo-preview").src = uploadedImage; // Set the image URL that the browser should show.
      byId("photo-preview").hidden = false; // Reveal the photo preview after it loads.
    }; // End this code block.
    reader.readAsDataURL(file); // Read the selected photo so it can be previewed.
  }); // Finish this event handler and its listener.

  // This submit handler reads the sell.html fields, creates a listing, then saves it.
  form.addEventListener("submit", async function (event) { // Run this code when the form is submitted.
    event.preventDefault(); // Stop the browser from reloading the page for this action.
    if (!form.reportValidity()) return; // Stop if the browser reports a required form field is invalid.

    var user = currentUser || { name: form.elements.seller.value.trim(), email: "" }; // Use the signed-in profile, or the name entered as seller.
    var id = Date.now().toString(); // Create a unique listing ID using the current time.
    var file = form.elements.photo.files[0]; // Get the photo file selected in the sell form.
    var image = uploadedImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80"; // Use the uploaded photo, or a sample photo when none was selected.

    if (file && storageFolder) { // Copy the photo into the folder when both a photo and folder are available.
      try { // Try this operation so a browser or file error can be handled.
        image = await saveImageFile(file, id); // Save the photo and keep its new folder path.
      } catch (error) { // Handle the failed operation and show a useful status when needed.
        showStorageMessage("Image could not be saved to the images folder."); // Show the current save or error status.
        return; // Stop here because this page does not need more work.
      } // End this code block.
    } // End this code block.

    var listing = { // Create a variable for the product details being saved or shown.
      id: id, // Store the unique item ID.
      title: form.elements.title.value.trim(), // Store the product title.
      price: Number(form.elements.price.value), // Store the product price.
      category: form.elements.category.value, // Store the selected category.
      seller: user.name, // Store the seller name.
      place: form.elements.place.value.trim(), // Store the campus meetup place.
      description: form.elements.description.value.trim(), // Store the item description.
      image: image, // Store the photo preview or saved image path.
      date: 0 // Give a newly posted listing the first (newest) position in the demo sort order.
    }; // End this code block.

    data.listings.push(listing); // Add the new listing to the marketplace data.
    await saveData(); // Save the new listing and its photo reference.
    form.reset(); // Clear the form after its information is saved.
    uploadedImage = ""; // Keep the photo preview ready for the new listing.
    byId("photo-preview").hidden = true; // Hide the old photo preview after the form is cleared.
    showStorageMessage("Your listing is posted. Browse it on the buying page."); // Confirm the listing and point the seller to the buying page.
    renderSavedListings(); // Refresh the marketplace cards.
  }); // Finish this event handler and its listener.
} // End this code block.

// Let each page use the same JavaScript file; data-page on each HTML body selects page-specific setup.
function startPage() { // Helper: load data and connect this page controls.
  readBrowserData(); // Load this browser saved demo data.

  var loginLink = byId("login-link"); // Create a variable for the login or logout navigation link.
  if (loginLink && currentUser) { // Show the logout link only when a demo profile is signed in.
    loginLink.textContent = currentUser.name + " (log out)"; // Show the student name and a logout label in the navigation.
    loginLink.href = "#"; // Prevent this logout control from navigating to another page.
    loginLink.addEventListener("click", function (event) { // Log the demo profile out when this link is clicked.
      event.preventDefault(); // Stop the browser from reloading the page for this action.
      localStorage.removeItem("campusCartUser"); // Remove this saved value from browser storage.
      location.href = "index.html"; // Open the named page in the browser.
    }); // Finish this event handler and its listener.
  } // End this code block.

  var folderButton = byId("storage-button"); // Create a variable for the choose-folder button.
  if (folderButton) folderButton.addEventListener("click", chooseDataFolder); // Connect folder selection only on pages that show its button.

  if (document.body.dataset.page === "home" || document.body.dataset.page === "buy") { // Set up browsing tools on the home and buying pages.
    renderSavedListings(); // Refresh the marketplace cards.
    byId("search-input").addEventListener("input", updateListings); // Update the results whenever the student types.
    byId("search-form").addEventListener("submit", function (event) { // Run this code when the form is submitted.
      event.preventDefault(); // Stop the browser from reloading the page for this action.
      updateListings(); // Reapply the active search and filters.
    }); // Finish this event handler and its listener.
    byId("sort").addEventListener("change", sortListings); // Sort the cards whenever the student changes this menu.
    var savedButton = byId("saved-button"); // Find the wishlist filter when this page includes it.
    if (savedButton) savedButton.addEventListener("click", function () { // Connect wishlist filtering only on pages that show it.
      showingSaved = !showingSaved; // Turn the wishlist-only filter on or off.
      updateListings(); // Reapply the active search and filters.
    }); // Finish this event handler and its listener.

    var categoryButtons = document.querySelectorAll(".category-buttons [data-category]"); // Find every page element needed for the category filter buttons.
    for (var i = 0; i < categoryButtons.length; i++) { // Repeat this block once for every category button.
      categoryButtons[i].addEventListener("click", function () { // Run this code when the student clicks this control.
        selectedCategory = this.dataset.category; // Remember the category button the student selected.
        for (var j = 0; j < categoryButtons.length; j++) { // Repeat this block once for every category button.
          categoryButtons[j].classList.remove("active"); // Clear the active style from the other categories.
        } // End this code block.
        this.classList.add("active"); // Mark the chosen category button as active.
        updateListings(); // Reapply the active search and filters.
      }); // Finish this event handler and its listener.
    } // End this code block.
  } // End this code block.

  fillInquiryChoices(); // Refresh the item choices in the inquiry form.
  setUpLogin(); // Connect the demo login form.
  setUpPurchaseButton(); // Connect the demo purchase action.
  setUpInquiryForm(); // Connect the sample seller inquiry form.
  setUpModals(); // Connect the dialog open and close buttons.
  setUpSellForm(); // Connect the listing form and photo preview.
  renderHistory(); // Refresh the purchase history.
  renderInquiries(); // Refresh the inquiry list.
} // End this code block.

startPage(); // Initialize this page and its controls.
