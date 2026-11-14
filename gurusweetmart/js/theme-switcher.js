/* Guru Sweet Mart — design-style preview switcher (DEMO TOOLING ONLY).
   Not part of the real site; lets the client flip between alternate
   visual styles on this page. Persists the choice in localStorage. */
(function () {
  "use strict";

  var KEY = "gsm_demo_style";
  var root = document.documentElement;
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-style-option]"));
  if (!buttons.length) return;

  var toggle = document.querySelector("[data-style-toggle]");
  var panel = document.querySelector(".style-swatches");
  var LABELS = { palace: "Palace style", anand: "Anand style", mahalakshmi: "Mahalakshmi style", kanti: "Kanti style" };

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function applyStyle(style) {
    if (!style || style === "palace") {
      root.removeAttribute("data-style");
    } else {
      root.setAttribute("data-style", style);
    }
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.styleOption === style));
    });
    if (toggle) toggle.innerHTML = '<span class="dot" aria-hidden="true"></span> Demo: ' + (LABELS[style] || "Palace style") + " ▾";
    try { localStorage.setItem(KEY, style); } catch (e) { /* ignore */ }
    syncWeightSelects();
  }

  /* Kanti variant: a <select> stands in for the weight pills on each card.
     Keep its price/pill state in sync so "Add" still uses the chosen weight.
     Delegated on document so it also covers cards menu.js renders later
     (shop.html fetches its catalog asynchronously, after this script runs). */
  var weightSelectDelegated = false;
  function syncWeightSelects() {
    if (weightSelectDelegated) return;
    weightSelectDelegated = true;
    document.addEventListener("change", function (event) {
      var select = event.target.closest("[data-weight-select]");
      if (!select) return;
      var card = select.closest(".product-card");
      if (!card) return;
      var pills = card.querySelectorAll(".weight-pills button");
      pills.forEach(function (pill) {
        pill.setAttribute("aria-pressed", String(pill.textContent.trim() === select.value));
      });
      var chosen = Array.prototype.filter.call(pills, function (p) { return p.getAttribute("aria-pressed") === "true"; })[0];
      var priceEl = card.querySelector("[data-card-price]");
      if (chosen && priceEl) {
        priceEl.innerHTML = "₹" + Number(chosen.dataset.price).toLocaleString("en-IN") + " <small>/ " + chosen.textContent.trim() + "</small>";
      }
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyStyle(btn.dataset.styleOption);
      if (panel) panel.setAttribute("hidden", "");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
  applyStyle(saved || "palace");
})();
