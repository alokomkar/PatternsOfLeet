/* Guru Sweet Mart — Cart / Checkout / Payment / Admin mock logic.
   Front-end only: no backend, no real Razorpay, no real courier APIs.
   Shares localStorage keys with js/app.js (gsm_demo_cart_items / gsm_demo_cart_count)
   and adds gsm_demo_orders for the demo order history. */
(function () {
  "use strict";

  var STAGES = ["paid", "packed", "shipped", "out-for-delivery", "delivered"];
  var STAGE_LABELS = {
    paid: "Paid",
    packed: "Packed",
    shipped: "Shipped",
    "out-for-delivery": "Out for delivery",
    delivered: "Delivered"
  };

  /* ---------- Simulated local notifications (demo only — no push server) ---------- */
  var STATUS_NOTIF = {
    paid: { title: "Order confirmed", body: "We've received your payment and notified our packing team." },
    packed: { title: "Order packed", body: "Your order has been packed and is ready for dispatch." },
    shipped: { title: "Order shipped", body: "Your order is on its way." },
    "out-for-delivery": { title: "Out for delivery", body: "Your order is out for delivery — it should arrive soon." },
    delivered: { title: "Order delivered", body: "Enjoy! Your order has been delivered." }
  };
  function notifyStatus(order) {
    if (!order || !("Notification" in window) || Notification.permission !== "granted") return;
    var info = STATUS_NOTIF[order.status];
    if (!info) return;
    var body = info.body + " (Order " + order.id + ")";
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function (reg) {
        reg.showNotification(info.title, { body: body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "gsm-order-" + order.id });
      }).catch(function () {
        try { new Notification(info.title, { body: body }); } catch (e) { /* ignore */ }
      });
    } else {
      try { new Notification(info.title, { body: body }); } catch (e) { /* ignore */ }
    }
  }

  function initNotifBanner() {
    var banner = document.querySelector("[data-notif-banner]");
    if (!banner || !("Notification" in window)) return;
    var btn = banner.querySelector("[data-enable-notifs]");
    var titleEl = banner.querySelector("[data-notif-title]");
    var subEl = banner.querySelector("[data-notif-sub]");

    function render() {
      banner.hidden = false;
      if (Notification.permission === "granted") {
        titleEl.textContent = "Order updates enabled";
        subEl.textContent = "You'll see a local notification here when your order status changes (demo only).";
        if (btn) btn.style.display = "none";
      } else if (Notification.permission === "denied") {
        titleEl.textContent = "Notifications are blocked";
        subEl.textContent = "Allow notifications for this site in your browser settings to try this demo.";
        if (btn) btn.style.display = "none";
      } else {
        if (btn) btn.style.display = "";
      }
    }

    if (btn) {
      btn.addEventListener("click", function () {
        Notification.requestPermission().then(function (permission) {
          render();
          if (permission === "granted") {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
              navigator.serviceWorker.ready.then(function (reg) {
                reg.showNotification("Order updates enabled", { body: "We'll show updates here as your order moves — this is a demo notification, not a real push.", icon: "icons/icon-192.png", tag: "gsm-welcome" });
              });
            }
          }
        });
      });
    }

    render();
  }

  /* ---------- storage helpers ---------- */
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
  function readCartItems() { return readJSON("gsm_demo_cart_items", []); }
  function writeCartItems(items) {
    writeJSON("gsm_demo_cart_items", items);
    localStorage.setItem("gsm_demo_cart_count", String(items.reduce(function (s, it) { return s + it.qty; }, 0)));
    document.querySelectorAll(".cart-count").forEach(function (el) {
      el.textContent = String(items.reduce(function (s, it) { return s + it.qty; }, 0));
    });
  }
  function readOrders() { return readJSON("gsm_demo_orders", []); }
  function writeOrders(orders) { writeJSON("gsm_demo_orders", orders); }

  function cartSubtotal(items) {
    return items.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
  }
  function formatINR(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  }

  /* ---------- demo order id + packing estimate ---------- */
  function newOrderId() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var datePart = String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
    var rand = Math.floor(1000 + Math.random() * 9000);
    return "GSM" + datePart + "-" + rand;
  }
  function packingEstimate() {
    var hour = new Date().getHours();
    return hour < 15
      ? "Packed today, dispatched tomorrow morning"
      : "Packed tomorrow, dispatched tomorrow evening";
  }

  /* ---------- courier matching (demo heuristic only) ---------- */
  function courierOptionsForPincode(pincode) {
    var p = String(pincode || "").trim();
    var valid = /^\d{6}$/.test(p);
    var num = valid ? parseInt(p, 10) : null;
    var isHyderabad = valid && num >= 500000 && num <= 509999;
    var isSouth = valid && (p.charAt(0) === "5" || p.charAt(0) === "6");

    return [
      {
        key: "professional",
        name: "Professional Couriers",
        note: "South India coverage, except Hyderabad",
        eligible: valid && isSouth && !isHyderabad,
        tag: null
      },
      {
        key: "speed-post",
        name: "Speed Post",
        note: "India Post network, Pan-India",
        eligible: valid,
        tag: null
      },
      {
        key: "dtdc",
        name: "DTDC",
        note: "Pan-India",
        eligible: valid,
        tag: null
      },
      {
        key: "maruthi",
        name: "Maruthi Courier",
        note: "South India (coverage to confirm with client)",
        eligible: valid && isSouth,
        tag: "To confirm"
      },
      {
        key: "shiprocket",
        name: "Shiprocket",
        note: "Aggregator across multiple couriers — under evaluation",
        eligible: false,
        tag: "Not yet integrated"
      }
    ];
  }

  /* ---------- WhatsApp packing-handoff preview text ---------- */
  function whatsappMessageFor(order) {
    var lines = order.items.map(function (it) {
      return it.qty + "× " + it.name + " (" + it.weight + ")";
    }).join("\n");
    return "New prepaid order " + order.id + "\n" +
      "Customer: " + order.customer.name + " · " + order.customer.phone + "\n\n" +
      "Items:\n" + lines + "\n\n" +
      "Deliver to: " + order.customer.address + " — " + order.customer.pincode + "\n" +
      "Courier: " + order.courier.name + "\n" +
      "Packing: " + order.packBy;
  }

  /* =========================================================
     Cart page
     ========================================================= */
  function initCartPage() {
    var root = document.querySelector("[data-cart-page]");
    if (!root) return;
    var linesEl = root.querySelector("[data-cart-lines]");
    var emptyEl = root.querySelector("[data-cart-empty]");
    var filledEl = root.querySelector("[data-cart-filled]");
    var subtotalEl = root.querySelector("[data-cart-subtotal]");
    var totalEl = root.querySelector("[data-cart-total]");
    var checkoutBtn = root.querySelector("[data-go-checkout]");
    var bulkNote = root.querySelector("[data-bulk-note]");
    var BULK_THRESHOLD = 10;

    function render() {
      var items = readCartItems();
      if (!items.length) {
        linesEl.innerHTML = "";
        emptyEl.hidden = false;
        if (filledEl) filledEl.hidden = true;
        if (checkoutBtn) checkoutBtn.setAttribute("disabled", "disabled");
      } else {
        emptyEl.hidden = true;
        if (filledEl) filledEl.hidden = false;
        if (checkoutBtn) checkoutBtn.removeAttribute("disabled");
        linesEl.innerHTML = items.map(function (it, idx) {
          return '<div class="cart-line">' +
            '<div class="thumb">' + (it.image ? '<img src="' + escapeHtml(it.image) + '" alt="">' : escapeHtml(it.category || "GSM")) + '</div>' +
            '<div><div class="name">' + escapeHtml(it.name) + '</div>' +
            '<div class="meta">' + escapeHtml(it.weight || "") + ' · ' + formatINR(it.price) + ' each</div>' +
            '<button type="button" class="remove-line" data-remove="' + idx + '">Remove</button></div>' +
            '<div class="qty-stepper">' +
            '<button type="button" data-qty-down="' + idx + '" aria-label="Decrease quantity">−</button>' +
            '<span>' + it.qty + '</span>' +
            '<button type="button" data-qty-up="' + idx + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<div class="line-price">' + formatINR(it.price * it.qty) + '</div>' +
            '</div>';
        }).join("");
      }
      var subtotal = cartSubtotal(items);
      if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
      if (totalEl) totalEl.textContent = formatINR(subtotal);
      if (bulkNote) {
        var totalQty = items.reduce(function (s, it) { return s + it.qty; }, 0);
        bulkNote.hidden = totalQty < BULK_THRESHOLD;
      }
    }

    root.addEventListener("click", function (event) {
      var items = readCartItems();
      var upBtn = event.target.closest("[data-qty-up]");
      var downBtn = event.target.closest("[data-qty-down]");
      var removeBtn = event.target.closest("[data-remove]");
      if (upBtn) {
        items[+upBtn.dataset.qtyUp].qty += 1;
        writeCartItems(items);
        render();
      } else if (downBtn) {
        var idx = +downBtn.dataset.qtyDown;
        items[idx].qty -= 1;
        if (items[idx].qty <= 0) items.splice(idx, 1);
        writeCartItems(items);
        render();
      } else if (removeBtn) {
        items.splice(+removeBtn.dataset.remove, 1);
        writeCartItems(items);
        render();
      }
    });

    render();
  }

  /* =========================================================
     Checkout page (+ Razorpay placeholder modal)
     ========================================================= */
  function initCheckoutPage() {
    var root = document.querySelector("[data-checkout-page]");
    if (!root) return;

    var itemsSummary = root.querySelector("[data-checkout-items]");
    var subtotalEl = root.querySelector("[data-checkout-subtotal]");
    var totalEl = root.querySelector("[data-checkout-total]");
    var courierList = root.querySelector("[data-courier-list]");
    var courierPanel = root.querySelector("[data-courier-panel]");
    var deliveryMethodPanel = root.querySelector("[data-delivery-method-panel]");
    var deliveryMethodRow = root.querySelector("[data-delivery-method-row]");
    var deliveryMethodNote = root.querySelector("[data-delivery-method-note]");
    var deliveryMethod = "courier";
    var pincodeInput = root.querySelector("[name=pincode]");
    var packEstimateEl = root.querySelector("[data-pack-estimate]");
    var payBtn = root.querySelector("[data-open-pay]");

    var cart = readCartItems();
    if (!cart.length) {
      root.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3>' +
        '<p>Add something sweet before checking out.</p>' +
        '<a class="btn btn-gold" href="shop.html">Browse the shop</a></div>';
      return;
    }

    var subtotal = cartSubtotal(cart);
    if (itemsSummary) {
      itemsSummary.innerHTML = cart.map(function (it) {
        return '<div class="summary-row"><span>' + it.qty + '× ' + escapeHtml(it.name) + ' (' + escapeHtml(it.weight) + ')</span><span>' + formatINR(it.price * it.qty) + '</span></div>';
      }).join("");
    }
    if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
    if (totalEl) totalEl.textContent = formatINR(subtotal);
    if (packEstimateEl) packEstimateEl.textContent = packingEstimate();

    function renderCouriers() {
      var options = courierOptionsForPincode(pincodeInput ? pincodeInput.value : "");
      courierList.innerHTML = options.map(function (opt, i) {
        var disabled = !opt.eligible;
        return '<label class="courier-option' + (disabled ? " disabled" : "") + '">' +
          '<input type="radio" name="courier" value="' + opt.key + '"' + (disabled ? " disabled" : "") + (i === 0 && !disabled ? " checked" : "") + '>' +
          '<span><span class="courier-name">' + opt.name + '</span><br><span class="courier-note">' + opt.note + '</span></span>' +
          (opt.tag ? '<span class="courier-tag' + (disabled ? " todo" : "") + '">' + opt.tag + '</span>' : (disabled ? '<span class="courier-tag todo">Not eligible</span>' : "")) +
          '</label>';
      }).join("");
    }
    renderCouriers();

    /* Within-Mysuru delivery choice: courier vs Swiggy/Zomato/store pickup.
       Only offered for Mysuru pincodes (570xxx); partners come from the
       admin-managed list so adding one there shows up here immediately. */
    function updateDeliveryMethodView() {
      if (courierPanel) courierPanel.hidden = deliveryMethod !== "courier";
      if (!deliveryMethodNote) return;
      if (deliveryMethod === "courier") {
        deliveryMethodNote.innerHTML = "";
      } else if (deliveryMethod === "Store Pickup") {
        deliveryMethodNote.innerHTML = '<div class="demo-note">Pick up at Devaraja Market, Mysuru — no delivery charge. We will notify you here when it is ready.</div>';
      } else {
        deliveryMethodNote.innerHTML = '<div class="demo-note">Prices may vary on ' + escapeHtml(deliveryMethod) + '. In the real build this would hand off to the ' + escapeHtml(deliveryMethod) + ' app to complete the order there — this demo just records the choice.</div>';
      }
    }
    function renderDeliveryMethods() {
      var pin = pincodeInput ? pincodeInput.value.trim() : "";
      var isMysuru = /^570\d{3}$/.test(pin);
      if (!deliveryMethodPanel) return;
      if (!isMysuru) {
        deliveryMethodPanel.hidden = true;
        deliveryMethod = "courier";
        updateDeliveryMethodView();
        return;
      }
      deliveryMethodPanel.hidden = false;
      var partners = (window.GSMInventory ? window.GSMInventory.getPartners() : ["Swiggy", "Zomato"]);
      var methods = ["Courier"].concat(partners, ["Store Pickup"]);
      deliveryMethodRow.innerHTML = methods.map(function (m) {
        var value = m === "Courier" ? "courier" : m;
        var pressed = deliveryMethod === value;
        return '<button type="button" data-method="' + escapeHtml(value) + '" aria-pressed="' + pressed + '">' + escapeHtml(m) + '</button>';
      }).join("");
      updateDeliveryMethodView();
    }
    if (deliveryMethodRow) {
      deliveryMethodRow.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-method]");
        if (!btn) return;
        deliveryMethod = btn.dataset.method;
        deliveryMethodRow.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        updateDeliveryMethodView();
      });
    }
    renderDeliveryMethods();
    if (pincodeInput) pincodeInput.addEventListener("input", function () { renderCouriers(); renderDeliveryMethods(); });

    /* ---- validation + open Razorpay placeholder ---- */
    var modal = document.querySelector("[data-pay-modal]");
    var payView = modal.querySelector("[data-pay-view]");
    var successView = modal.querySelector("[data-pay-success]");
    var failView = modal.querySelector("[data-pay-fail]");
    var amountEl = modal.querySelector("[data-pay-amount]");

    function showModal() {
      amountEl.textContent = formatINR(subtotal);
      payView.style.display = "";
      successView.classList.remove("show");
      failView.classList.remove("show");
      modal.classList.add("open");
    }
    function closeModal() { modal.classList.remove("open"); }

    function fieldValid(name) {
      var el = root.querySelector('[name="' + name + '"]');
      var wrap = el.closest(".field");
      var ok = el.value.trim().length > 1;
      if (name === "phone") ok = /^\d{10}$/.test(el.value.trim());
      if (name === "pincode") ok = /^\d{6}$/.test(el.value.trim());
      wrap.classList.toggle("invalid", !ok);
      return ok;
    }

    if (payBtn) {
      payBtn.addEventListener("click", function () {
        var fields = ["name", "phone", "address", "pincode"];
        var allOk = fields.map(fieldValid).every(Boolean);
        var courierChosen = deliveryMethod !== "courier" || root.querySelector('input[name="courier"]:checked');
        if (!allOk || !courierChosen) {
          if (!courierChosen) alert("Please choose a courier for your pincode.");
          return;
        }
        showModal();
      });
    }

    modal.querySelectorAll("[data-close-modal]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    modal.querySelector("[data-sim-success]").addEventListener("click", function () {
      var courierInfo;
      if (deliveryMethod === "courier") {
        var courierChosen = root.querySelector('input[name="courier"]:checked');
        var courierOpt = courierOptionsForPincode(pincodeInput.value).filter(function (o) { return o.key === courierChosen.value; })[0];
        courierInfo = { name: courierOpt.name, note: courierOpt.note };
      } else if (deliveryMethod === "Store Pickup") {
        courierInfo = { name: "Store Pickup", note: "Collect at Devaraja Market, Mysuru" };
      } else {
        courierInfo = { name: deliveryMethod + " (within Mysuru)", note: "Completed via the " + deliveryMethod + " app — prices may vary" };
      }
      var order = {
        id: newOrderId(),
        placedAt: new Date().toISOString(),
        customer: {
          name: root.querySelector('[name="name"]').value.trim(),
          phone: root.querySelector('[name="phone"]').value.trim(),
          address: root.querySelector('[name="address"]').value.trim(),
          pincode: root.querySelector('[name="pincode"]').value.trim()
        },
        items: cart,
        subtotal: subtotal,
        courier: courierInfo,
        status: "paid",
        packBy: packingEstimate()
      };
      var orders = readOrders();
      orders.unshift(order);
      writeOrders(orders);
      writeCartItems([]);
      notifyStatus(order);

      payView.style.display = "none";
      successView.classList.add("show");
      successView.querySelector("[data-success-order-id]").textContent = order.id;
      successView.querySelector("[data-success-link]").href = "order-confirmation.html?order=" + encodeURIComponent(order.id);
    });

    modal.querySelector("[data-sim-fail]").addEventListener("click", function () {
      payView.style.display = "none";
      failView.classList.add("show");
    });

    var retryBtn = modal.querySelector("[data-retry-pay]");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        failView.classList.remove("show");
        payView.style.display = "";
      });
    }
  }

  /* =========================================================
     Order confirmation / tracking page
     ========================================================= */
  function initConfirmationPage() {
    var root = document.querySelector("[data-confirm-page]");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var orderId = params.get("order");
    var lookupWrap = root.querySelector("[data-order-lookup]");
    var detailWrap = root.querySelector("[data-order-detail]");

    function findOrder(id) {
      return readOrders().filter(function (o) { return o.id === id; })[0];
    }

    function renderStages(status) {
      var idx = STAGES.indexOf(status);
      return '<div class="stage-track" data-stage-track>' + STAGES.map(function (s, i) {
        var cls = i < idx ? "done" : (i === idx ? "current" : "");
        return '<div class="stage ' + cls + '"><div class="dot">' + (i + 1) + '</div>' + STAGE_LABELS[s] + '</div>';
      }).join("") + '</div>';
    }

    function renderOrder(order) {
      lookupWrap.hidden = true;
      detailWrap.hidden = false;
      detailWrap.innerHTML =
        '<div class="panel" style="text-align:center;">' +
          '<p class="eyebrow" style="justify-content:center;">Order placed</p>' +
          '<div class="order-id-display">' + order.id + '</div>' +
          '<p class="status-line" style="margin-top:6px;"><span class="status-pill" data-status="' + order.status + '">' + STAGE_LABELS[order.status] + '</span></p>' +
          renderStages(order.status) +
          '<button class="btn btn-teal btn-block" data-sim-next-status style="margin-top:20px;" ' + (order.status === "delivered" ? "disabled" : "") + '>' +
            (order.status === "delivered" ? "Delivered" : "Simulate next status →") +
          '</button>' +
          '<p class="desc" style="font-size:0.72rem;margin-top:10px;">Demo only — simulates the admin panel moving this order forward. No real order or courier booking exists.</p>' +
        '</div>' +
        '<div class="panel">' +
          '<h3>Order details</h3>' +
          '<div class="summary-row"><span>Customer</span><span>' + escapeHtml(order.customer.name) + ' · ' + escapeHtml(order.customer.phone) + '</span></div>' +
          '<div class="summary-row"><span>Deliver to</span><span>' + escapeHtml(order.customer.address) + ', ' + escapeHtml(order.customer.pincode) + '</span></div>' +
          '<div class="summary-row"><span>Courier</span><span>' + escapeHtml(order.courier.name) + '</span></div>' +
          '<div class="summary-row"><span>Packing estimate</span><span>' + escapeHtml(order.packBy) + '</span></div>' +
          '<div class="motif-divider" aria-hidden="true">✦</div>' +
          order.items.map(function (it) {
            return '<div class="summary-row"><span>' + it.qty + '× ' + escapeHtml(it.name) + ' (' + escapeHtml(it.weight) + ')</span><span>' + formatINR(it.price * it.qty) + '</span></div>';
          }).join("") +
          '<div class="summary-row total"><span>Total paid</span><span>' + formatINR(order.subtotal) + '</span></div>' +
        '</div>' +
        '<div class="panel">' +
          '<button type="button" class="link-btn" data-toggle-wa>Preview the WhatsApp message sent to our packing team ▾</button>' +
          '<div class="whatsapp-preview" style="margin-top:12px;display:none;" data-wa-box>' +
            '<div class="whatsapp-preview-head">Packing WhatsApp — demo preview</div>' + escapeHtml(whatsappMessageFor(order)) +
          '</div>' +
        '</div>';

      detailWrap.querySelector("[data-toggle-wa]").addEventListener("click", function (btn) {
        var box = detailWrap.querySelector("[data-wa-box]");
        var showing = box.style.display !== "none";
        box.style.display = showing ? "none" : "block";
      });

      var nextBtn = detailWrap.querySelector("[data-sim-next-status]");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          var orders = readOrders();
          var current = orders.filter(function (o) { return o.id === order.id; })[0];
          var idx = STAGES.indexOf(current.status);
          if (idx < STAGES.length - 1) current.status = STAGES[idx + 1];
          writeOrders(orders);
          notifyStatus(current);
          renderOrder(current);
        });
      }
    }

    function renderLookup(notFoundId) {
      detailWrap.hidden = true;
      lookupWrap.hidden = false;
      lookupWrap.querySelector("[data-lookup-error]").textContent = notFoundId ? ("No order found for " + notFoundId + ".") : "";
    }

    var lookupForm = lookupWrap.querySelector("[data-lookup-form]");
    if (lookupForm) {
      lookupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var id = lookupForm.querySelector("input").value.trim();
        var order = findOrder(id);
        if (order) {
          window.history.replaceState(null, "", "order-confirmation.html?order=" + encodeURIComponent(id));
          renderOrder(order);
        } else {
          renderLookup(id);
        }
      });
    }

    if (orderId) {
      var order = findOrder(orderId);
      if (order) renderOrder(order); else renderLookup(orderId);
    } else {
      renderLookup(null);
    }
  }

  /* =========================================================
     Admin panel (mock)
     ========================================================= */
  function initAdminPage() {
    var root = document.querySelector("[data-admin-page]");
    if (!root) return;

    var statsEl = root.querySelector("[data-admin-stats]");
    var tbody = root.querySelector("[data-admin-rows]");
    var resetBtn = root.querySelector("[data-reset-demo]");

    function isToday(iso) {
      var d = new Date(iso), t = new Date();
      return d.toDateString() === t.toDateString();
    }

    function render() {
      var orders = readOrders();
      var todays = orders.filter(function (o) { return isToday(o.placedAt); });
      var todaysSales = todays.reduce(function (s, o) { return s + o.subtotal; }, 0);
      var pending = orders.filter(function (o) { return o.status === "paid" || o.status === "packed"; }).length;

      statsEl.innerHTML =
        '<div class="admin-stat"><div class="num">' + todays.length + '</div><div class="lbl">Orders today</div></div>' +
        '<div class="admin-stat"><div class="num">' + formatINR(todaysSales) + '</div><div class="lbl">Sales today</div></div>' +
        '<div class="admin-stat"><div class="num">' + pending + '</div><div class="lbl">Pending packing/dispatch</div></div>' +
        '<div class="admin-stat"><div class="num">' + orders.length + '</div><div class="lbl">Total demo orders</div></div>';

      if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;">No orders yet. Place one from the <a href="shop.html">shop</a> to see it here.</td></tr>';
        return;
      }

      tbody.innerHTML = orders.map(function (o, idx) {
        var itemsText = o.items.map(function (it) { return it.qty + "× " + it.name; }).join(", ");
        return '<tr>' +
          '<td><strong>' + o.id + '</strong><br><span class="meta" style="color:var(--ink-soft);font-size:0.76rem;">' + new Date(o.placedAt).toLocaleString("en-IN") + '</span></td>' +
          '<td>' + escapeHtml(o.customer.name) + '<br><span style="color:var(--ink-soft);font-size:0.78rem;">' + escapeHtml(o.customer.phone) + '</span></td>' +
          '<td>' + escapeHtml(itemsText) + '</td>' +
          '<td>' + formatINR(o.subtotal) + '</td>' +
          '<td>' + escapeHtml(o.courier.name) + '</td>' +
          '<td><select class="status-select" data-status-select="' + idx + '">' +
            STAGES.map(function (s) { return '<option value="' + s + '"' + (s === o.status ? " selected" : "") + '>' + STAGE_LABELS[s] + '</option>'; }).join("") +
          '</select></td>' +
          '<td><button type="button" class="link-btn" data-view-wa="' + idx + '">WhatsApp msg</button></td>' +
          '</tr>';
      }).join("");
    }

    root.addEventListener("change", function (event) {
      var sel = event.target.closest("[data-status-select]");
      if (!sel) return;
      var orders = readOrders();
      orders[+sel.dataset.statusSelect].status = sel.value;
      writeOrders(orders);
      notifyStatus(orders[+sel.dataset.statusSelect]);
      render();
    });

    root.addEventListener("click", function (event) {
      var waBtn = event.target.closest("[data-view-wa]");
      if (waBtn) {
        var order = readOrders()[+waBtn.dataset.viewWa];
        alert(whatsappMessageFor(order));
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Clear all demo orders and cart data? This only affects this browser.")) return;
        localStorage.removeItem("gsm_demo_orders");
        localStorage.removeItem("gsm_demo_cart_items");
        localStorage.removeItem("gsm_demo_cart_count");
        render();
      });
    }

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCartPage();
    initCheckoutPage();
    initConfirmationPage();
    initAdminPage();
    initNotifBanner();
  });
})();
