/* Confirmed Guru Sweet Mart menu catalogue. Front-end mockup only. */
(function () {
  "use strict";

  var grid = document.querySelector("[data-catalog-grid]");
  if (!grid) return;

  var search = document.querySelector("[data-catalog-search]");
  var count = document.querySelector("[data-catalog-count]");
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter-bar [data-filter]"));
  var activeCategory = "all";
  var items = [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
  }

  function weightLabel(weight) {
    return weight.replace("kg", " kg").replace("g", " g");
  }

  function weightOrder(weight) {
    var numeric = parseInt(weight, 10);
    return weight.indexOf("kg") > -1 ? numeric * 1000 : numeric;
  }

  function imagePath(item) {
    var filename = item.image_webp.split("/").pop();
    return "images/products/" + item.category + "/" + filename;
  }

  function card(item) {
    var weights = Object.keys(item.prices_inr).sort(function (a, b) { return weightOrder(a) - weightOrder(b); });
    var selected = weights[0];
    var buttons = weights.map(function (weight, index) {
      return '<button type="button" aria-pressed="' + (index === 0 ? "true" : "false") + '" data-weight="' + escapeHtml(weight) + '" data-price="' + item.prices_inr[weight] + '">' + escapeHtml(weightLabel(weight)) + "</button>";
    }).join("");
    var signature = item.name === "Special Ghee Mysore Pak" ? '<span class="badge">Signature</span>' : "";
    return '<article class="product-card sweet-card" data-cat="' + escapeHtml(item.category) + '" data-name="' + escapeHtml(item.name.toLowerCase()) + '">' +
      '<div class="product-media">' + signature +
        '<svg class="veg-mark" aria-label="Vegetarian"><use href="#sym-veg"/></svg>' +
        '<img src="' + escapeHtml(imagePath(item)) + '" alt="' + escapeHtml(item.name) + '" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="product-body">' +
        '<p class="product-category">' + escapeHtml(item.category.replace(/-/g, " ")) + '</p>' +
        '<h4>' + escapeHtml(item.name) + '</h4>' +
        '<div class="weight-pills" role="group" aria-label="Select weight for ' + escapeHtml(item.name) + '">' + buttons + '</div>' +
        '<div class="product-meta"><span class="price" data-card-price>₹' + item.prices_inr[selected].toLocaleString("en-IN") + ' <small>/ ' + escapeHtml(weightLabel(selected)) + '</small></span>' +
        '<button class="btn btn-teal btn-sm" data-add-to-cart>Add</button></div>' +
      '</div></article>';
  }

  function applyFilters() {
    var query = search ? search.value.trim().toLowerCase() : "";
    var visible = 0;
    grid.querySelectorAll(".sweet-card").forEach(function (entry) {
      var categoryMatch = activeCategory === "all" || entry.dataset.cat === activeCategory;
      var searchMatch = !query || entry.dataset.name.indexOf(query) > -1;
      entry.hidden = !(categoryMatch && searchMatch);
      if (!entry.hidden) visible++;
    });
    var previous = grid.querySelector(".catalog-empty");
    if (previous) previous.remove();
    if (!visible) {
      grid.insertAdjacentHTML("beforeend", '<p class="catalog-empty">No menu items match that search. Try another name or choose All.</p>');
    }
    if (count) count.textContent = visible + (visible === 1 ? " product" : " products");
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      filters.forEach(function (entry) { entry.setAttribute("aria-pressed", "false"); });
      button.setAttribute("aria-pressed", "true");
      activeCategory = button.dataset.filter;
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  fetch("data/menu-items.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Catalogue could not be loaded");
      return response.json();
    })
    .then(function (catalog) {
      items = catalog.items || [];
      grid.innerHTML = items.map(card).join("");
      grid.setAttribute("aria-busy", "false");
      applyFilters();
    })
    .catch(function () {
      grid.setAttribute("aria-busy", "false");
      grid.innerHTML = '<p class="catalog-empty">The menu could not be loaded. Please refresh the page.</p>';
      if (count) count.textContent = "Menu unavailable";
    });
})();
