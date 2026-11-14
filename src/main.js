const h = React.createElement;
const { useMemo, useRef, useState } = React;

const initialListings = [
  {
    id: 1, title: "Calculus: Early Transcendentals", category: "Textbooks",
    price: 42, originalPrice: 89, condition: "Like new", seller: "Maya R.",
    initials: "MR", campus: "North Campus", posted: "2 hours ago", accent: "mint",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    description: "8th edition with a few pencil notes in the margins. All pages are clean and the access code is unused. Great for MATH 221.",
  },
  {
    id: 2, title: "TI-84 Plus CE Graphing Calculator", category: "Calculators",
    price: 68, originalPrice: 119, condition: "Good", seller: "Jordan K.",
    initials: "JK", campus: "West Quad", posted: "5 hours ago", accent: "lavender",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85",
    description: "Works perfectly and comes with the charging cable. Just passed my last math class, so it's ready for a new owner.",
  },
  {
    id: 3, title: "Organic Chemistry Lab Kit", category: "Lab equipment",
    price: 35, originalPrice: 74, condition: "Like new", seller: "Alex P.",
    initials: "AP", campus: "Science Hall", posted: "Yesterday", accent: "peach",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85",
    description: "Complete lab kit, used for one semester. Includes goggles, test tubes, clamps, and everything on the course list.",
  },
  {
    id: 4, title: "Psychology 101 — OpenStax Edition", category: "Textbooks",
    price: 18, originalPrice: 52, condition: "Good", seller: "Sam T.",
    initials: "ST", campus: "East Village", posted: "Yesterday", accent: "sky",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=85",
    description: "A solid copy with some highlighting in the first few chapters. No missing or damaged pages.",
  },
  {
    id: 5, title: "Adjustable Desk Lamp", category: "Dorm & living",
    price: 22, originalPrice: 39, condition: "Like new", seller: "Riley C.",
    initials: "RC", campus: "South Hall", posted: "2 days ago", accent: "yellow",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    description: "Warm and cool light settings, fully adjustable neck, and a USB charging port. Perfect for a dorm desk.",
  },
  {
    id: 6, title: "Intro to Microeconomics Bundle", category: "Textbooks",
    price: 30, originalPrice: 76, condition: "Good", seller: "Devon L.",
    initials: "DL", campus: "North Campus", posted: "3 days ago", accent: "pink",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85",
    description: "Textbook plus a set of printed study notes. Kept in great shape and ready for ECON 101.",
  },
  {
    id: 7, title: "Physics Lab Goggles & Coat", category: "Lab equipment",
    price: 26, originalPrice: 48, condition: "Like new", seller: "Taylor N.",
    initials: "TN", campus: "Science Hall", posted: "4 days ago", accent: "mint",
    image: "https://images.unsplash.com/photo-1581093458791-9d42e3c2a8b0?auto=format&fit=crop&w=900&q=85",
    description: "Small/medium lab coat and anti-fog goggles. Only worn a couple of times, freshly washed.",
  },
  {
    id: 8, title: "Mini Fridge — 3.2 cu. ft.", category: "Dorm & living",
    price: 85, originalPrice: 139, condition: "Good", seller: "Chris W.",
    initials: "CW", campus: "West Quad", posted: "1 week ago", accent: "lavender",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=85",
    description: "Quiet, clean, and gets cold fast. Fits right under a standard dorm desk. Pickup near West Quad.",
  },
];

const categories = [
  { name: "All items", icon: "✳", count: "120+" },
  { name: "Textbooks", icon: "▤", count: "48" },
  { name: "Calculators", icon: "⌗", count: "16" },
  { name: "Lab equipment", icon: "♧", count: "23" },
  { name: "Dorm & living", icon: "⌂", count: "33" },
];

