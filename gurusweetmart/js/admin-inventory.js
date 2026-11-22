/* Guru Sweet Mart — Admin: Catalogue, Settings and Bulk Order tabs.
   Front-end only. Shares localStorage with inventory.js and shop-flow.js. */
(function () {
  "use strict";

  var root = document.querySelector("[data-admin-view]");
  if (!root) return;
  var Inv = window.GSMInventory;
  if (!Inv) return;

  /* Resolve data/menu-items.json relative to THIS script's own location,
     not the page's — this file is shared between the nested admin.html
     (page and script side by side) and the root-level gurusweetmartadmin.html
     copy (script still lives a folder down), where a page-relative fetch
     would 404. */
  var CATALOG_URL = new URL("../data/menu-items.json", document.currentScript.src).href;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    var buttons = document.querySelectorAll("[data-admin-tab]");
    var views = document.querySelectorAll("[data-admin-view]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        views.forEach(function (v) { v.hidden = v.dataset.adminView !== btn.dataset.adminTab; });
      });
    });
  }

  /* ---------- Catalogue: price + stock ---------- */
  function firstWeight(item) {
    var weights = Object.keys(item.prices_inr).sort(function (a, b) {
      var na = parseInt(a, 10) * (a.indexOf("kg") > -1 ? 1000 : 1);
      var nb = parseInt(b, 10) * (b.indexOf("kg") > -1 ? 1000 : 1);
      return na - nb;
    });
    return weights[0];
  }

  function initCatalogueTab() {
    var rows = document.querySelector("[data-admin-catalog-rows]");
    var search = document.querySelector("[data-admin-catalog-search]");
    var count = document.querySelector("[data-admin-catalog-count]");
    if (!rows) return;

    var items = [];

    function render(filterText) {
      var q = (filterText || "").trim().toLowerCase();
      var filtered = items.filter(function (it) { return it.name.toLowerCase().indexOf(q) > -1; });
      if (count) count.textContent = filtered.length + (filtered.length === 1 ? " item" : " items");
      rows.innerHTML = filtered.map(function (item) {
        var w = firstWeight(item);
        var basePrice = item.prices_inr[w];
        var override = Inv.getPriceOverride(item.name);
        var price = override !== null ? override : basePrice;
        var out = Inv.isOutOfStock(item.name);
        return '<tr class="catalog-admin-row" data-item="' + escapeHtml(item.name) + '">' +
          '<td>' + escapeHtml(item.name) + '<br><span style="color:var(--ink-soft);font-size:0.74rem;">per ' + escapeHtml(w) + '</span></td>' +
          '<td>' + escapeHtml(item.category.replace(/-/g, " ")) + '</td>' +
          '<td><input type="number" min="0" data-price-input value="' + price + '"></td>' +
          '<td><button type="button" class="stock-toggle-btn" data-stock-toggle data-state="' + (out ? "out" : "in") + '">' + (out ? "Out of stock" : "In stock") + '</button></td>' +
          '</tr>';
      }).join("");
    }

    fetch(CATALOG_URL)
      .then(function (r) { return r.json(); })
      .then(function (catalog) {
        items = catalog.items || [];
        render(search ? search.value : "");
      })
      .catch(function () {
        rows.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;">Catalogue could not be loaded.</td></tr>';
      });

    if (search) search.addEventListener("input", function () { render(search.value); });

    rows.addEventListener("change", function (event) {
      var input = event.target.closest("[data-price-input]");
      if (!input) return;
      var name = input.closest("tr").dataset.item;
      Inv.setPriceOverride(name, input.value);
    });

    rows.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-stock-toggle]");
      if (!btn) return;
      var name = btn.closest("tr").dataset.item;
      var nowOut = btn.dataset.state !== "out";
      Inv.setStockOverride(name, nowOut);
      btn.dataset.state = nowOut ? "out" : "in";
      btn.textContent = nowOut ? "Out of stock" : "In stock";
    });
  }

  /* ---------- Settings ---------- */
  function initSettingsTab() {
    var panel = document.querySelector('[data-admin-view="settings"]');
    if (!panel) return;
    var settings = Inv.getSettings();

    panel.querySelectorAll("[data-setting]").forEach(function (el) {
      var key = el.dataset.setting;
      if (el.type === "checkbox") el.checked = !!settings[key];
      else el.value = settings[key] || "";
      el.addEventListener("change", function () {
        var patch = {};
        patch[key] = el.type === "checkbox" ? el.checked : el.value;
        Inv.saveSettings(patch);
        Inv.renderOrderingBanner();
      });
    });

    var chips = panel.querySelector("[data-partner-chips]");
    var partnerInput = panel.querySelector("[data-partner-input]");
    var partnerAdd = panel.querySelector("[data-partner-add]");

    function renderPartners() {
      var partners = Inv.getPartners();
      chips.innerHTML = partners.map(function (p, i) {
        return '<span class="partner-chip">' + escapeHtml(p) + ' <button type="button" data-remove-partner="' + i + '" aria-label="Remove ' + escapeHtml(p) + '">✕</button></span>';
      }).join("");
    }
    renderPartners();

    chips.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-remove-partner]");
      if (!btn) return;
      var partners = Inv.getPartners();
      partners.splice(+btn.dataset.removePartner, 1);
      Inv.savePartners(partners);
      renderPartners();
    });

    if (partnerAdd) {
      partnerAdd.addEventListener("click", function () {
        var name = partnerInput.value.trim();
        if (!name) return;
        var partners = Inv.getPartners();
        if (partners.indexOf(name) === -1) partners.push(name);
        Inv.savePartners(partners);
        partnerInput.value = "";
        renderPartners();
      });
    }
  }

  /* ---------- New bulk order ---------- */
  function newOrderId() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return "GSM" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-B" + Math.floor(1000 + Math.random() * 9000);
  }

  function initBulkTab() {
    var panel = document.querySelector('[data-admin-view="bulk"]');
    if (!panel) return;
    var submit = panel.querySelector("[data-bulk-submit]");
    if (!submit) return;

    submit.addEventListener("click", function () {
      var get = function (field) { return panel.querySelector('[data-bulk-field="' + field + '"]').value.trim(); };
      var name = get("name"), phone = get("phone"), address = get("address"), pincode = get("pincode"), itemsText = get("items"), amount = get("amount");
      if (!name || !phone || !itemsText || !amount) {
        alert("Please fill in the customer's name, phone, items and amount.");
        return;
      }
      var order = {
        id: newOrderId(),
        placedAt: new Date().toISOString(),
        customer: { name: name, phone: phone, address: address, pincode: pincode },
        items: [{ name: itemsText, weight: "Bulk", price: Number(amount) || 0, qty: 1 }],
        subtotal: Number(amount) || 0,
        courier: { name: "Bulk order — to arrange", note: "Entered by staff" },
        status: "paid",
        packBy: "To confirm with customer",
        bulk: true
      };
      var orders = [];
      try { orders = JSON.parse(localStorage.getItem("gsm_demo_orders") || "[]"); } catch (e) { orders = []; }
      orders.unshift(order);
      localStorage.setItem("gsm_demo_orders", JSON.stringify(orders));

      alert("Bulk order " + order.id + " created — opening the Orders tab.");
      location.href = "admin.html";
    });
  }

  /* ---------- Suggestions ---------- */
  function timeAgo(iso) {
    var mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return mins + (mins === 1 ? " minute ago" : " minutes ago");
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
    var days = Math.round(hours / 24);
    return days + (days === 1 ? " day ago" : " days ago");
  }

  function initSuggestionsTab() {
    var list = document.querySelector("[data-suggestions-list]");
    if (!list || !window.GSMSuggestions) return;

    function render() {
      var items = window.GSMSuggestions.readAll();
      if (!items.length) {
        list.innerHTML = '<div class="demo-note">No suggestions yet.</div>';
        return;
      }
      list.innerHTML = items.map(function (s) {
        return '<div class="panel" data-suggestion-id="' + escapeHtml(s.id) + '" style="margin-bottom:14px;">' +
          '<p style="font-size:0.92rem; margin-bottom:8px;">“' + escapeHtml(s.text) + '”</p>' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">' +
          '<span class="hint">From ' + escapeHtml(s.page || "shop.html") + ' · ' + escapeHtml(timeAgo(s.submittedAt)) + '</span>' +
          '<button type="button" class="btn btn-outline on-light btn-sm" data-suggestion-dismiss>Dismiss</button>' +
          '</div></div>';
      }).join("");
    }

    list.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-suggestion-dismiss]");
      if (!btn) return;
      var id = btn.closest("[data-suggestion-id]").dataset.suggestionId;
      var remaining = window.GSMSuggestions.readAll().filter(function (s) { return s.id !== id; });
      window.GSMSuggestions.writeAll(remaining);
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initCatalogueTab();
    initSettingsTab();
    initBulkTab();
    initSuggestionsTab();
  });
})();
