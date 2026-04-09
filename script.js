/**
 * Main app script — storage, login, overview dashboard, nav overlay
 */
(function () {
  "use strict";

  window.NavOverlay = {
    openMenu: function () {},
    closeMenu: function () {},
    toggleMenu: function () {},
  };

  var NAV_OVERLAY_HTML =
    '<div id="nav-overlay" class="nav-overlay" hidden role="dialog" aria-modal="true" aria-hidden="true" aria-label="Site navigation">' +
    '<div class="nav-overlay__backdrop" data-nav-overlay-backdrop></div>' +
    '<div class="nav-overlay__panel">' +
    '<header class="nav-overlay__topbar">' +
    '<a href="overview.html" class="nav-overlay__logo">CREESTUDIOS</a>' +
    '<button type="button" class="nav-overlay__close" id="nav-overlay-close-btn" aria-label="Close menu">' +
    '<span class="nav-overlay__close-icon" aria-hidden="true"></span>' +
    "</button>" +
    "</header>" +
    '<nav class="nav-overlay__links" aria-label="Primary">' +
    '<a href="overview.html" class="nav-overlay__link">Overview</a>' +
    '<a href="posts.html" class="nav-overlay__link">All Posts</a>' +
    '<a href="add-page.html" class="nav-overlay__link">Add Page</a>' +
    '<a href="pages.html" class="nav-overlay__link">All Pages</a>' +
    '<a href="users.html" class="nav-overlay__link">All Users</a>' +
    '<a href="media.html" class="nav-overlay__link">Media Library</a>' +
    '<a href="features.html" class="nav-overlay__link">Features</a>' +
    '<a href="analytics.html" class="nav-overlay__link">Analytics</a>' +
    '<a href="notifications.html" class="nav-overlay__link">Notifications</a>' +
    '<a href="reports.html" class="nav-overlay__link">Reports</a>' +
    '<a href="faq.html" class="nav-overlay__link">FAQ</a>' +
    '<a href="settings.html" class="nav-overlay__link">Settings</a>' +
    '<a href="help.html" class="nav-overlay__link">Help Page</a>' +
    '<a href="privacy.html" class="nav-overlay__link">Privacy &amp; Policy</a>' +
    "</nav>" +
    '<button type="button" class="nav-overlay__logout" id="nav-overlay-logout">Logout</button>' +
    "</div>" +
    "</div>";

  function getData(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  window.AppStorage = {
    getData: getData,
    saveData: saveData,
  };

  var DEFAULT_ADMIN_EMAIL = "seifmohamed772004@gmail.com";
  var DEFAULT_ADMIN_PASSWORD = "772004";

  function ensureDefaultAdminUser() {
    var users = getData("users");
    var lower = DEFAULT_ADMIN_EMAIL.toLowerCase();
    var i = users.findIndex(function (u) {
      return u.email && String(u.email).toLowerCase() === lower;
    });
    if (i === -1) {
      users.push({
        id: "default-admin-001",
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        createdAt: new Date().toISOString(),
      });
    } else {
      users[i].password = DEFAULT_ADMIN_PASSWORD;
      if (!users[i].id) users[i].id = "default-admin-001";
      if (!users[i].createdAt) {
        users[i].createdAt = new Date().toISOString();
      }
    }
    saveData("users", users);
  }

  function initLoginPage() {
    var form = document.getElementById("login-form");
    if (!form) return;

    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var rememberCheckbox = document.getElementById("remember");
    var emailError = document.getElementById("email-error");
    var passwordError = document.getElementById("password-error");
    var formError = document.getElementById("form-error");
    var btnSubmit = document.getElementById("btn-submit");
    var togglePassword = document.getElementById("toggle-password");
    var forgotLink = document.getElementById("forgot-link");
    var btnGoogle = document.getElementById("btn-google");

    if (
      !emailInput ||
      !passwordInput ||
      !emailError ||
      !passwordError ||
      !formError ||
      !btnSubmit
    ) {
      return;
    }

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function hideFormError() {
      formError.textContent = "";
      formError.hidden = true;
    }

    function showFormError(message) {
      formError.textContent = message;
      formError.hidden = false;
    }

    function setFieldError(el, input, message) {
      if (message) {
        el.textContent = message;
        el.hidden = false;
        input.setAttribute("aria-invalid", "true");
      } else {
        el.textContent = "";
        el.hidden = true;
        input.setAttribute("aria-invalid", "false");
      }
    }

    function validateEmail() {
      var v = emailInput.value.trim();
      if (!v) {
        setFieldError(emailError, emailInput, "Email is required.");
        return false;
      }
      if (!EMAIL_RE.test(v)) {
        setFieldError(emailError, emailInput, "Enter a valid email address.");
        return false;
      }
      setFieldError(emailError, emailInput, "");
      return true;
    }

    function validatePassword() {
      var v = passwordInput.value;
      if (!v) {
        setFieldError(passwordError, passwordInput, "Password is required.");
        return false;
      }
      if (v.length < 6) {
        setFieldError(
          passwordError,
          passwordInput,
          "Password must be at least 6 characters."
        );
        return false;
      }
      setFieldError(passwordError, passwordInput, "");
      return true;
    }

    function validateForm() {
      return validateEmail() && validatePassword();
    }

    emailInput.addEventListener("blur", function () {
      if (emailInput.value.trim()) validateEmail();
    });

    emailInput.addEventListener("input", function () {
      if (
        !emailError.hidden ||
        emailInput.getAttribute("aria-invalid") === "true"
      ) {
        validateEmail();
      }
      hideFormError();
    });

    passwordInput.addEventListener("blur", function () {
      if (passwordInput.value) validatePassword();
    });

    passwordInput.addEventListener("input", function () {
      if (
        !passwordError.hidden ||
        passwordInput.getAttribute("aria-invalid") === "true"
      ) {
        validatePassword();
      }
      hideFormError();
    });

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", function () {
        var visible = passwordInput.type === "text";
        passwordInput.type = visible ? "password" : "text";
        togglePassword.classList.toggle("is-visible", !visible);
        togglePassword.setAttribute(
          "aria-label",
          visible ? "Show password" : "Hide password"
        );
        togglePassword.setAttribute("aria-pressed", visible ? "false" : "true");
      });
    }

    if (forgotLink) {
      forgotLink.addEventListener("click", function (e) {
        e.preventDefault();
      });
    }

    if (btnGoogle) {
      btnGoogle.addEventListener("click", function () {
        showFormError("Google sign-in is not configured.");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideFormError();

      if (!validateForm()) {
        return;
      }

      btnSubmit.disabled = true;

      var email = emailInput.value.trim().toLowerCase();
      var password = passwordInput.value;
      var users = getData("users");
      var user = users.find(function (u) {
        return (u.email && String(u.email).toLowerCase()) === email;
      });

      if (!user) {
        showFormError("User not found");
        btnSubmit.disabled = false;
        return;
      }

      if (user.password !== password) {
        showFormError("Incorrect password");
        btnSubmit.disabled = false;
        return;
      }

      var session = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        rememberMe: !!(rememberCheckbox && rememberCheckbox.checked),
      };

      try {
        localStorage.setItem("currentUser", JSON.stringify(session));
      } catch (err) {
        showFormError("Could not save session. Check storage permissions.");
        btnSubmit.disabled = false;
        return;
      }

      window.location.href = "overview.html";
    });
  }

  var plans = [
    { name: "Premium", price: "+99$" },
    { name: "Plus", price: "+50$" },
    { name: "Starter", price: "+20$" },
  ];

  var FALLBACK_TAGS = ["UX/UI", "MARKETING", "MUSICPROD", "UX/UI"];

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

  function initOverviewPage() {
    renderSubscriptions();
    renderStats();
    renderTags();
  }

  var navOverlay = null;
  var navOpenBtn = null;
  var navCloseTimer = null;

  function currentPageFile() {
    var p = window.location.pathname || "";
    var seg = p.split("/").pop();
    if (!seg || seg === "") return "index.html";
    return seg.split("?")[0];
  }

  function setNavActiveLink() {
    if (!navOverlay) return;
    var page = currentPageFile();
    navOverlay.querySelectorAll(".nav-overlay__link").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var file = href.split("/").pop() || "";
      a.classList.toggle("is-active", file === page);
    });
  }

  function getNavFocusable() {
    if (!navOverlay) return [];
    return Array.prototype.slice.call(
      navOverlay.querySelectorAll(
        'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])'
      )
    );
  }

  function onNavDocKeydown(e) {
    if (!navOverlay || !navOverlay.classList.contains("active")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key !== "Tab") return;

    var items = getNavFocusable();
    if (items.length === 0) return;

    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;

    if (!navOverlay.contains(active)) {
      e.preventDefault();
      first.focus();
      return;
    }

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openMenu() {
    if (!navOverlay) return;

    navOverlay.removeAttribute("hidden");
    navOverlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onNavDocKeydown);

    if (navOpenBtn) {
      navOpenBtn.setAttribute("aria-expanded", "true");
      navOpenBtn.classList.add("is-open");
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        navOverlay.classList.add("active");
      });
    });

    var firstLink = navOverlay.querySelector(".nav-overlay__link");
    if (firstLink) {
      setTimeout(function () {
        firstLink.focus();
      }, 50);
    }
  }

  function closeMenu() {
    if (!navOverlay) return;

    navOverlay.classList.remove("active");
    navOverlay.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    document.removeEventListener("keydown", onNavDocKeydown);

    if (navOpenBtn) {
      navOpenBtn.setAttribute("aria-expanded", "false");
      navOpenBtn.classList.remove("is-open");
      navOpenBtn.focus();
    }

    clearTimeout(navCloseTimer);

    var finished = false;
    function onTransitionEnd(ev) {
      if (ev.target !== navOverlay || ev.propertyName !== "opacity") return;
      navOverlay.removeEventListener("transitionend", onTransitionEnd);
      if (finished) return;
      finished = true;
      navOverlay.setAttribute("hidden", "");
    }

    navOverlay.addEventListener("transitionend", onTransitionEnd);
    navCloseTimer = setTimeout(function () {
      navOverlay.removeEventListener("transitionend", onTransitionEnd);
      if (!finished) {
        finished = true;
        navOverlay.setAttribute("hidden", "");
      }
    }, 400);
  }

  function toggleMenu() {
    if (!navOverlay) return;
    if (navOverlay.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function wireNavLogout() {
    var btn = document.getElementById("nav-overlay-logout");
    if (!btn) return;
    btn.addEventListener("click", function () {
      try {
        localStorage.removeItem("currentUser");
      } catch (e) {}
      window.location.href = "index.html";
    });
  }

  function bindNavOverlay() {
    navOverlay = document.getElementById("nav-overlay");
    navOpenBtn = document.getElementById("nav-open");

    if (!navOverlay) return;

    var closeBtn = document.getElementById("nav-overlay-close-btn");
    var backdrop = navOverlay.querySelector("[data-nav-overlay-backdrop]");

    setNavActiveLink();

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }

    if (navOpenBtn) {
      navOpenBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleMenu();
      });
    }

    navOverlay.querySelectorAll(".nav-overlay__link").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    wireNavLogout();

    window.NavOverlay = {
      openMenu: openMenu,
      closeMenu: closeMenu,
      toggleMenu: toggleMenu,
    };
  }

  function injectNavOverlay() {
    var container = document.getElementById("nav-overlay-container");
    if (!container) {
      return;
    }

    container.innerHTML = NAV_OVERLAY_HTML;
    bindNavOverlay();
  }

  function initApp() {
    ensureDefaultAdminUser();
    initLoginPage();
    initOverviewPage();
    injectNavOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();

