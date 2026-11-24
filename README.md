# Campus Cart

A front-end-only RV University marketplace demo made with HTML, CSS, and plain JavaScript. It does not use React, Bootstrap, or other frameworks. Open `index.html`, `buy.html`, `sell.html`, `login.html`, `history.html`, and `inquiries.html` from a local web server such as VS Code Live Server.

## Saving data and images

The app saves listings, purchase-history records, inquiries, wishlist items, and uploaded photos in this browser's local storage. The data is not shared with other browsers or devices, and clearing browser data may remove it. Uploaded photos also use browser storage space.

## Demo account features

The login page stores a name and email in this browser to separate each student's purchase history and inquiries. There is no password, account verification, server, or secure authentication. "Record as purchased" only adds a demo history entry; it does not take payment.

## Changing the site

- Sample item cards are in `index.html` and `buy.html`. The matching item names are listed in `sampleTitles` in `src/app.js` for the inquiry dropdown.
- The home page is `index.html`; buying and selling have their own pages in `buy.html` and `sell.html`. The other pages are `login.html`, `history.html`, and `inquiries.html`.
- Shared colors and layouts are in `src/style.css`.
- Page behavior and data saving are in `src/app.js`.

The data file is JSON so it can be edited in a text editor. It is not an Excel workbook.

## JavaScript for beginners

The app mostly uses `var`, named functions, `if` statements, `for` loops, and click or submit events. To search, filter, and sort products, see `updateListings()` and `sortListings()` in `src/app.js`.

The photo preview uses the browser's `FileReader` feature. The rest of the app uses basic page elements, functions, loops, and browser storage.
