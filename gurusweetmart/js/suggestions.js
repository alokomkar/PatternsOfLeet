/* Guru Sweet Mart — "Suggestions for orders & pickups" box.
   Front-end only: saved to this browser's localStorage and surfaced in the
   admin panel's Suggestions tab. No server submission yet. */
(function () {
  "use strict";

  var KEY = "gsm_demo_suggestions";

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function writeAll(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

  function initSuggestionForm() {
    var submitBtn = document.querySelector("[data-suggestion-submit]");
    var textarea = document.querySelector("[data-suggestion-input]");
    if (!submitBtn || !textarea) return;
    var confirmEl = document.querySelector("[data-suggestion-confirm]");

    submitBtn.addEventListener("click", function () {
      var text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }
      var list = readAll();
      list.unshift({
        id: "SUG" + Date.now(),
        text: text,
        submittedAt: new Date().toISOString(),
        page: location.pathname.split("/").pop() || "shop.html"
      });
      writeAll(list);
      textarea.value = "";
      if (confirmEl) {
        confirmEl.hidden = false;
        confirmEl.textContent = "Thanks! Your suggestion has been noted — our team will see it in the admin panel.";
        clearTimeout(confirmEl._hideTimer);
        confirmEl._hideTimer = setTimeout(function () { confirmEl.hidden = true; }, 6000);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initSuggestionForm);

  window.GSMSuggestions = { readAll: readAll, writeAll: writeAll };
})();
