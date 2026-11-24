# Campus Cart

A front-end-only RV University marketplace demo made with HTML, CSS, and plain JavaScript. It does not use React, Bootstrap, or other frameworks. Open `index.html`, `login.html`, `history.html`, and `inquiries.html` from a local web server such as VS Code Live Server.

## Saving data and images

On each page, choose the project folder (the folder containing `index.html`). The app saves listing, purchase-history, and inquiry data in `marketplace.json`, and uploaded item photos in an `images` folder. Choose the same folder again after opening another page. Folder saving works in browsers that support the File System Access API, such as Chrome and Edge, when served from localhost. Other browsers keep data only in that browser's local storage.

## Demo account features

The login page stores a name and email in this browser to separate each student's purchase history and inquiries. There is no password, account verification, server, or secure authentication. "Record as purchased" only adds a demo history entry; it does not take payment.

## Changing the site

- Sample item cards are in `index.html`. The matching item names are listed in `sampleTitles` in `src/app.js` for the inquiry dropdown.
- Main page content and form fields are in `index.html`; the other pages are `login.html`, `history.html`, and `inquiries.html`.
- Shared colors and layouts are in `src/style.css`.
- Page behavior and data saving are in `src/app.js`.

The data file is JSON so it can be edited in a text editor. It is not an Excel workbook.
