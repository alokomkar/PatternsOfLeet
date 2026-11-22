/* Guru Sweet Mart — Catalogue, stock and ordering-availability mock.
   Front-end only: no backend. Shared by every page so admin changes made
   in one tab of this browser show up immediately on the others. */
(function () {
  "use strict";

  var KEYS = {
    settings: "gsm_demo_settings",
    stock: "gsm_demo_stock_overrides",
    price: "gsm_demo_price_overrides",
    partners: "gsm_demo_delivery_partners"
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function defaultSettings() {
    return { onlineOrderingOn: true, stockMessagingOn: true, stockRenewTime: "09:00", lastRenewDate: "" };
  }
  function getSettings() {
    return Object.assign(defaultSettings(), readJSON(KEYS.settings, {}));
  }
  function saveSettings(patch) {
    var next = Object.assign(getSettings(), patch);
    writeJSON(KEYS.settings, next);
    return next;
  }

  function getStockOverrides() { return readJSON(KEYS.stock, {}); }
  function setStockOverride(name, outOfStock) {
    var overrides = getStockOverrides();
    if (outOfStock) overrides[name] = true; else delete overrides[name];
    writeJSON(KEYS.stock, overrides);
  }
  function isOutOfStock(name) { return !!getStockOverrides()[name]; }

  function getPriceOverrides() { return readJSON(KEYS.price, {}); }
  function setPriceOverride(name, price) {
    var overrides = getPriceOverrides();
    if (price === null || price === undefined || price === "") delete overrides[name];
    else overrides[name] = Number(price);
    writeJSON(KEYS.price, overrides);
  }
  function getPriceOverride(name) {
    var overrides = getPriceOverrides();
    return Object.prototype.hasOwnProperty.call(overrides, name) ? overrides[name] : null;
  }

  function defaultPartners() { return ["Swiggy", "Zomato"]; }
  function getPartners() {
    var list = readJSON(KEYS.partners, null);
    return list && list.length ? list : defaultPartners();
  }
  function savePartners(list) { writeJSON(KEYS.partners, list); }

  /* Scheduled stock renewal (P2, demo simulation): once per calendar day,
     at/after the configured time, clear every manual "out of stock" mark.
     A real build would run this server-side on a timer; here it is
     evaluated on each page load, which is enough to demo the behaviour. */
  function maybeRenewStock() {
    var settings = getSettings();
    var now = new Date();
    var today = now.toISOString().slice(0, 10);
    if (settings.lastRenewDate === today) return;
    var parts = (settings.stockRenewTime || "09:00").split(":");
    var renewAt = new Date(now);
    renewAt.setHours(+parts[0] || 0, +parts[1] || 0, 0, 0);
    if (now >= renewAt) {
      writeJSON(KEYS.stock, {});
      saveSettings({ lastRenewDate: today });
    }
  }

  function isOnlineOrderingOn() { return getSettings().onlineOrderingOn; }

  /* ---------- Apply overrides to rendered product cards (any page) ---------- */
  function alternativesFor(name, category, limit) {
    var items = window.GSM_CATALOG_ITEMS || [];
    return items
      .filter(function (it) { return it.category === category && it.name !== name && !isOutOfStock(it.name); })
      .slice(0, limit || 2);
  }

  function applyToCard(card) {
    var nameEl = card.querySelector("h4");
    if (!nameEl) return;
    var name = nameEl.textContent.trim();

    var priceOverride = getPriceOverride(name);
    if (priceOverride !== null) {
      var pills = card.querySelectorAll(".weight-pills button");
      if (pills.length) pills[0].dataset.price = String(priceOverride);
      var select = card.querySelector("[data-weight-select] option");
      if (select) select.textContent = select.textContent.replace(/₹[\d,]+/, "₹" + priceOverride.toLocaleString("en-IN"));
      var priceEl = card.querySelector("[data-card-price]");
      if (priceEl && pills.length && pills[0].getAttribute("aria-pressed") === "true") {
        var unit = pills[0].textContent.trim();
        priceEl.innerHTML = "₹" + Number(priceOverride).toLocaleString("en-IN") + " <small>/ " + unit + "</small>";
      }
    }

    var existingNote = card.querySelector("[data-stock-note]");
    if (existingNote) existingNote.remove();
    var addBtn = card.querySelector("[data-add-to-cart]");

    if (isOutOfStock(name)) {
      card.classList.add("is-out-of-stock");
      if (addBtn) { addBtn.disabled = true; addBtn.textContent = "Unavailable"; }
      var settings = getSettings();
      var note = document.createElement("p");
      note.setAttribute("data-stock-note", "");
      note.className = "stock-note";
      if (settings.stockMessagingOn) {
        var alts = alternativesFor(name, card.dataset.cat, 2);
        var altText = alts.length ? " Try instead: " + alts.map(function (a) { return a.name; }).join(", ") + "." : "";
        note.textContent = "Currently unavailable." + altText;
      } else {
        note.textContent = "Unavailable";
      }
      var body = card.querySelector(".product-body");
      if (body) body.appendChild(note);
    } else {
      card.classList.remove("is-out-of-stock");
      if (addBtn) { addBtn.disabled = false; if (addBtn.textContent === "Unavailable") addBtn.textContent = "Add"; }
    }
  }

  function applyInventoryOverrides() {
    document.querySelectorAll(".product-card").forEach(applyToCard);
  }

  /* ---------- Site-wide "online ordering paused" banner ---------- */
  var ORDERING_SELECTOR = "[data-add-to-cart], [data-go-checkout], [data-open-pay], [data-sim-success]";

  function renderOrderingBanner() {
    var existing = document.querySelector("[data-ordering-paused-banner]");
    var on = isOnlineOrderingOn();
    if (on) {
      if (existing) existing.remove();
      document.querySelectorAll(ORDERING_SELECTOR).forEach(function (el) {
        if (el.dataset.pausedDisabled === "1") {
          el.disabled = false;
          delete el.dataset.pausedDisabled;
        }
      });
      return;
    }
    if (!existing) {
      var banner = document.createElement("div");
      banner.setAttribute("data-ordering-paused-banner", "");
      banner.className = "ordering-paused-banner";
      banner.textContent = "Online ordering is paused right now — please check back shortly, or visit us in store.";
      document.body.insertBefore(banner, document.body.firstChild);
    }
    document.querySelectorAll(ORDERING_SELECTOR).forEach(function (el) {
      if (!el.disabled) {
        el.disabled = true;
        el.dataset.pausedDisabled = "1";
      }
    });
  }

  /* [data-go-checkout] is an <a>, which ignores .disabled — block it (and
     anything else ordering-related) at the click, once, regardless of tag. */
  document.addEventListener("click", function (event) {
    if (isOnlineOrderingOn()) return;
    var el = event.target.closest(ORDERING_SELECTOR);
    if (!el) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  function init() {
    maybeRenewStock();
    applyInventoryOverrides();
    renderOrderingBanner();
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("gsm:catalog-rendered", function () {
    applyInventoryOverrides();
    renderOrderingBanner();
  });

  window.GSMInventory = {
    getSettings: getSettings, saveSettings: saveSettings,
    getStockOverrides: getStockOverrides, setStockOverride: setStockOverride, isOutOfStock: isOutOfStock,
    getPriceOverrides: getPriceOverrides, setPriceOverride: setPriceOverride, getPriceOverride: getPriceOverride,
    getPartners: getPartners, savePartners: savePartners,
    isOnlineOrderingOn: isOnlineOrderingOn,
    applyInventoryOverrides: applyInventoryOverrides, renderOrderingBanner: renderOrderingBanner
  };
})();
