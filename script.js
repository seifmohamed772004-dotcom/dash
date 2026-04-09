/**
 * Main app script — storage, login, overview, posts, post inner, users, notifications, nav overlay
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
      img.src = user.avatar || user.avatarUrl || avatarUrl(name);
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

  var postsPageSize = 5;
  var postsListPage = 1;
  var postsOpenMenuId = null;
  var postsPendingDeleteId = null;
  var postsToastTimer = null;
  var POST_CATEGORIES = ["Branding", "UX/UI", "Marketing", "Development"];

  function postNewId() {
    return "post-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function ensureDummyPosts() {
    if (localStorage.getItem("posts") !== null) return;

    var now = new Date();
    var demo = [
      {
        id: postNewId(),
        title: "LUNA STUDIO — BRAND IDENTITY",
        description:
          "A seasoned graphic designer with 13 years of experience crafting visual stories.",
        category: "Branding",
        image: "https://picsum.photos/seed/luna/240/160",
        date: "2026-02-27",
        createdAt: now.toISOString(),
      },
      {
        id: postNewId(),
        title: "NORTHWAVE — WEB EXPERIENCE",
        description:
          "End-to-end product design for a music streaming platform focused on discovery.",
        category: "UX/UI",
        image: "https://picsum.photos/seed/north/240/160",
        date: "2026-02-20",
        createdAt: now.toISOString(),
      },
      {
        id: postNewId(),
        title: "CREST AGENCY — CAMPAIGN 2026",
        description:
          "Cross-channel marketing campaign with motion and social-first assets.",
        category: "Marketing",
        image: "https://picsum.photos/seed/crest/240/160",
        date: "2026-02-15",
        createdAt: now.toISOString(),
      },
      {
        id: postNewId(),
        title: "API GATEWAY — TECH NOTE",
        description:
          "Internal dashboard for monitoring latency and error rates across services.",
        category: "Development",
        image: "https://picsum.photos/seed/api/240/160",
        date: "2026-02-10",
        createdAt: now.toISOString(),
      },
      {
        id: postNewId(),
        title: "ECHO — MOBILE PROTOTYPE",
        description:
          "High-fidelity prototype for onboarding flows and accessibility review.",
        category: "UX/UI",
        image: "https://picsum.photos/seed/echo/240/160",
        date: "2026-02-05",
        createdAt: now.toISOString(),
      },
    ];

    try {
      saveData("posts", demo);
    } catch (e) {
      console.error(e);
    }
  }

  function formatPostDisplayDate(isoOrStr) {
    if (!isoOrStr) return "";
    var d;
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrStr)) {
      var p = isoOrStr.split("-");
      d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    } else {
      d = new Date(isoOrStr);
    }
    if (isNaN(d.getTime())) return isoOrStr;
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  }

  function filterPostsArray(all, q, dateVal, catVal) {
    q = (q || "").trim().toLowerCase();
    dateVal = dateVal || "";
    catVal = catVal || "";
    return all.filter(function (p) {
      var title = (p.title || "").toLowerCase();
      if (q && title.indexOf(q) === -1) return false;
      if (dateVal && (p.date || "").slice(0, 10) !== dateVal) return false;
      if (catVal && (p.category || "") !== catVal) return false;
      return true;
    });
  }

  function filterPostsListWithIds(all, nameId, dateId, catId) {
    var nameEl = document.getElementById(nameId || "filter-name");
    var dateEl = document.getElementById(dateId || "filter-date");
    var catEl = document.getElementById(catId || "filter-category");
    return filterPostsArray(
      all,
      nameEl && nameEl.value,
      dateEl && dateEl.value,
      catEl && catEl.value
    );
  }

  function filterPostsList(all) {
    return filterPostsListWithIds(all, "filter-name", "filter-date", "filter-category");
  }

  function applyPostsPagination(filtered) {
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / postsPageSize) || 1);
    if (postsListPage > pages) postsListPage = pages;
    if (postsListPage < 1) postsListPage = 1;

    var start = (postsListPage - 1) * postsPageSize;
    var slice = filtered.slice(start, start + postsPageSize);

    return { slice: slice, total: total, pages: pages };
  }

  function closeAllPostMenus() {
    document.querySelectorAll(".post-row__dropdown").forEach(function (el) {
      el.hidden = true;
    });
    document.querySelectorAll(".post-row__kebab").forEach(function (btn) {
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
    postsOpenMenuId = null;
  }

  function togglePostMenu(postId, btn, dropdown) {
    var isOpen = postsOpenMenuId === postId && !dropdown.hidden;
    closeAllPostMenus();
    if (!isOpen) {
      dropdown.hidden = false;
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      postsOpenMenuId = postId;
    }
  }

  function showPostsToast(message) {
    var el = document.getElementById("posts-toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(postsToastTimer);
    postsToastTimer = setTimeout(function () {
      el.hidden = true;
    }, 3200);
  }

  function openPostDeleteModal(postId) {
    postsPendingDeleteId = postId;
    var modal = document.getElementById("delete-modal");
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var confirmBtn = document.getElementById("delete-modal-confirm");
      if (confirmBtn) confirmBtn.focus();
    }
  }

  function closePostDeleteModal() {
    postsPendingDeleteId = null;
    var modal = document.getElementById("delete-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function deletePostById(postId) {
    var posts = getData("posts");
    var next = posts.filter(function (p) {
      return p.id !== postId;
    });
    try {
      saveData("posts", next);
      showPostsToast("Post deleted");
      closeAllPostMenus();
      renderPostsList();
    } catch (e) {
      showPostsToast("Could not save changes. Check storage.");
    }
  }

  function renderPostsList() {
    var listEl = document.getElementById("posts-list");
    var emptyEl = document.getElementById("posts-empty");
    var infoEl = document.getElementById("posts-page-info");
    var prevBtn = document.getElementById("page-prev");
    var nextBtn = document.getElementById("page-next");

    if (!listEl || !emptyEl) return;

    var all = getData("posts");
    var filtered = filterPostsList(all);
    var result = applyPostsPagination(filtered);
    var slice = result.slice;

    closeAllPostMenus();

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      if (infoEl) infoEl.textContent = "";
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    emptyEl.hidden = true;

    if (infoEl) {
      var start = (postsListPage - 1) * postsPageSize + 1;
      var end = Math.min(postsListPage * postsPageSize, result.total);
      infoEl.textContent =
        "Showing " +
        start +
        "–" +
        end +
        " of " +
        result.total +
        (result.pages > 1
          ? " · Page " + postsListPage + " / " + result.pages
          : "");
    }

    if (prevBtn) prevBtn.disabled = postsListPage <= 1;
    if (nextBtn) nextBtn.disabled = postsListPage >= result.pages;

    listEl.innerHTML = "";
    slice.forEach(function (post) {
      var article = document.createElement("article");
      article.className = "post-row";
      article.setAttribute("data-post-id", post.id);

      var img = document.createElement("img");
      img.className = "post-row__thumb";
      img.src = post.image || "https://picsum.photos/seed/nothumb/240/160";
      img.alt = "";
      img.width = 112;
      img.height = 72;
      img.loading = "lazy";

      var body = document.createElement("div");
      body.className = "post-row__body";

      var h3 = document.createElement("h3");
      h3.className = "post-row__title";
      h3.textContent = post.title || "Untitled";

      var p = document.createElement("p");
      p.className = "post-row__desc";
      p.textContent = post.description || "";

      var time = document.createElement("time");
      time.className = "post-row__date";
      time.dateTime = post.date || "";
      time.textContent = formatPostDisplayDate(post.date);

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(time);

      var actions = document.createElement("div");
      actions.className = "post-row__actions";

      var kebab = document.createElement("button");
      kebab.type = "button";
      kebab.className = "post-row__kebab";
      kebab.setAttribute("aria-label", "Post actions");
      kebab.setAttribute("aria-expanded", "false");
      kebab.setAttribute("aria-haspopup", "true");
      kebab.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

      var dropdown = document.createElement("div");
      dropdown.className = "post-row__dropdown";
      dropdown.hidden = true;
      dropdown.setAttribute("role", "menu");

      var btnView = document.createElement("button");
      btnView.type = "button";
      btnView.setAttribute("role", "menuitem");
      btnView.textContent = "View";
      btnView.addEventListener("click", function () {
        window.location.href =
          "post.html?id=" + encodeURIComponent(post.id);
      });

      var aEdit = document.createElement("a");
      aEdit.href = "edit-post.html?id=" + encodeURIComponent(post.id);
      aEdit.setAttribute("role", "menuitem");
      aEdit.textContent = "Edit";

      var btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "posts-menu-danger";
      btnDel.setAttribute("role", "menuitem");
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", function () {
        closeAllPostMenus();
        openPostDeleteModal(post.id);
      });

      dropdown.appendChild(btnView);
      dropdown.appendChild(aEdit);
      dropdown.appendChild(btnDel);

      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      kebab.addEventListener("click", function (e) {
        e.stopPropagation();
        togglePostMenu(post.id, kebab, dropdown);
      });

      actions.appendChild(kebab);
      actions.appendChild(dropdown);

      article.appendChild(img);
      article.appendChild(body);
      article.appendChild(actions);
      listEl.appendChild(article);
    });
  }

  function populatePostCategorySelect(targetId) {
    var sel = document.getElementById(targetId || "filter-category");
    if (!sel) return;
    sel.innerHTML = "";
    var opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "All categories";
    sel.appendChild(opt0);
    POST_CATEGORIES.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c;
      o.textContent = c;
      sel.appendChild(o);
    });
  }

  function bindPostFilters() {
    var nameEl = document.getElementById("filter-name");
    var dateEl = document.getElementById("filter-date");
    var catEl = document.getElementById("filter-category");

    function onFilterChange() {
      postsListPage = 1;
      renderPostsList();
    }

    if (nameEl) nameEl.addEventListener("input", onFilterChange);
    if (dateEl) dateEl.addEventListener("change", onFilterChange);
    if (catEl) catEl.addEventListener("change", onFilterChange);
  }

  function bindPostPagination() {
    var prevBtn = document.getElementById("page-prev");
    var nextBtn = document.getElementById("page-next");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (postsListPage > 1) {
          postsListPage--;
          renderPostsList();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var filtered = filterPostsList(getData("posts"));
        var pages = Math.max(1, Math.ceil(filtered.length / postsPageSize));
        if (postsListPage < pages) {
          postsListPage++;
          renderPostsList();
        }
      });
    }
  }

  function bindPostsGlobalCloseMenus() {
    document.addEventListener("click", function () {
      closeAllPostMenus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllPostMenus();
    });
  }

  function bindPostDeleteModal() {
    var modal = document.getElementById("delete-modal");
    var backdrop = document.getElementById("delete-modal-backdrop");
    var cancel = document.getElementById("delete-modal-cancel");
    var confirm = document.getElementById("delete-modal-confirm");

    function close() {
      closePostDeleteModal();
    }

    if (cancel) cancel.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (postsPendingDeleteId) deletePostById(postsPendingDeleteId);
        closePostDeleteModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (modal && !modal.hidden) {
        e.preventDefault();
        close();
      }
    });
  }

  function initPostsPage() {
    if (!document.getElementById("posts-list")) return;

    ensureDummyPosts();
    if (new URLSearchParams(location.search).get("deleted") === "1") {
      showPostsToast("Post deleted successfully");
      try {
        history.replaceState({}, "", "posts.html");
      } catch (e) {}
    }
    populatePostCategorySelect();
    bindPostFilters();
    bindPostPagination();
    bindPostsGlobalCloseMenus();
    bindPostDeleteModal();
    renderPostsList();
  }

  var USER_ROLES = ["Admin", "Editor", "User"];
  var usersPageSize = 5;
  var usersListPage = 1;
  var usersOpenMenuId = null;
  var usersPendingDeleteId = null;
  var usersToastTimer = null;

  function userRecordNewId() {
    return "usr-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function formatUserListName(user, index) {
    if (user.name && String(user.name).trim()) return String(user.name).trim();
    var email = user.email || "user" + index;
    var local = String(email).split("@")[0] || "user";
    var parts = local.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
    if (parts.length === 0) return "User";
    return parts
      .map(function (p) {
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join(" ");
  }

  function hydrateUserRecords() {
    var users = getData("users");
    var changed = false;
    users.forEach(function (u, i) {
      if (!u.id) {
        u.id = userRecordNewId();
        changed = true;
      }
      if (!u.email) {
        u.email = "user" + i + "@placeholder.local";
        changed = true;
      }
      if (u.password === undefined || u.password === null || u.password === "") {
        u.password = "changeme";
        changed = true;
      }
      if (!u.name) {
        u.name = formatUserListName(u, i);
        changed = true;
      }
      if (!u.role) {
        u.role =
          u.email &&
          String(u.email).toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()
            ? "Admin"
            : "User";
        changed = true;
      }
      if (!u.avatar) {
        u.avatar = avatarUrl(u.name);
        changed = true;
      }
      if (!u.bio) {
        u.bio = "Team member — " + (u.role || "User") + " access.";
        changed = true;
      }
      if (!u.date) {
        u.date = u.createdAt
          ? u.createdAt.slice(0, 10)
          : new Date().toISOString().slice(0, 10);
        changed = true;
      }
      if (!u.createdAt) {
        u.createdAt = new Date().toISOString();
        changed = true;
      }
    });
    if (changed) saveData("users", users);
  }

  function seedDemoUsersIfNeeded() {
    var users = getData("users");
    if (users.length >= 8) return;
    var demos = [
      {
        name: "Maya Chen",
        email: "maya.chen@creestudios.com",
        password: "demo123",
        role: "Editor",
        bio: "Brand strategist focused on motion and social campaigns.",
        avatar: "https://picsum.photos/seed/maya/88/88",
        date: "2026-02-12",
      },
      {
        name: "Omar Ali",
        email: "omar.ali@creestudios.com",
        password: "demo123",
        role: "User",
        bio: "Product designer prototyping onboarding flows.",
        avatar: "https://picsum.photos/seed/omar/88/88",
        date: "2026-02-05",
      },
      {
        name: "Sofia Reyes",
        email: "sofia.reyes@creestudios.com",
        password: "demo123",
        role: "Editor",
        bio: "UX/UI lead for SaaS dashboards and analytics.",
        avatar: "https://picsum.photos/seed/sofia/88/88",
        date: "2026-01-28",
      },
      {
        name: "James Okonkwo",
        email: "james.okonkwo@creestudios.com",
        password: "demo123",
        role: "User",
        bio: "Front-end developer and design systems contributor.",
        avatar: "https://picsum.photos/seed/james/88/88",
        date: "2026-01-18",
      },
      {
        name: "Lena Vogel",
        email: "lena.vogel@creestudios.com",
        password: "demo123",
        role: "Editor",
        bio: "Content strategist and marketing analytics.",
        avatar: "https://picsum.photos/seed/lena/88/88",
        date: "2026-01-08",
      },
      {
        name: "Daniel Park",
        email: "daniel.park@creestudios.com",
        password: "demo123",
        role: "User",
        bio: "QA engineer and accessibility reviewer.",
        avatar: "https://picsum.photos/seed/daniel/88/88",
        date: "2025-12-20",
      },
      {
        name: "Elena Rossi",
        email: "elena.rossi@creestudios.com",
        password: "demo123",
        role: "Editor",
        bio: "Motion designer and campaign storyteller.",
        avatar: "https://picsum.photos/seed/elena/88/88",
        date: "2025-11-10",
      },
      {
        name: "Marcus Webb",
        email: "marcus.webb@creestudios.com",
        password: "demo123",
        role: "User",
        bio: "Infrastructure and release automation.",
        avatar: "https://picsum.photos/seed/marcus/88/88",
        date: "2025-10-22",
      },
    ];
    var seen = {};
    users.forEach(function (u) {
      if (u.email) seen[String(u.email).toLowerCase()] = true;
    });
    demos.forEach(function (d) {
      if (users.length >= 8) return;
      if (seen[d.email.toLowerCase()]) return;
      seen[d.email.toLowerCase()] = true;
      users.push({
        id: userRecordNewId(),
        name: d.name,
        email: d.email,
        password: d.password,
        role: d.role,
        avatar: d.avatar,
        bio: d.bio,
        date: d.date,
        createdAt: new Date(d.date + "T12:00:00.000Z").toISOString(),
      });
    });
    saveData("users", users);
  }

  function ensureUserDashboardData() {
    hydrateUserRecords();
    seedDemoUsersIfNeeded();
    hydrateUserRecords();
  }

  function filterUsersArray(all, q, dateVal, roleVal) {
    q = (q || "").trim().toLowerCase();
    dateVal = dateVal || "";
    roleVal = roleVal || "";
    return all.filter(function (u) {
      var name = (u.name || "").toLowerCase();
      var email = (u.email || "").toLowerCase();
      if (q && name.indexOf(q) === -1 && email.indexOf(q) === -1) return false;
      if (dateVal && (u.date || "").slice(0, 10) !== dateVal) return false;
      if (roleVal && (u.role || "") !== roleVal) return false;
      return true;
    });
  }

  function filterUsersList() {
    var nameEl = document.getElementById("users-filter-name");
    var dateEl = document.getElementById("users-filter-date");
    var roleEl = document.getElementById("users-filter-role");
    return filterUsersArray(
      getData("users"),
      nameEl && nameEl.value,
      dateEl && dateEl.value,
      roleEl && roleEl.value
    );
  }

  function applyUsersPagination(filtered) {
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / usersPageSize) || 1);
    if (usersListPage > pages) usersListPage = pages;
    if (usersListPage < 1) usersListPage = 1;
    var start = (usersListPage - 1) * usersPageSize;
    var slice = filtered.slice(start, start + usersPageSize);
    return { slice: slice, total: total, pages: pages };
  }

  function closeAllUserMenus() {
    document.querySelectorAll("#users-list .post-row__dropdown").forEach(function (el) {
      el.hidden = true;
    });
    document.querySelectorAll("#users-list .post-row__kebab").forEach(function (btn) {
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
    usersOpenMenuId = null;
  }

  function toggleUserMenu(userId, btn, dropdown) {
    var isOpen = usersOpenMenuId === userId && !dropdown.hidden;
    closeAllUserMenus();
    if (!isOpen) {
      dropdown.hidden = false;
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      usersOpenMenuId = userId;
    }
  }

  function showUsersToast(message) {
    var el = document.getElementById("users-toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(usersToastTimer);
    usersToastTimer = setTimeout(function () {
      el.hidden = true;
    }, 3200);
  }

  function openUserDeleteModal(userId) {
    usersPendingDeleteId = userId;
    var modal = document.getElementById("users-delete-modal");
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var confirmBtn = document.getElementById("users-delete-modal-confirm");
      if (confirmBtn) confirmBtn.focus();
    }
  }

  function closeUserDeleteModal() {
    usersPendingDeleteId = null;
    var modal = document.getElementById("users-delete-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function deleteUserById(userId) {
    var users = getData("users");
    var next = users.filter(function (u) {
      return u.id !== userId;
    });
    try {
      saveData("users", next);
      showUsersToast("User deleted");
      closeAllUserMenus();
      renderUsersList();
    } catch (e) {
      showUsersToast("Could not save changes. Check storage.");
    }
  }

  function renderUsersList() {
    var listEl = document.getElementById("users-list");
    var emptyEl = document.getElementById("users-empty");
    var infoEl = document.getElementById("users-page-info");
    var prevBtn = document.getElementById("users-page-prev");
    var nextBtn = document.getElementById("users-page-next");

    if (!listEl || !emptyEl) return;

    var filtered = filterUsersList();
    var result = applyUsersPagination(filtered);
    var slice = result.slice;

    closeAllUserMenus();

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      if (infoEl) infoEl.textContent = "";
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    emptyEl.hidden = true;

    if (infoEl) {
      var start = (usersListPage - 1) * usersPageSize + 1;
      var end = Math.min(usersListPage * usersPageSize, result.total);
      infoEl.textContent =
        "Showing " +
        start +
        "–" +
        end +
        " of " +
        result.total +
        (result.pages > 1
          ? " · Page " + usersListPage + " / " + result.pages
          : "");
    }

    if (prevBtn) prevBtn.disabled = usersListPage <= 1;
    if (nextBtn) nextBtn.disabled = usersListPage >= result.pages;

    listEl.innerHTML = "";
    slice.forEach(function (user) {
      var article = document.createElement("article");
      article.className = "user-row";
      article.setAttribute("data-user-id", user.id);

      var img = document.createElement("img");
      img.className = "user-row__avatar";
      img.src = user.avatar || user.avatarUrl || avatarUrl(user.name);
      img.alt = "";
      img.width = 56;
      img.height = 56;
      img.loading = "lazy";

      var body = document.createElement("div");
      body.className = "user-row__body";

      var h3 = document.createElement("h3");
      h3.className = "user-row__name";
      h3.textContent = user.name || "";

      var p = document.createElement("p");
      p.className = "user-row__desc";
      p.textContent = user.bio || "";

      var time = document.createElement("time");
      time.className = "user-row__date";
      time.dateTime = user.date || "";
      time.textContent = formatPostDisplayDate(user.date);

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(time);

      var actions = document.createElement("div");
      actions.className = "post-row__actions";

      var kebab = document.createElement("button");
      kebab.type = "button";
      kebab.className = "post-row__kebab";
      kebab.setAttribute("aria-label", "User actions");
      kebab.setAttribute("aria-expanded", "false");
      kebab.setAttribute("aria-haspopup", "true");
      kebab.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

      var dropdown = document.createElement("div");
      dropdown.className = "post-row__dropdown";
      dropdown.hidden = true;
      dropdown.setAttribute("role", "menu");

      var btnView = document.createElement("button");
      btnView.type = "button";
      btnView.setAttribute("role", "menuitem");
      btnView.textContent = "View";
      btnView.addEventListener("click", function () {
        window.location.href =
          "user-details.html?id=" + encodeURIComponent(user.id);
      });

      var aEdit = document.createElement("a");
      aEdit.href = "edit-user.html?id=" + encodeURIComponent(user.id);
      aEdit.setAttribute("role", "menuitem");
      aEdit.textContent = "Edit";

      var btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "posts-menu-danger";
      btnDel.setAttribute("role", "menuitem");
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", function () {
        closeAllUserMenus();
        openUserDeleteModal(user.id);
      });

      dropdown.appendChild(btnView);
      dropdown.appendChild(aEdit);
      dropdown.appendChild(btnDel);

      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      kebab.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleUserMenu(user.id, kebab, dropdown);
      });

      actions.appendChild(kebab);
      actions.appendChild(dropdown);

      article.appendChild(img);
      article.appendChild(body);
      article.appendChild(actions);
      listEl.appendChild(article);
    });
  }

  function populateUserRoleSelect() {
    var sel = document.getElementById("users-filter-role");
    if (!sel) return;
    sel.innerHTML = "";
    var opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "All roles";
    sel.appendChild(opt0);
    USER_ROLES.forEach(function (r) {
      var o = document.createElement("option");
      o.value = r;
      o.textContent = r;
      sel.appendChild(o);
    });
  }

  function bindUserFilters() {
    var nameEl = document.getElementById("users-filter-name");
    var dateEl = document.getElementById("users-filter-date");
    var roleEl = document.getElementById("users-filter-role");

    function onFilterChange() {
      usersListPage = 1;
      renderUsersList();
    }

    if (nameEl) nameEl.addEventListener("input", onFilterChange);
    if (dateEl) dateEl.addEventListener("change", onFilterChange);
    if (roleEl) roleEl.addEventListener("change", onFilterChange);
  }

  function bindUserPagination() {
    var prevBtn = document.getElementById("users-page-prev");
    var nextBtn = document.getElementById("users-page-next");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (usersListPage > 1) {
          usersListPage--;
          renderUsersList();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var filtered = filterUsersList();
        var pages = Math.max(1, Math.ceil(filtered.length / usersPageSize));
        if (usersListPage < pages) {
          usersListPage++;
          renderUsersList();
        }
      });
    }
  }

  function bindUsersGlobalCloseMenus() {
    document.addEventListener("click", function () {
      closeAllUserMenus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllUserMenus();
    });
  }

  function bindUserDeleteModal() {
    var modal = document.getElementById("users-delete-modal");
    var backdrop = document.getElementById("users-delete-modal-backdrop");
    var cancel = document.getElementById("users-delete-modal-cancel");
    var confirm = document.getElementById("users-delete-modal-confirm");

    function close() {
      closeUserDeleteModal();
    }

    if (cancel) cancel.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (usersPendingDeleteId) deleteUserById(usersPendingDeleteId);
        closeUserDeleteModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (modal && !modal.hidden) {
        e.preventDefault();
        close();
      }
    });
  }

  function initUsersPage() {
    if (!document.getElementById("users-list")) return;

    populateUserRoleSelect();
    bindUserFilters();
    bindUserPagination();
    bindUsersGlobalCloseMenus();
    bindUserDeleteModal();
    renderUsersList();
  }

  var NOTIFICATION_TYPES = ["info", "success", "warning"];
  var notificationsPageSize = 5;
  var notificationsListPage = 1;
  var notificationsOpenMenuId = null;
  var notificationsPendingDeleteId = null;
  var notificationsToastTimer = null;

  function notificationNewId() {
    return "ntf-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function ensureDummyNotifications() {
    if (localStorage.getItem("notifications") !== null) return;

    var now = new Date();
    var demo = [
      {
        id: notificationNewId(),
        title: "New user registered",
        message: "Maya Chen has joined the team and completed onboarding.",
        type: "success",
        avatar: "https://picsum.photos/seed/ntf1/88/88",
        date: "2026-04-08",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Post deleted successfully",
        message: "A draft post was removed from the library as requested.",
        type: "info",
        avatar: "",
        date: "2026-04-07",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "New comment received",
        message: "Someone left feedback on your latest project update.",
        type: "info",
        avatar: "https://picsum.photos/seed/ntf3/88/88",
        date: "2026-04-06",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Storage warning",
        message: "Media library is approaching 80% capacity. Consider archiving.",
        type: "warning",
        avatar: "",
        date: "2026-04-05",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Backup completed",
        message: "Dashboard data was backed up successfully overnight.",
        type: "success",
        avatar: "",
        date: "2026-04-04",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Security alert",
        message: "Unusual login attempt blocked from an unknown device.",
        type: "warning",
        avatar: "https://picsum.photos/seed/ntf6/88/88",
        date: "2026-04-03",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Weekly summary",
        message: "Your posts received 24% more views than last week.",
        type: "info",
        avatar: "",
        date: "2026-04-02",
        createdAt: now.toISOString(),
      },
      {
        id: notificationNewId(),
        title: "Invite accepted",
        message: "A collaborator accepted your invite to the workspace.",
        type: "success",
        avatar: "https://picsum.photos/seed/ntf8/88/88",
        date: "2026-04-01",
        createdAt: now.toISOString(),
      },
    ];

    try {
      saveData("notifications", demo);
    } catch (e) {
      console.error(e);
    }
  }

  function normalizeNotificationType(t) {
    var s = String(t || "").toLowerCase();
    if (NOTIFICATION_TYPES.indexOf(s) !== -1) return s;
    return "info";
  }

  function notificationIconSvg(type) {
    var t = normalizeNotificationType(type);
    if (t === "success") {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (t === "warning") {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.2L2.7 18c-.5 1 .2 2 1.3 2h16c1.1 0 1.8-1 1.3-2L13.7 3.2c-.5-1-1.8-1-2.4 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 16v-5M12 8h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  }

  function filterNotificationsArray(all, q, dateVal, typeVal) {
    q = (q || "").trim().toLowerCase();
    dateVal = dateVal || "";
    typeVal = typeVal || "";
    return all.filter(function (n) {
      var title = (n.title || "").toLowerCase();
      var message = (n.message || "").toLowerCase();
      if (q && title.indexOf(q) === -1 && message.indexOf(q) === -1) return false;
      if (dateVal && (n.date || "").slice(0, 10) !== dateVal) return false;
      if (typeVal && normalizeNotificationType(n.type) !== typeVal) return false;
      return true;
    });
  }

  function filterNotificationsList() {
    var nameEl = document.getElementById("notifications-filter-name");
    var dateEl = document.getElementById("notifications-filter-date");
    var typeEl = document.getElementById("notifications-filter-type");
    return filterNotificationsArray(
      getData("notifications"),
      nameEl && nameEl.value,
      dateEl && dateEl.value,
      typeEl && typeEl.value
    );
  }

  function applyNotificationsPagination(filtered) {
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / notificationsPageSize) || 1);
    if (notificationsListPage > pages) notificationsListPage = pages;
    if (notificationsListPage < 1) notificationsListPage = 1;
    var start = (notificationsListPage - 1) * notificationsPageSize;
    var slice = filtered.slice(start, start + notificationsPageSize);
    return { slice: slice, total: total, pages: pages };
  }

  function closeAllNotificationMenus() {
    document.querySelectorAll("#notifications-list .post-row__dropdown").forEach(function (el) {
      el.hidden = true;
    });
    document.querySelectorAll("#notifications-list .post-row__kebab").forEach(function (btn) {
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
    notificationsOpenMenuId = null;
  }

  function toggleNotificationMenu(notificationId, btn, dropdown) {
    var isOpen = notificationsOpenMenuId === notificationId && !dropdown.hidden;
    closeAllNotificationMenus();
    if (!isOpen) {
      dropdown.hidden = false;
      btn.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      notificationsOpenMenuId = notificationId;
    }
  }

  function showNotificationsToast(message) {
    var el = document.getElementById("notifications-toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(notificationsToastTimer);
    notificationsToastTimer = setTimeout(function () {
      el.hidden = true;
    }, 3200);
  }

  function openNotificationDeleteModal(notificationId) {
    notificationsPendingDeleteId = notificationId;
    var modal = document.getElementById("notifications-delete-modal");
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var confirmBtn = document.getElementById("notifications-delete-modal-confirm");
      if (confirmBtn) confirmBtn.focus();
    }
  }

  function closeNotificationDeleteModal() {
    notificationsPendingDeleteId = null;
    var modal = document.getElementById("notifications-delete-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function deleteNotificationById(notificationId) {
    var list = getData("notifications");
    var next = list.filter(function (n) {
      return n.id !== notificationId;
    });
    try {
      saveData("notifications", next);
      showNotificationsToast("Notification deleted");
      closeAllNotificationMenus();
      renderNotificationsList();
    } catch (e) {
      showNotificationsToast("Could not save changes. Check storage.");
    }
  }

  function renderNotificationsList() {
    var listEl = document.getElementById("notifications-list");
    var emptyEl = document.getElementById("notifications-empty");
    var infoEl = document.getElementById("notifications-page-info");
    var prevBtn = document.getElementById("notifications-page-prev");
    var nextBtn = document.getElementById("notifications-page-next");

    if (!listEl || !emptyEl) return;

    var filtered = filterNotificationsList();
    var result = applyNotificationsPagination(filtered);
    var slice = result.slice;

    closeAllNotificationMenus();

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      if (infoEl) infoEl.textContent = "";
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    emptyEl.hidden = true;

    if (infoEl) {
      var start = (notificationsListPage - 1) * notificationsPageSize + 1;
      var end = Math.min(notificationsListPage * notificationsPageSize, result.total);
      infoEl.textContent =
        "Showing " +
        start +
        "–" +
        end +
        " of " +
        result.total +
        (result.pages > 1
          ? " · Page " + notificationsListPage + " / " + result.pages
          : "");
    }

    if (prevBtn) prevBtn.disabled = notificationsListPage <= 1;
    if (nextBtn) nextBtn.disabled = notificationsListPage >= result.pages;

    listEl.innerHTML = "";
    slice.forEach(function (n) {
      var article = document.createElement("article");
      article.className = "notif-row";
      article.setAttribute("data-notification-id", n.id);
      article.setAttribute(
        "data-notif-type",
        normalizeNotificationType(n.type)
      );

      var media = document.createElement("div");
      media.className = "notif-row__media";

      if (n.avatar && String(n.avatar).trim()) {
        var img = document.createElement("img");
        img.className = "notif-row__avatar";
        img.src = n.avatar;
        img.alt = "";
        img.width = 56;
        img.height = 56;
        img.loading = "lazy";
        media.appendChild(img);
      } else {
        var iconWrap = document.createElement("div");
        iconWrap.className =
          "notif-row__icon notif-row__icon--" +
          normalizeNotificationType(n.type);
        iconWrap.setAttribute("aria-hidden", "true");
        iconWrap.innerHTML = notificationIconSvg(n.type);
        media.appendChild(iconWrap);
      }

      var body = document.createElement("div");
      body.className = "notif-row__body";

      var h3 = document.createElement("h3");
      h3.className = "notif-row__title";
      h3.textContent = n.title || "Notification";

      var p = document.createElement("p");
      p.className = "notif-row__desc";
      p.textContent = n.message || "";

      var time = document.createElement("time");
      time.className = "notif-row__date";
      time.dateTime = n.date || "";
      time.textContent = formatPostDisplayDate(n.date);

      body.appendChild(h3);
      body.appendChild(p);
      body.appendChild(time);

      var actions = document.createElement("div");
      actions.className = "post-row__actions";

      var kebab = document.createElement("button");
      kebab.type = "button";
      kebab.className = "post-row__kebab";
      kebab.setAttribute("aria-label", "Notification actions");
      kebab.setAttribute("aria-expanded", "false");
      kebab.setAttribute("aria-haspopup", "true");
      kebab.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

      var dropdown = document.createElement("div");
      dropdown.className = "post-row__dropdown";
      dropdown.hidden = true;
      dropdown.setAttribute("role", "menu");

      var btnView = document.createElement("button");
      btnView.type = "button";
      btnView.setAttribute("role", "menuitem");
      btnView.textContent = "View";
      btnView.addEventListener("click", function () {
        closeAllNotificationMenus();
        var full =
          (n.title || "") + (n.message ? " — " + n.message : "");
        showNotificationsToast(full);
      });

      var btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "posts-menu-danger";
      btnDel.setAttribute("role", "menuitem");
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", function () {
        closeAllNotificationMenus();
        openNotificationDeleteModal(n.id);
      });

      dropdown.appendChild(btnView);
      dropdown.appendChild(btnDel);

      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      kebab.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleNotificationMenu(n.id, kebab, dropdown);
      });

      actions.appendChild(kebab);
      actions.appendChild(dropdown);

      article.appendChild(media);
      article.appendChild(body);
      article.appendChild(actions);
      listEl.appendChild(article);
    });
  }

  function populateNotificationTypeSelect() {
    var sel = document.getElementById("notifications-filter-type");
    if (!sel) return;
    sel.innerHTML = "";
    var opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = "All types";
    sel.appendChild(opt0);
    NOTIFICATION_TYPES.forEach(function (t) {
      var o = document.createElement("option");
      o.value = t;
      o.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      sel.appendChild(o);
    });
  }

  function bindNotificationFilters() {
    var nameEl = document.getElementById("notifications-filter-name");
    var dateEl = document.getElementById("notifications-filter-date");
    var typeEl = document.getElementById("notifications-filter-type");

    function onFilterChange() {
      notificationsListPage = 1;
      renderNotificationsList();
    }

    if (nameEl) nameEl.addEventListener("input", onFilterChange);
    if (dateEl) dateEl.addEventListener("change", onFilterChange);
    if (typeEl) typeEl.addEventListener("change", onFilterChange);
  }

  function bindNotificationPagination() {
    var prevBtn = document.getElementById("notifications-page-prev");
    var nextBtn = document.getElementById("notifications-page-next");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (notificationsListPage > 1) {
          notificationsListPage--;
          renderNotificationsList();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var filtered = filterNotificationsList();
        var pages = Math.max(
          1,
          Math.ceil(filtered.length / notificationsPageSize)
        );
        if (notificationsListPage < pages) {
          notificationsListPage++;
          renderNotificationsList();
        }
      });
    }
  }

  function bindNotificationsGlobalCloseMenus() {
    document.addEventListener("click", function () {
      closeAllNotificationMenus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllNotificationMenus();
    });
  }

  function bindNotificationDeleteModal() {
    var modal = document.getElementById("notifications-delete-modal");
    var backdrop = document.getElementById("notifications-delete-modal-backdrop");
    var cancel = document.getElementById("notifications-delete-modal-cancel");
    var confirm = document.getElementById("notifications-delete-modal-confirm");

    function close() {
      closeNotificationDeleteModal();
    }

    if (cancel) cancel.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (notificationsPendingDeleteId) {
          deleteNotificationById(notificationsPendingDeleteId);
        }
        closeNotificationDeleteModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (modal && !modal.hidden) {
        e.preventDefault();
        close();
      }
    });
  }

  function initNotificationsPage() {
    if (!document.getElementById("notifications-list")) return;

    ensureDummyNotifications();
    populateNotificationTypeSelect();
    bindNotificationFilters();
    bindNotificationPagination();
    bindNotificationsGlobalCloseMenus();
    bindNotificationDeleteModal();
    renderNotificationsList();
  }

  window.AppNotifications = {
    push: function (item) {
      var list = getData("notifications");
      var row = {
        id: notificationNewId(),
        title: (item && item.title) || "Notice",
        message: (item && item.message) || "",
        type: normalizeNotificationType((item && item.type) || "info"),
        avatar: (item && item.avatar) || "",
        date:
          (item && item.date) || new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      };
      list.unshift(row);
      try {
        saveData("notifications", list);
      } catch (e) {
        return false;
      }
      return true;
    },
  };

  function getSessionDisplayName() {
    try {
      var raw = localStorage.getItem("currentUser");
      if (!raw) return "Guest";
      var u = JSON.parse(raw);
      if (u.email) {
        var local = String(u.email).split("@")[0];
        var parts = local.replace(/[._-]+/g, " ").split(" ").filter(Boolean);
        if (parts.length === 0) return "Guest";
        return parts
          .map(function (p) {
            return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
          })
          .join(" ");
      }
    } catch (e) {}
    return "Guest";
  }

  var postInnerCurrentId = null;
  var postInnerRelatedPage = 1;
  var postInnerRelatedPageSize = 6;
  var postInnerToastTimer = null;

  function showPostInnerToast(message) {
    var el = document.getElementById("post-inner-toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(postInnerToastTimer);
    postInnerToastTimer = setTimeout(function () {
      el.hidden = true;
    }, 2800);
  }

  function cssUrlValue(u) {
    if (!u) return "none";
    return 'url("' + String(u).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '")';
  }

  function openPostInnerDeleteModal() {
    var modal = document.getElementById("post-inner-delete-modal");
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var confirmBtn = document.getElementById("post-inner-delete-confirm");
      if (confirmBtn) confirmBtn.focus();
    }
  }

  function closePostInnerDeleteModal() {
    var modal = document.getElementById("post-inner-delete-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function renderPostInnerRelated() {
    var grid = document.getElementById("post-inner-related-grid");
    var emptyEl = document.getElementById("post-inner-related-empty");
    var infoEl = document.getElementById("post-inner-related-info");
    var prevBtn = document.getElementById("post-inner-page-prev");
    var nextBtn = document.getElementById("post-inner-page-next");
    if (!grid || !postInnerCurrentId) return;

    var all = getData("posts");
    var others = all.filter(function (p) {
      return p.id !== postInnerCurrentId;
    });
    var filtered = filterPostsListWithIds(
      others,
      "post-inner-filter-name",
      "post-inner-filter-date",
      "post-inner-filter-category"
    );

    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / postInnerRelatedPageSize) || 1);
    if (postInnerRelatedPage > pages) postInnerRelatedPage = pages;
    if (postInnerRelatedPage < 1) postInnerRelatedPage = 1;

    var start = (postInnerRelatedPage - 1) * postInnerRelatedPageSize;
    var slice = filtered.slice(start, start + postInnerRelatedPageSize);

    if (infoEl) {
      if (total === 0) {
        infoEl.textContent = "";
      } else {
        var startN = start + 1;
        var endN = Math.min(start + postInnerRelatedPageSize, total);
        infoEl.textContent =
          "Showing " +
          startN +
          "–" +
          endN +
          " of " +
          total +
          (pages > 1 ? " · Page " + postInnerRelatedPage + " / " + pages : "");
      }
    }

    if (prevBtn) prevBtn.disabled = postInnerRelatedPage <= 1;
    if (nextBtn) nextBtn.disabled = postInnerRelatedPage >= pages;

    grid.innerHTML = "";
    if (slice.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    slice.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "post-inner__card";
      a.href = "post.html?id=" + encodeURIComponent(p.id);
      var img = document.createElement("img");
      img.className = "post-inner__card-img";
      img.src = p.image || "https://picsum.photos/seed/nothumb/240/160";
      img.alt = "";
      img.loading = "lazy";
      var cap = document.createElement("span");
      cap.className = "post-inner__card-title";
      cap.textContent = p.title || "Untitled";
      a.appendChild(img);
      a.appendChild(cap);
      grid.appendChild(a);
    });
  }

  function bindPostInnerPage() {
    var nameEl = document.getElementById("post-inner-filter-name");
    var dateEl = document.getElementById("post-inner-filter-date");
    var catEl = document.getElementById("post-inner-filter-category");

    function onFilterChange() {
      postInnerRelatedPage = 1;
      renderPostInnerRelated();
    }

    if (nameEl) nameEl.addEventListener("input", onFilterChange);
    if (dateEl) dateEl.addEventListener("change", onFilterChange);
    if (catEl) catEl.addEventListener("change", onFilterChange);

    var prevBtn = document.getElementById("post-inner-page-prev");
    var nextBtn = document.getElementById("post-inner-page-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (postInnerRelatedPage > 1) {
          postInnerRelatedPage--;
          renderPostInnerRelated();
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var all = getData("posts");
        var others = all.filter(function (p) {
          return p.id !== postInnerCurrentId;
        });
        var filtered = filterPostsListWithIds(
          others,
          "post-inner-filter-name",
          "post-inner-filter-date",
          "post-inner-filter-category"
        );
        var pages = Math.max(
          1,
          Math.ceil(filtered.length / postInnerRelatedPageSize) || 1
        );
        if (postInnerRelatedPage < pages) {
          postInnerRelatedPage++;
          renderPostInnerRelated();
        }
      });
    }

    var searchBtn = document.getElementById("post-inner-filter-search");
    if (searchBtn && nameEl) {
      searchBtn.addEventListener("click", function () {
        nameEl.focus();
      });
    }

    var btnDel = document.getElementById("post-inner-btn-delete");
    if (btnDel) {
      btnDel.addEventListener("click", function () {
        openPostInnerDeleteModal();
      });
    }

    var btnDetails = document.getElementById("post-inner-btn-details");
    if (btnDetails) {
      btnDetails.addEventListener("click", function () {
        var related = document.getElementById("related-posts");
        if (related) {
          related.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    var backdrop = document.getElementById("post-inner-delete-backdrop");
    var cancel = document.getElementById("post-inner-delete-cancel");
    var confirm = document.getElementById("post-inner-delete-confirm");

    function closeDel() {
      closePostInnerDeleteModal();
    }

    if (cancel) cancel.addEventListener("click", closeDel);
    if (backdrop) backdrop.addEventListener("click", closeDel);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (!postInnerCurrentId) {
          closeDel();
          return;
        }
        var posts = getData("posts");
        var next = posts.filter(function (p) {
          return p.id !== postInnerCurrentId;
        });
        try {
          saveData("posts", next);
          closeDel();
          window.location.href = "posts.html?deleted=1";
        } catch (e) {
          showPostInnerToast("Could not save changes. Check storage.");
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.getElementById("post-inner-delete-modal");
      if (modal && !modal.hidden) {
        e.preventDefault();
        closeDel();
      }
    });
  }

  function initPostInnerPage() {
    var content = document.getElementById("post-inner-content");
    var err = document.getElementById("post-inner-error");
    if (!content || !err) return;

    ensureDummyPosts();
    var id = (new URLSearchParams(location.search).get("id") || "").trim();
    if (!id) {
      err.hidden = false;
      return;
    }

    var posts = getData("posts");
    var post = posts.find(function (p) {
      return String(p.id) === id;
    });
    if (!post) {
      err.hidden = false;
      return;
    }

    postInnerCurrentId = id;
    postInnerRelatedPage = 1;
    err.remove();
    content.hidden = false;

    document.title = (post.title || "Post") + " — Admin";

    var media = document.getElementById("post-inner-hero-media");
    if (media) {
      media.style.backgroundImage = cssUrlValue(post.image);
    }

    var catEl = document.getElementById("post-inner-category");
    if (catEl) {
      catEl.textContent = (post.category || "").toUpperCase().replace(/\s+/g, " ").trim() || "—";
    }

    var titleEl = document.getElementById("post-inner-title");
    if (titleEl) titleEl.textContent = post.title || "Untitled";

    var descEl = document.getElementById("post-inner-description");
    if (descEl) descEl.textContent = post.description || "";

    var authorEl = document.getElementById("post-inner-author-name");
    if (authorEl) authorEl.textContent = getSessionDisplayName();

    var editLink = document.getElementById("post-inner-btn-edit");
    if (editLink) editLink.href = "edit-post.html?id=" + encodeURIComponent(id);

    populatePostCategorySelect("post-inner-filter-category");
    bindPostInnerPage();
    renderPostInnerRelated();
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
    ensureUserDashboardData();
    initLoginPage();
    initOverviewPage();
    initPostsPage();
    initPostInnerPage();
    initUsersPage();
    initNotificationsPage();
    injectNavOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();

