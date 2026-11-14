# Campus Cart

A responsive, front-end-only student marketplace built mostly in `index.html`: page markup and custom CSS are together, with Bootstrap as the only external stylesheet. A small vanilla JavaScript file handles search, filters, saved items, seller contact, image previews, and adding listings. Open `index.html` directly or serve the folder with any static web server.

Students can browse sample listings priced in Indian rupees (INR), search and filter by category, save favorites, contact sellers through their email app, and post a listing with an optional image.

Listings and saved items are held in page memory only. They are not sent to a server and reset when the page is refreshed or closed. Seller contact opens the visitor's default email app. No account, payment, or backend service is included.

## Making common changes

- **Change a sample item:** In `index.html`, find the course listing comment, then edit that card's title, `data-price`, `data-original-price`, description, seller, campus, and image together. The visible prices in the card should match the two price data values.
- **Add a sample item:** Copy one complete `.listing-card` block in `index.html`. Set its category, item details, prices, image, and a unique `data-date`. A smaller `data-date` number appears nearer the top when sorting by newest.
- **Change a category:** Update the category buttons and the category choices in the sell form in `index.html`. The spelling must match in both places because the JavaScript uses it to filter listings.
- **Change colors or layout:** The custom CSS is in the `<style>` section of `index.html`. Comments divide it into page sections; the color variables are near the top.
- **Change page interactions:** `src/main.js` has comments for search, sorting, saved items, listing details, photo previews, and the sell form. It only updates the current page; there is no server or permanent storage.

Keep the sample item details in `data-*` attributes and the visible card together. The details dialog and filters read those attributes.
