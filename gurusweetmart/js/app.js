/* Guru Sweet Mart — mockup interactivity only (no backend, no real payments). */
(function () {
  "use strict";

  /* document.currentScript is only valid during this synchronous run, so it
     must be captured now — by the time the "load" handler below fires (for
     the service worker registration) it would already be null. Resolving
     against the script's own URL, not the page's, is what lets the same
     file work whether this mockup is served at a domain root, nested under
     a nested gurusweetmart/, or loaded from a root-level duplicate page
     that references "gurusweetmart/js/app.js". */
  var thisScriptUrl = document.currentScript ? document.currentScript.src : null;

  /* Header scroll shadow */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav drawer */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Language switch — demo only, toggles a body attribute + Kannada label emphasis */
  var langButtons = document.querySelectorAll(".lang-switch button");
  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      langButtons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      document.documentElement.setAttribute("data-lang-demo", btn.dataset.lang || "en");
    });
  });

  /* Cart count demo (localStorage-backed, mockup only) */
  var cartCountEls = document.querySelectorAll(".cart-count");
  function readCart() {
    return parseInt(localStorage.getItem("gsm_demo_cart_count") || "0", 10);
  }
  function paintCart() {
    var n = readCart();
    cartCountEls.forEach(function (el) { el.textContent = n; });
  }

  /* Itemized cart (mockup only) — kept alongside the simple counter above so
     the new cart/checkout pages can show real line items. Dedupes by
     name + weight so re-adding the same item bumps its quantity. */
  function readCartItems() {
    try {
      return JSON.parse(localStorage.getItem("gsm_demo_cart_items") || "[]");
    } catch (e) {
      return [];
    }
  }
  function writeCartItems(items) {
    localStorage.setItem("gsm_demo_cart_items", JSON.stringify(items));
    localStorage.setItem(
      "gsm_demo_cart_count",
      String(items.reduce(function (sum, it) { return sum + it.qty; }, 0))
    );
    paintCart();
  }
  function addCartItemFromCard(card, weightLabel, price) {
    if (!card) return;
    var nameEl = card.querySelector("h4");
    var name = nameEl ? nameEl.textContent.trim() : "Item";
    var imgEl = card.querySelector(".product-media img");
    var items = readCartItems();
    var existing = items.filter(function (it) { return it.name === name && it.weight === weightLabel; })[0];
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        name: name,
        category: card.dataset.cat || "",
        weight: weightLabel || "",
        price: Number(price) || 0,
        qty: 1,
        image: imgEl ? imgEl.getAttribute("src") : ""
      });
    }
    writeCartItems(items);
  }

  document.addEventListener("click", function (event) {
    var weightButton = event.target.closest(".weight-pills button");
    if (weightButton) {
      var group = weightButton.closest(".weight-pills");
      group.querySelectorAll("button").forEach(function (button) { button.setAttribute("aria-pressed", "false"); });
      weightButton.setAttribute("aria-pressed", "true");
      var card = weightButton.closest(".product-card");
      var price = card && card.querySelector("[data-card-price]");
      if (price && weightButton.dataset.price) {
        price.innerHTML = "₹" + Number(weightButton.dataset.price).toLocaleString("en-IN") + " <small>/ " + weightButton.textContent + "</small>";
      }
      return;
    }

    var btn = event.target.closest("[data-add-to-cart]");
    if (btn) {
      var productCard = btn.closest(".product-card");
      var pressedWeight = productCard && productCard.querySelector(".weight-pills button[aria-pressed='true']");
      addCartItemFromCard(productCard, pressedWeight ? pressedWeight.textContent.trim() : "", pressedWeight ? pressedWeight.dataset.price : "");
      var original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(function () { btn.textContent = original; }, 1200);
    }
  });
  paintCart();

  /* Token stage simulator — Order at Store page.
     A token only exists once payment is confirmed, so "Payment pending" has
     no dot here — the track starts at Paid and matches the 5 stages markup. */
  var stages = ["paid", "accepted", "preparing", "ready", "collected"];
  var stageLabels = {
    paid: "Paid",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    collected: "Collected"
  };
  var track = document.querySelector("[data-stage-track]");
  var simBtn = document.querySelector("[data-sim-next]");
  var statusText = document.querySelector("[data-status-text]");
  if (track && simBtn) {
    var idx = 0; // start at "paid" for the demo
    function render() {
      track.querySelectorAll(".stage").forEach(function (stageEl, i) {
        stageEl.classList.toggle("done", i < idx);
        stageEl.classList.toggle("current", i === idx);
      });
      if (statusText) {
        statusText.textContent = stageLabels[stages[idx]];
      }
      simBtn.disabled = idx >= stages.length - 1;
      simBtn.textContent = idx >= stages.length - 1 ? "Order collected" : "Simulate next stage →";
    }
    simBtn.addEventListener("click", function () {
      if (idx < stages.length - 1) idx++;
      render();
    });
    render();
  }

  /* PWA install prompt */
  var deferredPrompt = null;
  var installBanner = document.querySelector("[data-install-banner]");
  var installBtn = document.querySelector("[data-install-action]");
  var closeInstall = document.querySelector("[data-install-close]");

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner && !sessionStorage.getItem("gsm_install_dismissed")) {
      installBanner.classList.add("show");
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        if (installBanner) installBanner.classList.remove("show");
      });
    });
  }
  if (closeInstall) {
    closeInstall.addEventListener("click", function () {
      if (installBanner) installBanner.classList.remove("show");
      sessionStorage.setItem("gsm_install_dismissed", "1");
    });
  }
  window.addEventListener("appinstalled", function () {
    if (installBanner) installBanner.classList.remove("show");
  });

  /* Offline / online status pill */
  var offlinePill = document.querySelector("[data-offline-pill]");
  function paintOnlineStatus() {
    if (!offlinePill) return;
    if (navigator.onLine) {
      offlinePill.classList.remove("show");
    } else {
      offlinePill.textContent = "You're offline — showing saved content";
      offlinePill.classList.add("show");
    }
  }
  window.addEventListener("online", paintOnlineStatus);
  window.addEventListener("offline", paintOnlineStatus);
  paintOnlineStatus();

  /* Register service worker (only on http/https, not file://) */
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http") && thisScriptUrl) {
    var swUrl = new URL("../service-worker.js", thisScriptUrl).href;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(swUrl).catch(function () {
        /* mockup: silently ignore in environments without SW support */
      });
    });
  }
})();