const iconShapes = {
  search: [h("circle", { cx: 11, cy: 11, r: 7 }), h("path", { d: "m20 20-4-4" })],
  heart: h("path", { d: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" }),
  arrow: [h("path", { d: "M7 17 17 7" }), h("path", { d: "M7 7h10v10" })],
  plus: [h("path", { d: "M12 5v14" }), h("path", { d: "M5 12h14" })],
  close: [h("path", { d: "m18 6-12 12" }), h("path", { d: "m6 6 12 12" })],
  pin: [h("path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }), h("circle", { cx: 12, cy: 10, r: 2.5 })],
  message: h("path", { d: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" }),
  camera: [h("path", { d: "M14 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-2Z" }), h("circle", { cx: 12, cy: 13, r: 3 })],
  chevron: h("path", { d: "m9 18 6-6-6-6" }),
};

function Icon({ name, size = 20 }) {
  return h("svg", {
    "aria-hidden": "true", width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.8,
    strokeLinecap: "round", strokeLinejoin: "round",
  }, iconShapes[name]);
}

function Brand({ footer = false }) {
  return h("a", { className: `brand${footer ? " footer-brand" : ""}`, href: "#home", "aria-label": "Campus Cart home" },
    h("span", { className: "brand-mark" }, "c", h("span", null, ".")),
    h("span", null, "campus", h("span", { className: "brand-light" }, "cart")));
}

function App() {
  const [listings, setListings] = useState(initialListings);
  const [activeCategory, setActiveCategory] = useState("All items");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest first");
  const [wishlist, setWishlist] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [toast, setToast] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [formError, setFormError] = useState("");
  const fileInput = useRef(null);

  const visibleListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = listings.filter((item) =>
      (activeCategory === "All items" || item.category === activeCategory)
      && (!query || `${item.title} ${item.category} ${item.condition} ${item.campus}`.toLowerCase().includes(query))
      && (!savedOnly || wishlist.includes(item.id)));
    if (sort === "Price: low to high") return result.sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") return result.sort((a, b) => b.price - a.price);
    return result.sort((a, b) => b.id - a.id);
  }, [activeCategory, listings, savedOnly, search, sort, wishlist]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const toggleWishlist = (id) => setWishlist((current) =>
    current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]);
  const scrollListings = () => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });

  const handleSubmitListing = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title").toString().trim();
    const price = Number(data.get("price"));
    const seller = data.get("seller").toString().trim();
    const campus = data.get("campus").toString().trim();
    const description = data.get("description").toString().trim();
    if (!title || !price || price < 1 || !seller || !campus || !description) {
      setFormError("Add a title, valid price, seller name, campus, and description.");
      return;
    }
    setListings((current) => [{
      id: Date.now(), title, price, seller, campus, description,
      category: data.get("category").toString(),
      condition: data.get("condition").toString(),
      initials: seller.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      posted: "Just now", image: photoPreview || initialListings[5].image, accent: "mint",
    }, ...current]);
    setActiveCategory("All items");
    setSavedOnly(false);
    setSearch("");
    setShowSell(false);
    setPhotoPreview("");
    setFormError("");
    notify("Your listing is live on this page!");
  };

  const closeSell = () => {
    setShowSell(false);
    setPhotoPreview("");
    setFormError("");
  };

  function listingCard(item) {
    const saved = wishlist.includes(item.id);
    return h("div", { className: "col-12 col-sm-6 col-lg-3", key: item.id },
      h("article", { className: "listing-card" },
        h("button", { className: "listing-image-button", onClick: () => setSelectedItem(item), "aria-label": `View ${item.title}` },
          h("div", { className: `listing-image ${item.accent}` },
            h("img", { src: item.image, alt: "", loading: "lazy" }),
            h("span", { className: "condition-tag" }, item.condition))),
        h("button", {
          className: `save-button${saved ? " saved" : ""}`, onClick: () => toggleWishlist(item.id),
          "aria-label": `${saved ? "Remove" : "Save"} ${item.title}${saved ? " from saved items" : ""}`,
          "aria-pressed": saved,
        }, h(Icon, { name: "heart", size: 19 })),
        h("div", { className: "listing-body" },
          h("div", { className: "listing-category" }, item.category, h("span", null, "·"), item.posted),
          h("button", { className: "listing-title", onClick: () => setSelectedItem(item) }, item.title),
          h("div", { className: "price-row" },
            h("strong", null, `$${item.price}`),
            item.originalPrice && h("del", null, `$${item.originalPrice}`)),
          h("div", { className: "seller-row" },
            h("span", { className: "seller-avatar" }, item.initials),
            h("span", { className: "seller-name" }, item.seller),
            h("span", { className: "seller-campus" }, h(Icon, { name: "pin", size: 13 }), ` ${item.campus}`)))));
  }

  function detailModal(item) {
    return h("div", {
      className: "modal-backdrop-custom", role: "presentation",
      onMouseDown: (event) => { if (event.target === event.currentTarget) setSelectedItem(null); },
    }, h("section", { className: "detail-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title" },
      h("button", { className: "modal-close", onClick: () => setSelectedItem(null), "aria-label": "Close listing details" }, h(Icon, { name: "close" })),
      h("div", { className: `detail-image ${item.accent}` }, h("img", { src: item.image, alt: item.title })),
      h("div", { className: "detail-content" },
        h("div", { className: "listing-category" }, item.category, h("span", null, "·"), item.posted),
        h("h2", { id: "detail-title" }, item.title),
        h("div", { className: "price-row detail-price" }, h("strong", null, `$${item.price}`), item.originalPrice && h("del", null, `$${item.originalPrice} new`)),
        h("span", { className: "detail-condition" }, `${item.condition} condition`),
        h("p", { className: "detail-description" }, item.description),
        h("div", { className: "detail-seller" },
          h("span", { className: "seller-avatar seller-avatar-large" }, item.initials),
          h("span", null, h("strong", null, item.seller), h("small", null, h(Icon, { name: "pin", size: 14 }), ` ${item.campus}`))),
        h("a", {
          className: "btn btn-forest contact-button",
          href: `mailto:?subject=${encodeURIComponent(`Hi, I'm interested in ${item.title}`)}&body=${encodeURIComponent(`Hi ${item.seller}, I saw your listing for ${item.title} on Campus Cart. Is it still available?`)}`,
        }, h(Icon, { name: "message", size: 18 }), " Contact seller"),
        h("p", { className: "contact-note" }, "Opens your email app so you can arrange a campus meetup."))));
  }

  function sellModal() {
    return h("div", {
      className: "modal-backdrop-custom", role: "presentation",
      onMouseDown: (event) => { if (event.target === event.currentTarget) closeSell(); },
    }, h("section", { className: "sell-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "sell-title" },
      h("div", { className: "sell-modal-header" },
        h("div", null, h("span", { className: "section-kicker" }, "Give it a second life"), h("h2", { id: "sell-title" }, "List an item")),
        h("button", { className: "modal-close modal-close-static", onClick: closeSell, "aria-label": "Close sell form" }, h(Icon, { name: "close" }))),
      h("form", { onSubmit: handleSubmitListing },
        h("div", { className: "photo-upload" },
          h("input", {
            ref: fileInput, className: "visually-hidden", type: "file", accept: "image/*",
            "aria-label": "Upload product photo",
            onChange: (event) => { const file = event.target.files?.[0]; if (file) setPhotoPreview(URL.createObjectURL(file)); },
          }),
          photoPreview
            ? h("button", { type: "button", className: "photo-preview", onClick: () => fileInput.current?.click(), "aria-label": "Change listing photo" },
              h("img", { src: photoPreview, alt: "Listing preview" }),
              h("span", null, h(Icon, { name: "camera", size: 16 }), " Change photo"))
            : h("button", { type: "button", className: "upload-prompt", onClick: () => fileInput.current?.click() },
              h("span", { className: "upload-icon" }, h(Icon, { name: "camera", size: 21 })),
              h("strong", null, "Add a photo"), h("small", null, "Listings with a photo get noticed"))),
        h("div", { className: "row g-3" },
          h("div", { className: "col-12" }, h("label", { className: "form-label", htmlFor: "listing-title" }, "What are you selling?"), h("input", { className: "form-control", id: "listing-title", name: "title", placeholder: "e.g. Biology 101 textbook", maxLength: 70, required: true })),
          h("div", { className: "col-6" }, h("label", { className: "form-label", htmlFor: "listing-price" }, "Price ($)"), h("input", { className: "form-control", id: "listing-price", name: "price", type: "number", min: 1, step: 1, placeholder: "25", required: true })),
          h("div", { className: "col-6" }, h("label", { className: "form-label", htmlFor: "listing-condition" }, "Condition"), h("select", { className: "form-select", id: "listing-condition", name: "condition" }, ["Like new", "Good", "Well loved"].map((value) => h("option", { key: value }, value)))),
          h("div", { className: "col-12" }, h("label", { className: "form-label", htmlFor: "listing-category" }, "Category"), h("select", { className: "form-select", id: "listing-category", name: "category" }, ["Textbooks", "Calculators", "Lab equipment", "Dorm & living", "Other"].map((value) => h("option", { key: value }, value)))),
          h("div", { className: "col-6" }, h("label", { className: "form-label", htmlFor: "seller-name" }, "Your first name"), h("input", { className: "form-control", id: "seller-name", name: "seller", placeholder: "Your name", maxLength: 40, required: true })),
          h("div", { className: "col-6" }, h("label", { className: "form-label", htmlFor: "seller-campus" }, "Campus spot"), h("input", { className: "form-control", id: "seller-campus", name: "campus", placeholder: "e.g. North Campus", maxLength: 40, required: true })),
          h("div", { className: "col-12" }, h("label", { className: "form-label", htmlFor: "listing-description" }, "A few details"), h("textarea", { className: "form-control", id: "listing-description", name: "description", rows: 3, placeholder: "Tell fellow students what makes this a great find…", maxLength: 300, required: true }))),
        formError && h("p", { className: "form-error", role: "alert" }, formError),
        h("button", { className: "btn btn-forest post-button", type: "submit" }, h(Icon, { name: "plus", size: 18 }), " Post listing"),
        h("p", { className: "form-disclaimer" }, "This demo listing is only saved on this page. No account or payment required."))));
  }

  return h("div", { className: "app-shell" },
    h("header", { className: "site-header" },
      h("nav", { className: "navbar navbar-expand-lg container site-nav", "aria-label": "Main navigation" },
        h(Brand),
        h("div", { className: "nav-campus d-none d-lg-flex" }, h("span", { className: "campus-dot" }), h("span", null, "Maplewood University"), h(Icon, { name: "chevron", size: 15 })),
        h("div", { className: "ms-auto d-flex align-items-center gap-2 gap-sm-3" },
          h("button", {
            className: `nav-wishlist${savedOnly ? " active" : ""}`, type: "button",
            onClick: () => { setSavedOnly((value) => !value); scrollListings(); }, "aria-pressed": savedOnly,
          }, h(Icon, { name: "heart", size: 19 }), h("span", { className: "d-none d-sm-inline" }, "Saved"),
          wishlist.length > 0 && h("span", { className: "saved-count" }, wishlist.length)),
          h("button", { className: "btn btn-forest nav-sell", onClick: () => setShowSell(true) }, h(Icon, { name: "plus", size: 18 }), h("span", null, "Sell an item"))))),
    h("main", { id: "home" },
      h("section", { className: "hero-section" },
        h("div", { className: "container hero-inner" },
          h("div", { className: "hero-copy" },
            h("div", { className: "eyebrow" }, h("span", { className: "eyebrow-spark" }, "✳"), " THE STUDENT-TO-STUDENT MARKETPLACE"),
            h("h1", null, "Your campus,", h("br"), "in ", h("span", null, "good hands.")),
            h("p", { className: "hero-description" }, "Good finds. Better prices. Keep great stuff in the hands of students who need it."),
            h("form", { className: "hero-search", role: "search", onSubmit: (event) => { event.preventDefault(); scrollListings(); } },
              h(Icon, { name: "search", size: 21 }),
              h("label", { className: "visually-hidden", htmlFor: "market-search" }, "Search campus listings"),
              h("input", { id: "market-search", type: "search", placeholder: "What are you looking for?", value: search, onChange: (event) => setSearch(event.target.value) }),
              h("button", { className: "btn btn-forest search-button", type: "submit" }, "Find it")),
            h("div", { className: "hero-footnote" },
              h("span", { className: "avatar-stack", "aria-hidden": "true" }, h("span", { className: "mini-avatar mini-a" }, "M"), h("span", { className: "mini-avatar mini-b" }, "J"), h("span", { className: "mini-avatar mini-c" }, "A")),
              h("span", null, h("strong", null, "2,400+"), " students finding a second life for their stuff"))),
          h("div", { className: "hero-art", "aria-label": "A student browsing campus marketplace finds" },
            h("div", { className: "hero-image-wrap" },
              h("img", { className: "hero-image", src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=88", alt: "Students walking through a leafy university campus" }),
              h("div", { className: "image-caption" }, h("span", { className: "caption-dot" }), h("span", null, "Good stuff stays local."))),
            h("div", { className: "floating-note note-top" }, h("span", { className: "note-icon" }, "↗"), h("span", null, h("strong", null, "Found it on campus"), h("small", null, "Little wins, every day"))),
            h("div", { className: "floating-note note-bottom" }, h("span", { className: "note-heart" }, "♥"), h("span", null, h("strong", null, "Made for student life"), h("small", null, "Buy less new. Find more here."))),
            h("span", { className: "hero-doodle", "aria-hidden": "true" }, "✳")))),
      h("section", { className: "category-section", "aria-labelledby": "category-title" },
        h("div", { className: "container" },
          h("div", { className: "section-heading category-heading" },
            h("div", null, h("span", { className: "section-kicker" }, "A little bit of everything"), h("h2", { id: "category-title" }, "Find your kind of thing")),
            h("button", { type: "button", className: "text-link", onClick: () => { setActiveCategory("All items"); setSavedOnly(false); scrollListings(); } }, "Browse everything ", h(Icon, { name: "arrow", size: 16 }))),
          h("div", { className: "category-row" }, categories.map((category, index) =>
            h("button", {
              className: `category-tile${activeCategory === category.name ? " selected" : ""}`, key: category.name,
              onClick: () => { setActiveCategory(category.name); setSavedOnly(false); scrollListings(); }, "aria-pressed": activeCategory === category.name,
            }, h("span", { className: `category-icon category-${index}` }, category.icon),
            h("span", { className: "category-info" }, h("strong", null, category.name), h("small", null, `${category.count} finds`)),
            h(Icon, { name: "chevron", size: 18 })))))),
      h("section", { className: "listings-section", id: "listings", "aria-labelledby": "listings-title" },
        h("div", { className: "container" },
          h("div", { className: "section-heading listings-heading" },
            h("div", null,
              h("span", { className: "section-kicker" }, savedOnly ? "Your little collection" : "Fresh from around campus"),
              h("h2", { id: "listings-title" }, savedOnly ? "Your saved finds" : "Recently listed"),
              h("p", { className: "section-subtitle" }, savedOnly ? "All the things you’ve had your eye on." : "One student’s done-with-it is another’s just-what-I-needed.")),
            h("div", { className: "listing-controls" }, h("label", { className: "visually-hidden", htmlFor: "sort-listings" }, "Sort listings"),
              h("select", { id: "sort-listings", className: "form-select sort-select", value: sort, onChange: (event) => setSort(event.target.value) },
                ["Newest first", "Price: low to high", "Price: high to low"].map((value) => h("option", { key: value }, value))))),
          h("div", { className: "filter-pills", "aria-label": "Filter by category" },
            categories.map((category) => h("button", {
              key: category.name, className: `filter-pill${activeCategory === category.name ? " active" : ""}`,
              onClick: () => setActiveCategory(category.name), "aria-pressed": activeCategory === category.name,
            }, category.name))),
          visibleListings.length
            ? h("div", { className: "row g-4 listing-grid" }, visibleListings.map(listingCard))
            : h("div", { className: "empty-state" },
              h("span", { className: "empty-icon" }, savedOnly ? "♡" : "⌕"),
              h("h3", null, savedOnly ? "Your saved list is waiting" : "No finds just yet"),
              h("p", null, savedOnly ? "Tap the heart on anything you love and it’ll show up here." : "Try another search or category. Your next great find is out there."),
              h("button", { className: "btn btn-outline-forest", onClick: () => { setSavedOnly(false); setSearch(""); setActiveCategory("All items"); } }, "See all listings")))),
      h("section", { className: "sell-banner" },
        h("div", { className: "container sell-banner-inner" },
          h("div", { className: "sell-illustration", "aria-hidden": "true" }, h("span", null, "↗"), h("span", null, "✳"), h("span", null, "▤")),
          h("div", { className: "sell-banner-copy" }, h("span", { className: "section-kicker" }, "Ready to pass it on?"), h("h2", null, "Make room for what’s next."), h("p", null, "That textbook, lamp, or lab coat could be someone else’s perfect find.")),
          h("button", { className: "btn btn-forest sell-banner-button", onClick: () => setShowSell(true) }, h(Icon, { name: "plus", size: 18 }), " List something")))),
    h("footer", { className: "site-footer" },
      h("div", { className: "container footer-inner" },
        h(Brand, { footer: true }), h("p", null, "Good finds. Good neighbors. A little less waste."),
        h("span", { className: "footer-note" }, "Made for Maplewood students ", h("span", null, "♥"))),
      h("div", { className: "container footer-disclaimer" }, "A student community project. Listings are local to this page and reset when you leave.")),
    selectedItem && detailModal(selectedItem),
    showSell && sellModal(),
    toast && h("div", { className: "toast-message", role: "status" }, toast));
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
