/* Guru Sweet Mart — mockup interactivity only (no backend, no real payments). */
(function () {
  "use strict";

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

  /* Weight pill selection within product cards */
  document.querySelectorAll(".weight-pills").forEach(function (group) {
    group.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
      });
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
  document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var n = readCart() + 1;
      localStorage.setItem("gsm_demo_cart_count", String(n));
      paintCart();
      var original = btn.textContent;
      btn.textContent = "Added ✓";
      setTimeout(function () { btn.textContent = original; }, 1200);
    });
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
  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/gurusweetmart/service-worker.js", { scope: "/gurusweetmart/" }).catch(function () {
        /* mockup: silently ignore in environments without SW support */
      });
    });
  }
})();
