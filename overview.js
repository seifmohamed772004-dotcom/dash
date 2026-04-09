/**
 * Overview page — render subscriptions, tags, stats; nav overlay
 */
(function () {
  "use strict";

  var plans = [
    { name: "Premium", price: "+99$" },
    { name: "Plus", price: "+50$" },
    { name: "Starter", price: "+20$" },
  ];

  var FALLBACK_TAGS = ["UX/UI", "MARKETING", "MUSICPROD", "UX/UI"];

  function getData(key) {
    if (window.AppStorage && typeof window.AppStorage.getData === "function") {
      return window.AppStorage.getData(key);
    }
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function formatInt(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function displayName(user, index) {
    if (user.name && String(user.name).trim()) {
      return String(user.name).trim().toUpperCase();
    }
    var email = user.email || "user" + index;
    var local = String(email).split("@")[0] || "user";
    var parts = local.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
    if (parts.length === 0) return "USER";
    return parts
      .map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join(" ")
      .toUpperCase();
  }

  function planForUser(user, index) {
    if (user.plan && user.subscriptionPrice) {
      return { name: user.plan, price: user.subscriptionPrice };
    }
    if (user.plan && user.price) {
      return { name: user.plan, price: user.price };
    }
    var p = plans[index % plans.length];
    return { name: p.name, price: p.price };
  }

  function avatarUrl(name) {
    var enc = encodeURIComponent(name || "User");
    return (
      "https://ui-avatars.com/api/?name=" +
      enc +
      "&size=88&background=2a2a2a&color=eeeeee&bold=true"
    );
  }

  function renderSubscriptions() {
    var container = document.getElementById("subs-list");
    var emptyEl = document.getElementById("subs-empty");
    if (!container || !emptyEl) return;

    var users = getData("users");
    container.innerHTML = "";

    if (!users.length) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;

    users.forEach(function (user, index) {
      var plan = planForUser(user, index);
      var name = displayName(user, index);
      var item = document.createElement("div");
      item.className = "subs-item";
      item.setAttribute("role", "listitem");

      var img = document.createElement("img");
      img.className = "subs-item__avatar";
      img.src = user.avatarUrl || avatarUrl(name);
      img.alt = "";
      img.width = 44;
      img.height = 44;
      img.loading = "lazy";

      var info = document.createElement("div");
      info.className = "subs-item__info";

      var nameEl = document.createElement("span");
      nameEl.className = "subs-item__name";
      nameEl.textContent = name;

      var planEl = document.createElement("span");
      planEl.className = "subs-item__plan";
      planEl.textContent = plan.name + " Plan";

      info.appendChild(nameEl);
      info.appendChild(planEl);

      var price = document.createElement("span");
      price.className = "subs-item__price";
      price.textContent = plan.price;

      item.appendChild(img);
      item.appendChild(info);
      item.appendChild(price);
      container.appendChild(item);
    });
  }

  function renderStats() {
    var totalEl = document.getElementById("stat-total");
    if (!totalEl) return;
    var users = getData("users");
    totalEl.textContent = formatInt(Math.max(users.length, 0));
  }

  function renderTags() {
    var list = document.getElementById("tags-list");
    if (!list) return;

    var raw = localStorage.getItem("tags");
    var tags = FALLBACK_TAGS;

    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          tags = parsed.map(function (t) {
            if (typeof t === "string") return t.toUpperCase();
            if (t && t.name) return String(t.name).toUpperCase();
            return String(t).toUpperCase();
          });
        }
      } catch {
        tags = FALLBACK_TAGS;
      }
    }

    list.innerHTML = "";
    tags.forEach(function (tag) {
      var li = document.createElement("li");
      li.textContent = tag;
      list.appendChild(li);
    });
  }

  function initNavOverlay() {
    var overlay = document.getElementById("nav-overlay");
    var openBtn = document.getElementById("nav-open");
    var closeBtn = document.getElementById("nav-close");
    var backdrop = document.getElementById("nav-backdrop");

    if (!overlay || !openBtn) return;

    function openNav() {
      overlay.hidden = false;
      overlay.classList.add("nav-overlay--open");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeNav() {
      overlay.hidden = true;
      overlay.classList.remove("nav-overlay--open");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      openBtn.focus();
    }

    openBtn.addEventListener("click", function () {
      if (overlay.hidden) openNav();
      else closeNav();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeNav);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeNav);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) {
        closeNav();
      }
    });

    overlay.querySelectorAll(".nav-overlay__link").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });
  }

  function init() {
    renderSubscriptions();
    renderStats();
    renderTags();
    initNavOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
