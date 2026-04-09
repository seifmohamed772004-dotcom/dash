
(function () {
  "use strict";

  window.NavOverlay = {
    openMenu: function () {},
    closeMenu: function () {},
    toggleMenu: function () {},
  };

  var NAV_OVERLAY_HTML =
    '<div id="nav-overlay" class="nav-overlay" hidden role="dialog" aria-modal="true" aria-hidden="true" aria-label="Site navigation">' +
    '<video class="nav-overlay__bg-video" autoplay muted loop playsinline aria-hidden="true">' +
    '<source src="Assets/Background Video.mp4" type="video/mp4">' +
    "</video>" +
    '<div class="nav-overlay__backdrop" data-nav-overlay-backdrop></div>' +
    '<div class="nav-overlay__panel">' +
    '<header class="nav-overlay__topbar">' +
    '<a href="overview.html" class="nav-overlay__logo"><img src="Assets/Login Logo.png" alt="CREESTUDIOS" class="brand-logo"></a>' +
    '<button type="button" class="nav-overlay__close" id="nav-overlay-close-btn" aria-label="Close menu">' +
    '<span class="nav-overlay__close-icon" aria-hidden="true"></span>' +
    "</button>" +
    "</header>" +
    '<nav class="nav-overlay__links nav-overlay__links--add-dash" aria-label="Primary">' +
    '<a href="overview.html" class="nav-overlay__link">Overview</a>' +
    '<a href="posts.html" class="nav-overlay__link">Posts</a>' +
    '<a href="users.html" class="nav-overlay__link">Users</a>' +
    '<a href="analytics.html" class="nav-overlay__link">Analytics</a>' +
    '<a href="media.html" class="nav-overlay__link">Media Library</a>' +
    '<a href="features.html" class="nav-overlay__link">Features</a>' +
    '<a href="settings.html" class="nav-overlay__link">Settings</a>' +
    '<a href="notifications.html" class="nav-overlay__link">Notifications</a>' +
    '<a href="pages.html" class="nav-overlay__link">All Pages</a>' +
    '<a href="all-pages.html" class="nav-overlay__link">All Pages (Legacy)</a>' +
    '<a href="FAQ.html" class="nav-overlay__link">FAQ</a>' +
    '<a href="help.html" class="nav-overlay__link">Help</a>' +
    '<a href="privacy.html" class="nav-overlay__link">Policies</a>' +
    '<a href="reports.html" class="nav-overlay__link">Reports</a>' +
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

    function startLoginPreloaderAndRedirect() {
      var preloader = document.getElementById("login-preloader");
      if (!preloader) {
        window.location.href = "overview.html";
        return;
      }
      preloader.hidden = false;
      requestAnimationFrame(function () {
        preloader.classList.add("is-active");
      });
      setTimeout(function () {
        window.location.href = "overview.html";
      }, 500);
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

      startLoginPreloaderAndRedirect();
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
      if (u.isBanned === undefined) {
        u.isBanned = false;
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
      aEdit.href = "users.html";
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

  function reportNewId() {
    return "rep-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  }

  function userById(id) {
    if (!id) return null;
    return getData("users").find(function (u) {
      return String(u.id) === String(id);
    });
  }

  function avatarUrlForUserId(id) {
    var u = userById(id);
    if (!u) return "https://picsum.photos/seed/nouser/88/88";
    return u.avatar || u.avatarUrl || avatarUrl(u.name);
  }

  function reportTimestampMs(r) {
    if (r.createdAt) {
      var d = new Date(r.createdAt);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    if (r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) {
      var p = r.date.split("-");
      return new Date(
        Number(p[0]),
        Number(p[1]) - 1,
        Number(p[2]),
        12,
        0,
        0
      ).getTime();
    }
    return 0;
  }

  function reportMatchesBannedFilter(r, showBannedOnly) {
    if (!showBannedOnly) return true;
    var u = userById(r.reportedId);
    return !!(u && u.isBanned === true);
  }

  function filterReportsForTimeSection(all, sectionKey, showBannedOnly) {
    var now = Date.now();
    var ms24 = 24 * 60 * 60 * 1000;
    var ms7 = 7 * ms24;
    var ms30 = 30 * ms24;
    return all.filter(function (r) {
      if (!reportMatchesBannedFilter(r, showBannedOnly)) return false;
      var t = reportTimestampMs(r);
      if (t <= 0 || t > now) return false;
      var age = now - t;
      if (sectionKey === "24h") return age <= ms24;
      if (sectionKey === "7d") return age > ms24 && age <= ms7;
      if (sectionKey === "30d") return age > ms7 && age <= ms30;
      return false;
    });
  }

  function ensureDummyReports() {
    if (localStorage.getItem("reports") !== null) return;

    ensureUserDashboardData();
    var users = getData("users");
    if (users.length < 2) return;

    var ucopy = users.slice();
    if (ucopy.length > 2) ucopy[2].isBanned = true;
    if (ucopy.length > 5) ucopy[5].isBanned = true;
    saveData("users", ucopy);
    users = getData("users");

    var now = Date.now();
    function isoHoursAgo(h) {
      return new Date(now - h * 60 * 60 * 1000).toISOString();
    }
    function pickPair(ia, ib) {
      var a = users[ia % users.length];
      var b = users[ib % users.length];
      if (a.id === b.id) b = users[(ib + 1) % users.length];
      return { reporter: a, reported: b };
    }

    var rows = [
      { ia: 0, ib: 1, reason: "Bullying", h: 3, status: "active" },
      { ia: 1, ib: 2, reason: "Harassment", h: 8, status: "active" },
      { ia: 2, ib: 3, reason: "Spam", h: 18, status: "resolved" },
      { ia: 0, ib: 4, reason: "Scam", h: 40, status: "active" },
      { ia: 3, ib: 0, reason: "Bullying", h: 90, status: "active" },
      { ia: 4, ib: 1, reason: "Harassment", h: 120, status: "resolved" },
      { ia: 1, ib: 5, reason: "Spam", h: 200, status: "active" },
      { ia: 5, ib: 2, reason: "Scam", h: 300, status: "active" },
      { ia: 2, ib: 6, reason: "Bullying", h: 400, status: "resolved" },
      { ia: 6, ib: 3, reason: "Harassment", h: 500, status: "active" },
      { ia: 7, ib: 4, reason: "Spam", h: 600, status: "active" },
      { ia: 0, ib: 2, reason: "Scam", h: 12, status: "active" },
    ];

    var reports = rows.map(function (row) {
      var pair = pickPair(row.ia, row.ib);
      var created = isoHoursAgo(row.h);
      return {
        id: reportNewId(),
        reporterId: pair.reporter.id,
        reportedId: pair.reported.id,
        reporterName: pair.reporter.name,
        reportedName: pair.reported.name,
        reason: row.reason,
        date: created.slice(0, 10),
        createdAt: created,
        status: row.status,
      };
    });

    try {
      saveData("reports", reports);
    } catch (e) {
      console.error(e);
    }
  }

  function ensureReportsMinimumCoverage() {
    var users = getData("users");
    if (!users || users.length < 2) return;
    var list = getData("reports");
    if (!Array.isArray(list)) list = [];
    var targetPerSection = 10;
    var reasons = ["Bullying", "Harassment", "Spam", "Scam", "Fake Account", "Hate Speech"];
    var now = Date.now();

    function pickPair(seed) {
      var a = users[seed % users.length];
      var b = users[(seed + 1) % users.length];
      if (a.id === b.id) b = users[(seed + 2) % users.length];
      return { reporter: a, reported: b };
    }

    function addGenerated(hoursAgo, seed) {
      var pair = pickPair(seed);
      var created = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();
      list.push({
        id: reportNewId(),
        reporterId: pair.reporter.id,
        reportedId: pair.reported.id,
        reporterName: pair.reporter.name,
        reportedName: pair.reported.name,
        reason: reasons[seed % reasons.length],
        date: created.slice(0, 10),
        createdAt: created,
        status: seed % 4 === 0 ? "resolved" : "active",
      });
    }

    var sections = [
      { key: "24h", minH: 1, maxH: 23 },
      { key: "7d", minH: 25, maxH: 160 },
      { key: "30d", minH: 170, maxH: 700 },
    ];

    var seed = list.length + 11;
    sections.forEach(function (sec) {
      var current = filterReportsForTimeSection(list, sec.key, false).length;
      while (current < targetPerSection) {
        var span = sec.maxH - sec.minH + 1;
        var hoursAgo = sec.minH + (seed % span);
        addGenerated(hoursAgo, seed);
        seed += 1;
        current += 1;
      }
    });

    try {
      saveData("reports", list);
    } catch (e) {}
  }

  function deleteReportById(reportId) {
    var list = getData("reports");
    var next = list.filter(function (r) {
      return r.id !== reportId;
    });
    try {
      saveData("reports", next);
      return true;
    } catch (e) {
      return false;
    }
  }

  function buildReportCardEl(r, opts) {
    opts = opts || {};
    var card = document.createElement("article");
    card.className = "report-card";
    card.setAttribute("data-report-id", r.id);

    var top = document.createElement("div");
    top.className = "report-card__label";
    top.textContent = "REPORT CASE";

    var av = document.createElement("div");
    av.className = "report-card__avatars";
    var img1 = document.createElement("img");
    img1.className = "report-card__avatar";
    img1.src = avatarUrlForUserId(r.reporterId);
    img1.alt = "";
    img1.width = 40;
    img1.height = 40;
    img1.loading = "lazy";
    var arrow = document.createElement("span");
    arrow.className = "report-card__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var img2 = document.createElement("img");
    img2.className = "report-card__avatar";
    img2.src = avatarUrlForUserId(r.reportedId);
    img2.alt = "";
    img2.width = 40;
    img2.height = 40;
    img2.loading = "lazy";
    av.appendChild(img1);
    av.appendChild(arrow);
    av.appendChild(img2);

    var caseId = document.createElement("p");
    caseId.className = "report-card__case";
    caseId.textContent = "CASE #" + String(r.id).slice(-8).toUpperCase();

    var reason = document.createElement("p");
    reason.className = "report-card__reason";
    reason.textContent = (r.reason || "").toUpperCase();

    var dateEl = document.createElement("time");
    dateEl.className = "report-card__date";
    dateEl.dateTime = r.date || "";
    dateEl.textContent = formatPostDisplayDate(r.date);

    var btn = document.createElement("a");
    btn.className = "report-card__btn";
    btn.href = "report-details.html?id=" + encodeURIComponent(r.id);
    btn.textContent = "VIEW CASE";

    card.appendChild(top);
    card.appendChild(av);
    card.appendChild(caseId);
    card.appendChild(reason);
    card.appendChild(dateEl);
    card.appendChild(btn);

    if (opts.showDelete) {
      var del = document.createElement("button");
      del.type = "button";
      del.className = "report-card__delete";
      del.setAttribute("data-delete-report", r.id);
      del.textContent = "Delete";
      card.appendChild(del);
    }

    return card;
  }

  var reportsShowBannedOnly = false;

  function renderReportsDashboard() {
    var s24 = document.getElementById("reports-strip-24h");
    var s7 = document.getElementById("reports-strip-7d");
    var s30 = document.getElementById("reports-strip-30d");
    var e24 = document.getElementById("reports-empty-24h");
    var e7 = document.getElementById("reports-empty-7d");
    var e30 = document.getElementById("reports-empty-30d");
    if (!s24 || !s7 || !s30) return;

    var all = getData("reports");
    [["24h", s24, e24], ["7d", s7, e7], ["30d", s30, e30]].forEach(function (tuple) {
      var key = tuple[0];
      var strip = tuple[1];
      var empty = tuple[2];
      var slice = filterReportsForTimeSection(all, key, reportsShowBannedOnly);
      strip.innerHTML = "";
      slice.forEach(function (r) {
        strip.appendChild(buildReportCardEl(r));
      });
      if (empty) empty.hidden = slice.length > 0;
    });
  }

  function initReportsPage() {
    if (!document.getElementById("reports-strip-24h")) return;

    ensureDummyReports();
    ensureReportsMinimumCoverage();
    var toggle = document.getElementById("reports-banned-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", reportsShowBannedOnly ? "true" : "false");
      toggle.classList.toggle("is-active", reportsShowBannedOnly);
      toggle.addEventListener("click", function () {
        reportsShowBannedOnly = !reportsShowBannedOnly;
        toggle.setAttribute("aria-pressed", reportsShowBannedOnly ? "true" : "false");
        toggle.classList.toggle("is-active", reportsShowBannedOnly);
        renderReportsDashboard();
      });
    }
    renderReportsDashboard();
  }

  var allReportsDeletePendingId = null;

  function renderAllReportsList() {
    var listEl = document.getElementById("all-reports-list");
    var emptyEl = document.getElementById("all-reports-empty");
    if (!listEl) return;

    var all = getData("reports");
    var filtered = reportsShowBannedOnly
      ? all.filter(function (r) {
          return reportMatchesBannedFilter(r, true);
        })
      : all;

    listEl.innerHTML = "";
    if (filtered.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    filtered.forEach(function (r) {
      listEl.appendChild(buildReportCardEl(r, { showDelete: true }));
    });
  }

  function initAllReportsPage() {
    var listEl = document.getElementById("all-reports-list");
    if (!listEl) return;

    ensureDummyReports();
    var toggle = document.getElementById("all-reports-banned-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", reportsShowBannedOnly ? "true" : "false");
      toggle.classList.toggle("is-active", reportsShowBannedOnly);
      toggle.addEventListener("click", function () {
        reportsShowBannedOnly = !reportsShowBannedOnly;
        toggle.setAttribute("aria-pressed", reportsShowBannedOnly ? "true" : "false");
        toggle.classList.toggle("is-active", reportsShowBannedOnly);
        renderAllReportsList();
      });
    }
    renderAllReportsList();

    var modal = document.getElementById("all-reports-delete-modal");
    var backdrop = document.getElementById("all-reports-delete-modal-backdrop");
    var cancel = document.getElementById("all-reports-delete-modal-cancel");
    var confirm = document.getElementById("all-reports-delete-modal-confirm");

    function closeM() {
      allReportsDeletePendingId = null;
      if (modal) modal.hidden = true;
      document.body.style.overflow = "";
    }

    function openM(id) {
      allReportsDeletePendingId = id;
      if (modal) {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (confirm) confirm.focus();
      }
    }

    listEl.addEventListener("click", function (e) {
      var del = e.target.closest && e.target.closest("[data-delete-report]");
      if (!del) return;
      e.preventDefault();
      var rid = del.getAttribute("data-delete-report");
      if (rid) openM(rid);
    });

    if (cancel) cancel.addEventListener("click", closeM);
    if (backdrop) backdrop.addEventListener("click", closeM);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (allReportsDeletePendingId) {
          if (deleteReportById(allReportsDeletePendingId) && window.AppNotifications) {
            window.AppNotifications.push({
              title: "Report removed",
              message: "A report case was deleted from the queue.",
              type: "info",
            });
          }
        }
        closeM();
        renderAllReportsList();
        renderReportsDashboard();
      });
    }
  }

  var reportDetailsPendingDeleteId = null;

  function initReportDetailsPage() {
    var root = document.getElementById("report-details-root");
    if (!root) return;

    ensureDummyReports();
    var id = (new URLSearchParams(location.search).get("id") || "").trim();
    var err = document.getElementById("report-details-error");
    var content = document.getElementById("report-details-content");

    if (!id) {
      if (err) err.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    var rep = getData("reports").find(function (r) {
      return String(r.id) === id;
    });
    if (!rep) {
      if (err) err.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (err) err.hidden = true;
    if (content) content.hidden = false;

    document.title = "Report — " + (rep.reason || "Case") + " — Admin";

    var setTxt = function (elId, text) {
      var el = document.getElementById(elId);
      if (el) el.textContent = text;
    };
    setTxt("report-details-case-id", "CASE #" + String(rep.id).slice(-8).toUpperCase());
    setTxt("report-details-reason", (rep.reason || "").toUpperCase());
    setTxt("report-details-status", (rep.status || "").toUpperCase());
    setTxt("report-details-date", formatPostDisplayDate(rep.date));
    setTxt("report-details-reporter", rep.reporterName || "");
    setTxt("report-details-reported", rep.reportedName || "");

    var ir = document.getElementById("report-details-img-reporter");
    var idr = document.getElementById("report-details-img-reported");
    if (ir) ir.src = avatarUrlForUserId(rep.reporterId);
    if (idr) idr.src = avatarUrlForUserId(rep.reportedId);

    var delBtn = document.getElementById("report-details-delete");
    var modal = document.getElementById("report-details-delete-modal");
    var backdrop = document.getElementById("report-details-delete-modal-backdrop");
    var cancel = document.getElementById("report-details-delete-modal-cancel");
    var confirm = document.getElementById("report-details-delete-modal-confirm");

    function closeM() {
      reportDetailsPendingDeleteId = null;
      if (modal) modal.hidden = true;
      document.body.style.overflow = "";
    }

    function openM() {
      reportDetailsPendingDeleteId = rep.id;
      if (modal) {
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        if (confirm) confirm.focus();
      }
    }

    if (delBtn) {
      delBtn.onclick = function () {
        openM();
      };
    }
    if (cancel) cancel.addEventListener("click", closeM);
    if (backdrop) backdrop.addEventListener("click", closeM);
    if (confirm) {
      confirm.addEventListener("click", function () {
        if (reportDetailsPendingDeleteId && deleteReportById(reportDetailsPendingDeleteId)) {
          if (window.AppNotifications) {
            window.AppNotifications.push({
              title: "Report removed",
              message: "The report case was deleted.",
              type: "success",
            });
          }
          closeM();
          window.location.href = "reports.html";
          return;
        }
        closeM();
      });
    }
  }

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

  function stripHtmlToText(html) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || d.innerText || "").trim();
  }

  function initAddPageRichEditor() {
    var editor = document.getElementById("rte-editor");
    var toolbar = document.getElementById("rte-toolbar");
    var syncHidden = document.getElementById("add-page-content-sync");
    var charCountEl = document.getElementById("add-page-char-count");
    var headingSel = document.getElementById("rte-heading");
    if (!editor || !toolbar) return;

    function sync() {
      if (syncHidden) syncHidden.value = editor.innerHTML;
      var plain = stripHtmlToText(editor.innerHTML);
      if (charCountEl) charCountEl.textContent = plain.length + " characters";
      editor.classList.toggle("is-empty", plain.length === 0);
    }

    function focusEditor() {
      editor.focus();
    }

    toolbar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      e.preventDefault();
      var cmd = btn.getAttribute("data-cmd");
      var val = btn.getAttribute("data-val");
      focusEditor();
      if (cmd === "createLink") {
        var url = window.prompt("Enter URL:", "https://");
        if (url) document.execCommand("createLink", false, url);
      } else if (cmd === "insertImage") {
        var imgUrl = window.prompt("Image URL:", "https://");
        if (imgUrl) document.execCommand("insertImage", false, imgUrl);
      } else if (cmd === "formatBlock" && val) {
        if (val === "blockquote" || val === "pre") {
          document.execCommand("formatBlock", false, val);
        } else {
          document.execCommand("formatBlock", false, "<" + val + ">");
        }
      } else if (cmd) {
        document.execCommand(cmd, false, null);
      }
      sync();
    });

    if (headingSel) {
      headingSel.addEventListener("change", function () {
        var v = headingSel.value;
        focusEditor();
        if (v) {
          document.execCommand("formatBlock", false, "<" + v + ">");
        } else {
          document.execCommand("formatBlock", false, "<p>");
        }
        headingSel.selectedIndex = 0;
        sync();
      });
    }

    editor.addEventListener("input", sync);
    editor.addEventListener("keyup", sync);
    editor.addEventListener("paste", function () {
      requestAnimationFrame(sync);
    });

    editor.addEventListener("keydown", function (e) {
      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        document.execCommand("bold", false, null);
        sync();
      }
      if (e.ctrlKey && (e.key === "i" || e.key === "I")) {
        e.preventDefault();
        document.execCommand("italic", false, null);
        sync();
      }
    });

    document.addEventListener("selectionchange", function () {
      if (!editor.contains(document.activeElement) && document.activeElement !== editor) return;
      toolbar.querySelectorAll("[data-cmd]").forEach(function (b) {
        var c = b.getAttribute("data-cmd");
        if (c === "bold" || c === "italic" || c === "underline") {
          try {
            b.classList.toggle("is-active", document.queryCommandState(c));
          } catch (err) {}
        }
      });
    });

    sync();
  }

  function initAddPageTagPills() {
    var input = document.getElementById("add-page-tag-input");
    var pillWrap = document.getElementById("add-page-tags");
    var tags = [];
    if (!input || !pillWrap) return;

    function render() {
      pillWrap.innerHTML = "";
      tags.forEach(function (tag) {
        var span = document.createElement("span");
        span.className = "add-page__tag";
        span.appendChild(document.createTextNode(tag + " "));
        var x = document.createElement("button");
        x.type = "button";
        x.className = "add-page__tag-remove";
        x.setAttribute("aria-label", "Remove tag");
        x.textContent = "×";
        x.addEventListener("click", function () {
          tags = tags.filter(function (t) {
            return t !== tag;
          });
          render();
        });
        span.appendChild(x);
        pillWrap.appendChild(span);
      });
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        var v = input.value.trim().replace(/^#/, "");
        if (v && tags.indexOf(v) === -1) tags.push(v);
        input.value = "";
        render();
      }
    });

    window.__addPageGetTags = function () {
      return tags.slice();
    };
    window.__addPageAddTag = function (tag) {
      tag = String(tag || "").trim().replace(/^#/, "");
      if (!tag || tags.indexOf(tag) !== -1) return;
      tags.push(tag);
      render();
    };
  }

  var DASHBOARD_PAGES_KEY = "dashboard_pages";

  function syncPostToDashboardPages(post) {
    var pages = getData(DASHBOARD_PAGES_KEY);
    if (!Array.isArray(pages)) pages = [];
    var slug = String(post.slug || "").trim();
    var pathSeg = slug.replace(/^\/+/, "").replace(/\/+/g, "-");
    if (!pathSeg) {
      pathSeg =
        String(post.title || "page")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "page";
    }
    var path = "/" + pathSeg;
    var existingById = pages.find(function (p) {
      return p.id === post.id;
    });
    var takenByOther = pages.some(function (p) {
      return p.path === path && p.id !== post.id;
    });
    if (takenByOther) {
      path =
        path +
        "-" +
        String(post.id)
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(-8);
    }
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var titleDisplay = post.subtitle ? post.title + " - " + post.subtitle : post.title;
    var entry = {
      id: post.id,
      path: path,
      title: titleDisplay,
      status: post.status === "published" ? "published" : "draft",
      views: existingById ? existingById.views : randInt(1200, 120000),
      retention: existingById ? existingById.retention : randInt(35, 92),
      bounce: existingById ? existingById.bounce : randInt(8, 55),
      avgTime: existingById
        ? existingById.avgTime
        : randInt(0, 4) + "m " + randInt(0, 59) + "s",
    };
    if (existingById) {
      var idx = pages.findIndex(function (p) {
        return p.id === post.id;
      });
      if (idx !== -1) pages[idx] = entry;
    } else {
      pages.unshift(entry);
    }
    saveData(DASHBOARD_PAGES_KEY, pages);
  }

  function gatherAddPageFormData() {
    var editor = document.getElementById("rte-editor");
    var contentHtml = editor ? editor.innerHTML : "";
    var plain = stripHtmlToText(contentHtml);
    var title = (document.getElementById("add-page-title") || {}).value || "";
    var subtitle = (document.getElementById("add-page-subtitle") || {}).value || "";
    var excerpt = (document.getElementById("add-page-excerpt") || {}).value || "";
    var category = (document.getElementById("add-page-category") || {}).value || "";
    var postType = (document.getElementById("add-page-post-type") || {}).value || "";
    var authorName = (document.getElementById("add-page-author") || {}).value || "";
    var publishDate = (document.getElementById("add-page-date") || {}).value || "";
    var slug = (document.getElementById("add-page-slug") || {}).value || "";
    var metaTitle = (document.getElementById("add-page-meta-title") || {}).value || "";
    var metaDesc = (document.getElementById("add-page-meta-desc") || {}).value || "";
    var keywords = (document.getElementById("add-page-keywords") || {}).value || "";
    var featured = (document.getElementById("add-page-featured-url") || {}).value || "";
    var ogImage = (document.getElementById("add-page-og-url") || {}).value || "";
    var galleryJson = (document.getElementById("add-page-gallery-urls") || {}).value || "[]";
    var gallery = [];
    try {
      gallery = JSON.parse(galleryJson);
    } catch (e) {}
    if (!Array.isArray(gallery)) gallery = [];
    var desc =
      excerpt.trim() ||
      subtitle.trim() ||
      plain.substring(0, 280).trim() ||
      "—";
    return {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: desc,
      category: category,
      image: featured,
      date: publishDate || new Date().toISOString().slice(0, 10),
      contentHtml: contentHtml,
      postType: postType,
      authorName: authorName,
      tags: typeof window.__addPageGetTags === "function" ? window.__addPageGetTags() : [],
      gallery: gallery,
      slug: slug,
      metaTitle: metaTitle,
      metaDescription: metaDesc,
      focusKeywords: keywords,
      ogImage: ogImage,
    };
  }

  function savePostFromAddPage(statusOverride) {
    var data = gatherAddPageFormData();
    if (!data.title) {
      window.alert("Please enter a title.");
      return;
    }
    var posts = getData("posts");
    var post = {
      id: postNewId(),
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      image: data.image,
      date: data.date,
      createdAt: new Date().toISOString(),
      contentHtml: data.contentHtml,
      status: statusOverride === "published" ? "published" : "draft",
      postType: data.postType,
      authorName: data.authorName,
      tags: data.tags,
      gallery: data.gallery,
      slug: data.slug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      focusKeywords: data.focusKeywords,
      ogImage: data.ogImage,
    };
    posts.unshift(post);
    try {
      saveData("posts", posts);
      syncPostToDashboardPages(post);
      if (window.AppNotifications) {
        window.AppNotifications.push({
          title: post.status === "published" ? "Post published" : "Draft saved",
          message: post.title,
          type: "success",
        });
      }
      window.location.href = "pages.html";
    } catch (e) {
      window.alert("Could not save.");
    }
  }

  function initAddPageFileUploads() {
    function wire(fileInput, urlInput, dropZone) {
      if (!fileInput || !urlInput || !dropZone) return;
      function read(f) {
        if (!f || !f.type.match(/^image\//)) return;
        var reader = new FileReader();
        reader.onload = function () {
          urlInput.value = reader.result;
          var mid = document.getElementById("add-page-featured-media-id");
          if (mid) mid.value = "";
          if (typeof window.__addPageFeaturedPreviewUpdate === "function") {
            window.__addPageFeaturedPreviewUpdate();
          }
        };
        reader.readAsDataURL(f);
      }
      fileInput.addEventListener("change", function () {
        if (fileInput.files[0]) read(fileInput.files[0]);
      });
      ["dragenter", "dragover"].forEach(function (ev) {
        dropZone.addEventListener(ev, function (e) {
          e.preventDefault();
          dropZone.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        dropZone.addEventListener(ev, function (e) {
          e.preventDefault();
          dropZone.classList.remove("is-dragover");
        });
      });
      dropZone.addEventListener("drop", function (e) {
        var f = e.dataTransfer.files[0];
        read(f);
      });
    }
    wire(
      document.getElementById("add-page-featured-file"),
      document.getElementById("add-page-featured-url"),
      document.getElementById("add-page-featured-drop")
    );
    wire(
      document.getElementById("add-page-og-file"),
      document.getElementById("add-page-og-url"),
      document.getElementById("add-page-og-drop")
    );
    var gFile = document.getElementById("add-page-gallery-file");
    var gHidden = document.getElementById("add-page-gallery-urls");
    var gDrop = document.getElementById("add-page-gallery-drop");
    if (gFile && gHidden && gDrop) {
      var arr = [];
      function saveG() {
        gHidden.value = JSON.stringify(arr);
      }
      function readG(f) {
        if (!f || !f.type.match(/^image\//)) return;
        var reader = new FileReader();
        reader.onload = function () {
          arr.push(reader.result);
          saveG();
        };
        reader.readAsDataURL(f);
      }
      gFile.addEventListener("change", function () {
        Array.prototype.forEach.call(gFile.files || [], readG);
      });
      ["dragenter", "dragover"].forEach(function (ev) {
        gDrop.addEventListener(ev, function (e) {
          e.preventDefault();
          gDrop.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        gDrop.addEventListener(ev, function (e) {
          e.preventDefault();
          gDrop.classList.remove("is-dragover");
        });
      });
      gDrop.addEventListener("drop", function (e) {
        Array.prototype.forEach.call(e.dataTransfer.files || [], readG);
      });
    }
  }

  function initAddPageSeoPreview() {
    var mt = document.getElementById("add-page-meta-title");
    var md = document.getElementById("add-page-meta-desc");
    var sl = document.getElementById("add-page-slug");
    var pt = document.getElementById("seo-preview-title");
    var pd = document.getElementById("seo-preview-desc");
    var pu = document.getElementById("seo-preview-url");
    var titleIn = document.getElementById("add-page-title");

    function upd() {
      var tit = (titleIn && titleIn.value) || "";
      if (pt) pt.textContent = (mt && mt.value) || tit || "YOUR META TITLE WILL APPEAR HERE";
      if (pd) pd.textContent = (md && md.value) || "Description preview…";
      if (pu) pu.textContent = "creestudios.com/" + ((sl && sl.value) || "post-slug");
    }
    [mt, md, sl, titleIn].forEach(function (el) {
      if (el) el.addEventListener("input", upd);
    });
    upd();
    var mc = document.getElementById("add-page-meta-count");
    if (md && mc) {
      function mcUpd() {
        mc.textContent = (md.value || "").length + "/160";
      }
      md.addEventListener("input", mcUpd);
      mcUpd();
    }
  }

  function initAddPageRtl() {
    var btn = document.getElementById("add-page-lang-toggle");
    if (!btn) return;
    var ar = false;
    btn.addEventListener("click", function () {
      ar = !ar;
      document.documentElement.setAttribute("dir", ar ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", ar ? "ar" : "en");
      document.body.classList.toggle("is-rtl", ar);
      btn.setAttribute("aria-pressed", ar ? "true" : "false");
      btn.textContent = ar ? "AR" : "EN";
    });
  }

  function initAddPageTagSuggestions() {
    var ul = document.getElementById("add-page-tag-suggestions");
    var input = document.getElementById("add-page-tag-input");
    if (!ul || !input) return;
    var sug = ["Design", "UI/UX", "Branding", "Motion", "Development"];
    sug.forEach(function (name) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "add-page__tag-suggestion";
      b.textContent = name + " · 0";
      b.addEventListener("click", function () {
        if (typeof window.__addPageAddTag === "function") {
          window.__addPageAddTag(name);
        }
      });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }

  var ADD_PAGE_MEDIA_KEY = "dashboard_media";

  function loadMediaLibrary() {
    try {
      var raw = localStorage.getItem(ADD_PAGE_MEDIA_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveMediaLibrary(list) {
    try {
      localStorage.setItem(ADD_PAGE_MEDIA_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      window.alert("Could not save media library.");
      return false;
    }
  }

  function addPagePickerFormatBytes(bytes) {
    if (bytes < 1024) return Math.round(bytes) + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  function addPagePickerNewMediaId() {
    return "m_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
  }

  function addPagePickerTodayISO() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function initAddPageImagePicker() {
    var picker = document.getElementById("add-page-media-picker");
    var grid = document.getElementById("add-page-picker-grid");
    var emptyEl = document.getElementById("add-page-picker-empty");
    var useBtn = document.getElementById("add-page-picker-use");
    var urlInput = document.getElementById("add-page-featured-url");
    var mediaIdInput = document.getElementById("add-page-featured-media-id");
    var previewWrap = document.getElementById("add-page-featured-preview-wrap");
    var previewImg = document.getElementById("add-page-featured-preview-img");
    var clearBtn = document.getElementById("add-page-clear-featured");
    var selectBtn = document.getElementById("add-page-select-media");
    var pickerFile = document.getElementById("add-page-picker-file");
    var uploadBtn = document.getElementById("add-page-picker-upload-btn");
    var featuredFile = document.getElementById("add-page-featured-file");

    if (!picker || !grid || !urlInput) return;

    var selectedPickerId = null;

    function renderPickerGrid() {
      var list = loadMediaLibrary();
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.hidden = list.length > 0;
      }
      if (list.length === 0) {
        selectedPickerId = null;
        if (useBtn) useBtn.disabled = true;
        return;
      }
      list.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "add-page-media-picker__item";
        btn.setAttribute("data-id", item.id);
        if (selectedPickerId === item.id) btn.classList.add("is-selected");
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title || "";
        var badge = document.createElement("span");
        badge.className = "add-page-media-picker__item-badge";
        badge.textContent = item.used ? "Used" : "Unused";
        btn.appendChild(img);
        btn.appendChild(badge);
        btn.addEventListener("click", function () {
          selectedPickerId = item.id;
          grid.querySelectorAll(".add-page-media-picker__item").forEach(function (el) {
            el.classList.toggle("is-selected", el.getAttribute("data-id") === selectedPickerId);
          });
          if (useBtn) useBtn.disabled = false;
        });
        grid.appendChild(btn);
      });
    }

    function openPicker() {
      selectedPickerId = mediaIdInput && mediaIdInput.value ? mediaIdInput.value : null;
      renderPickerGrid();
      if (useBtn) useBtn.disabled = !selectedPickerId;
      picker.removeAttribute("hidden");
      picker.classList.add("is-open");
      picker.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closePicker() {
      picker.classList.remove("is-open");
      picker.setAttribute("aria-hidden", "true");
      picker.setAttribute("hidden", "");
      document.body.style.overflow = "";
    }

    function markFeaturedMediaUsed(newId) {
      var list = loadMediaLibrary();
      var prevId = mediaIdInput ? mediaIdInput.value : "";
      if (prevId && prevId !== newId) {
        var pi = list.findIndex(function (x) {
          return x.id === prevId;
        });
        if (pi !== -1) list[pi].used = false;
      }
      if (newId) {
        var ni = list.findIndex(function (x) {
          return x.id === newId;
        });
        if (ni !== -1) list[ni].used = true;
      }
      saveMediaLibrary(list);
    }

    function applySelectedImage() {
      if (!selectedPickerId) return;
      var list = loadMediaLibrary();
      var item = list.find(function (x) {
        return x.id === selectedPickerId;
      });
      if (!item) return;
      markFeaturedMediaUsed(item.id);
      if (mediaIdInput) mediaIdInput.value = item.id;
      urlInput.value = item.src;
      updateFeaturedPreview();
      closePicker();
    }

    function updateFeaturedPreview() {
      var u = urlInput.value || "";
      if (previewWrap && previewImg) {
        if (u) {
          previewImg.src = u;
          previewImg.alt = "Featured preview";
          previewWrap.hidden = false;
          if (clearBtn) clearBtn.hidden = false;
        } else {
          previewWrap.hidden = true;
          previewImg.src = "";
          if (clearBtn) clearBtn.hidden = true;
        }
      }
    }

    window.__addPageFeaturedPreviewUpdate = updateFeaturedPreview;
    updateFeaturedPreview();

    if (selectBtn) selectBtn.addEventListener("click", openPicker);

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        var prevId = mediaIdInput ? mediaIdInput.value : "";
        if (prevId) {
          var list = loadMediaLibrary();
          var pi = list.findIndex(function (x) {
            return x.id === prevId;
          });
          if (pi !== -1) {
            list[pi].used = false;
            saveMediaLibrary(list);
          }
        }
        urlInput.value = "";
        if (mediaIdInput) mediaIdInput.value = "";
        if (featuredFile) featuredFile.value = "";
        updateFeaturedPreview();
      });
    }

    var closeBtn = document.getElementById("add-page-picker-close");
    if (closeBtn) closeBtn.addEventListener("click", closePicker);
    picker.querySelectorAll("[data-picker-close]").forEach(function (el) {
      el.addEventListener("click", closePicker);
    });
    if (useBtn) useBtn.addEventListener("click", applySelectedImage);

    if (uploadBtn && pickerFile) {
      uploadBtn.addEventListener("click", function () {
        pickerFile.click();
      });
      pickerFile.addEventListener("change", function () {
        var file = pickerFile.files && pickerFile.files[0];
        pickerFile.value = "";
        if (!file || !file.type.match(/^image\//)) return;
        var reader = new FileReader();
        reader.onload = function () {
          var entry = {
            id: addPagePickerNewMediaId(),
            src: reader.result,
            title: file.name.replace(/\.[^.]+$/, "") || "Untitled",
            description: "",
            size: addPagePickerFormatBytes(file.size),
            date: addPagePickerTodayISO(),
            used: false,
          };
          var list = loadMediaLibrary();
          list.unshift(entry);
          if (!saveMediaLibrary(list)) return;
          selectedPickerId = entry.id;
          renderPickerGrid();
          if (useBtn) useBtn.disabled = false;
        };
        reader.readAsDataURL(file);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!picker.classList.contains("is-open")) return;
      e.preventDefault();
      closePicker();
    });
  }

  function initAddPage() {
    var form = document.getElementById("add-page-form");
    if (!form) return;

    ensureDummyPosts();
    var cat = document.getElementById("add-page-category");
    if (cat && cat.options.length <= 1) {
      POST_CATEGORIES.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        cat.appendChild(o);
      });
    }
    var auth = document.getElementById("add-page-author");
    if (auth && auth.options.length <= 1) {
      getData("users").forEach(function (u) {
        var o = document.createElement("option");
        o.value = u.name || u.email || "";
        o.textContent = u.name || u.email || "User";
        auth.appendChild(o);
      });
    }
    var ptype = document.getElementById("add-page-post-type");
    if (ptype && ptype.options.length <= 1) {
      ["Project", "Blog", "Case Study", "News"].forEach(function (p) {
        var o = document.createElement("option");
        o.value = p;
        o.textContent = p;
        ptype.appendChild(o);
      });
    }

    initAddPageRichEditor();
    initAddPageTagPills();
    initAddPageTagSuggestions();
    initAddPageFileUploads();
    initAddPageImagePicker();
    initAddPageSeoPreview();
    initAddPageRtl();

    var draftBtn = document.getElementById("add-page-save-draft");
    var prevBtn = document.getElementById("add-page-preview");
    var pubBtn = document.getElementById("add-page-publish");
    var draftSeg = document.getElementById("add-page-status-draft");
    var pubSeg = document.getElementById("add-page-status-published");

    function setStatus(isPub) {
      if (draftSeg) {
        draftSeg.setAttribute("aria-pressed", !isPub ? "true" : "false");
        draftSeg.classList.toggle("is-active", !isPub);
      }
      if (pubSeg) {
        pubSeg.setAttribute("aria-pressed", isPub ? "true" : "false");
        pubSeg.classList.toggle("is-active", isPub);
      }
    }
    if (draftSeg) {
      draftSeg.addEventListener("click", function () {
        setStatus(false);
      });
    }
    if (pubSeg) {
      pubSeg.addEventListener("click", function () {
        setStatus(true);
      });
    }
    setStatus(false);

    if (draftBtn) {
      draftBtn.addEventListener("click", function () {
        setStatus(false);
        savePostFromAddPage("draft");
      });
    }
    if (pubBtn) {
      pubBtn.addEventListener("click", function () {
        setStatus(true);
        savePostFromAddPage("published");
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var d = gatherAddPageFormData();
        var w = window.open("", "_blank");
        if (!w) return;
        var esc = function (s) {
          return String(s || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        };
        w.document.write(
          "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Preview</title></head><body style='background:#111;color:#EDEDED;padding:2rem;font-family:sans-serif'>" +
            "<h1>" +
            esc(d.title) +
            "</h1><p>" +
            esc(d.subtitle) +
            "</p><div>" +
            (d.contentHtml || "") +
            "</div></body></html>"
        );
        w.document.close();
      });
    }
  }

  function initHelpPage() {
    if (!document.body.classList.contains("help-page")) return;

    var STORAGE_KEY = "dashboard_faq";
    var DEFAULT_FAQ_STATIC = {
      intro:
        "Browse the topics below or use search. These answers are shown when no saved FAQ is found in your browser.",
      items: [
        {
          id: "d1",
          question: "How do I reset my password?",
          answer:
            "Open Settings → Security and use “Change password”. You will receive a confirmation email.",
        },
        {
          id: "d2",
          question: "Where can I manage my subscription?",
          answer:
            "Go to Settings → Billing to view your plan, payment method, and invoices.",
        },
        {
          id: "d3",
          question: "How do I invite teammates?",
          answer:
            "From Users or Team settings, send an invite link or email. They must accept to gain access.",
        },
      ],
    };
    var state = { faqNormalized: null, searchQuery: "" };

    function escapeRegExp(s) {
      return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    function highlightText(text, query) {
      var t = escapeHtml(text);
      var q = String(query || "").trim();
      if (!q) return t;
      var re = new RegExp("(" + escapeRegExp(q) + ")", "gi");
      return t.replace(re, '<mark class="help-mark">$1</mark>');
    }
    function loadFAQ() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return {
            source: "default",
            intro: DEFAULT_FAQ_STATIC.intro,
            items: DEFAULT_FAQ_STATIC.items.slice(),
          };
        }
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
          return {
            source: "default",
            intro: DEFAULT_FAQ_STATIC.intro,
            items: DEFAULT_FAQ_STATIC.items.slice(),
          };
        }
        var sections = Array.isArray(parsed.sections) ? parsed.sections : [];
        var intro = typeof parsed.intro === "string" ? parsed.intro : "";
        var items = sections.map(function (sec, i) {
          return {
            id: sec.id || "faq_" + i,
            question: sec.title || "Question",
            answer: sec.content || "",
          };
        });
        if (!items.length) {
          return {
            source: "default",
            intro: DEFAULT_FAQ_STATIC.intro,
            items: DEFAULT_FAQ_STATIC.items.slice(),
          };
        }
        return { source: "storage", intro: intro, items: items };
      } catch (e) {
        return {
          source: "default",
          intro: DEFAULT_FAQ_STATIC.intro,
          items: DEFAULT_FAQ_STATIC.items.slice(),
        };
      }
    }
    function topicSearchBlob(card) {
      var title = card.querySelector(".help-card__title");
      var lis = card.querySelectorAll(".help-card__list li");
      var parts = [];
      if (title) parts.push(title.textContent);
      lis.forEach(function (li) {
        parts.push(li.textContent);
      });
      return parts.join(" ").toLowerCase();
    }
    function faqItemMatches(item, qLower) {
      var q = (item.question || "").toLowerCase();
      var a = (item.answer || "").toLowerCase();
      return q.indexOf(qLower) !== -1 || a.indexOf(qLower) !== -1;
    }
    function filterContent(query) {
      state.searchQuery = query;
      var q = String(query || "").trim().toLowerCase();
      var cards = document.querySelectorAll(".help-card");
      var data = state.faqNormalized || loadFAQ();
      cards.forEach(function (card) {
        card.classList.toggle(
          "is-filtered-out",
          !!q && topicSearchBlob(card).indexOf(q) === -1
        );
      });
      var faqItems = document.querySelectorAll(".help-faq-item");
      var introEl = document.getElementById("help-faq-intro");
      if (introEl && !introEl.hidden && state.faqNormalized && state.faqNormalized.intro) {
        var plainIntro = state.faqNormalized.intro;
        var introHits = !q || plainIntro.toLowerCase().indexOf(q) !== -1;
        introEl.classList.toggle("is-filtered-out", q.length > 0 && !introHits);
        introEl.innerHTML = !q || !introHits ? escapeHtml(plainIntro) : highlightText(plainIntro, query);
      }
      faqItems.forEach(function (el, index) {
        var item = data.items[index];
        if (!item) return;
        var match = !q || faqItemMatches(item, q);
        el.classList.toggle("is-filtered-out", !match);
        var qEl = el.querySelector(".help-faq-item__q");
        var aEl = el.querySelector(".help-faq-item__a");
        if (qEl) qEl.innerHTML = highlightText(item.question || "", q ? query : "");
        if (aEl) {
          aEl.innerHTML = highlightText(item.answer || "", q ? query : "").replace(
            /\n/g,
            "<br />"
          );
        }
      });
      var emptyMsg = document.querySelector(".help-empty-faq");
      if (emptyMsg && q) {
        var visibleFaq = Array.prototype.some.call(faqItems, function (el) {
          return !el.classList.contains("is-filtered-out");
        });
        emptyMsg.style.display = visibleFaq ? "none" : "block";
      }
    }
    function renderFAQ() {
      var data = loadFAQ();
      state.faqNormalized = data;
      var listEl = document.getElementById("help-faq-list");
      var introEl = document.getElementById("help-faq-intro");
      if (!listEl) return;
      listEl.innerHTML = "";
      if (introEl) {
        introEl.classList.remove("is-filtered-out");
        if (data.intro && data.intro.trim()) {
          introEl.hidden = false;
          introEl.textContent = data.intro;
        } else {
          introEl.hidden = true;
          introEl.textContent = "";
        }
      }
      if (!data.items.length) {
        var empty = document.createElement("p");
        empty.className = "help-empty-faq";
        empty.textContent = "No FAQ entries yet. Visit FAQ admin to add content.";
        listEl.appendChild(empty);
        filterContent(state.searchQuery);
        return;
      }
      data.items.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "help-faq-item";
        card.setAttribute("data-faq-id", item.id);
        card.innerHTML = '<h3 class="help-faq-item__q"></h3><p class="help-faq-item__a"></p>';
        listEl.appendChild(card);
      });
      filterContent(state.searchQuery);
    }
    function handleSearch() {
      var input = document.getElementById("help-search-input");
      if (!input) return;
      var run = function () {
        filterContent(input.value);
      };
      input.addEventListener("input", run);
      input.addEventListener("search", run);
    }
    function initHelpNav() {
      var overlay = document.getElementById("help-nav-overlay");
      var burger = document.getElementById("help-burger");
      function openNav() {
        if (!overlay) return;
        overlay.hidden = false;
        overlay.setAttribute("aria-hidden", "false");
        requestAnimationFrame(function () {
          overlay.classList.add("is-open");
        });
        if (burger) burger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
      function closeNav() {
        if (!overlay) return;
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        if (burger) burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        setTimeout(function () {
          overlay.hidden = true;
        }, 260);
      }
      if (burger) burger.addEventListener("click", openNav);
      document.querySelectorAll("[data-help-close-nav]").forEach(function (el) {
        el.addEventListener("click", closeNav);
      });
    }
    var toastTimer;
    function showToast(msg) {
      var t = document.getElementById("help-toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        t.classList.remove("is-show");
      }, 2400);
    }
    var contact = document.getElementById("help-btn-contact");
    if (contact) {
      contact.addEventListener("click", function () {
        showToast("Opening mail to support…");
        window.location.href =
          "mailto:support@creestudios.example?subject=Dashboard%20support%20request";
      });
    }
    renderFAQ();
    handleSearch();
    initHelpNav();
  }

  function initFeaturesPage() {
    if (!document.body.classList.contains("fm-page")) return;

    var formEl = document.getElementById("fm-form");
    var gridEl = document.getElementById("fm-grid");
    var modalEl = document.getElementById("fm-modal");
    if (!formEl || !gridEl || !modalEl) return;

    var STORAGE_KEY = "dashboard_features";
    var currentFilter = "all";
    var editingId = null;

    function defaultFeatures() {
      return [
        {
          id: "f_seed_1",
          title: "Dark Mode",
          description: "Toggle between light and dark themes across the dashboard.",
          category: "UI/UX",
          status: "live",
          active: true,
          updatedAt: "2026-04-05",
          author: "Sarah Chen",
        },
        {
          id: "f_seed_2",
          title: "Analytics Export",
          description: "Export charts and metrics to CSV and PDF.",
          category: "Backend",
          status: "dev",
          active: true,
          updatedAt: "2026-04-03",
          author: "Alex Rivera",
        },
        {
          id: "f_seed_3",
          title: "Email Campaigns",
          description: "Schedule and track marketing email performance.",
          category: "Marketing",
          status: "planned",
          active: false,
          updatedAt: "2026-03-28",
          author: "Jordan Lee",
        },
        {
          id: "f_seed_4",
          title: "Keyboard Shortcuts",
          description: "Power-user shortcuts for navigation and actions.",
          category: "UI/UX",
          status: "live",
          active: true,
          updatedAt: "2026-04-01",
          author: "Morgan Chen",
        },
        {
          id: "f_seed_5",
          title: "API Webhooks",
          description: "Notify external systems on post and user events.",
          category: "Backend",
          status: "dev",
          active: false,
          updatedAt: "2026-03-30",
          author: "Sam Okonkwo",
        },
        {
          id: "f_seed_6",
          title: "Landing A/B Tests",
          description: "Compare conversion on alternate hero copy.",
          category: "Marketing",
          status: "planned",
          active: true,
          updatedAt: "2026-03-25",
          author: "Riley Park",
        },
      ];
    }

    function loadFeatures() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          var seed = defaultFeatures();
          saveFeatures(seed);
          return seed.slice();
        }
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function saveFeatures(list) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function newId() {
      return (
        "f_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 9)
      );
    }

    function todayISO() {
      var d = new Date();
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var day = String(d.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + day;
    }

    function formatDisplayDate(iso) {
      if (!iso) return "—";
      var p = iso.split("-");
      if (p.length !== 3) return iso;
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var mi = parseInt(p[1], 10) - 1;
      return months[mi] + " " + parseInt(p[2], 10) + ", " + p[0];
    }

    function statusLabel(s) {
      if (s === "live") return "Live";
      if (s === "dev") return "In dev";
      if (s === "planned") return "Planned";
      return s;
    }

    function statusTagClass(s) {
      if (s === "live") return "fm-tag--live";
      if (s === "dev") return "fm-tag--dev";
      return "fm-tag--planned";
    }

    function filterFeatures(list, filter) {
      if (filter === "active")
        return list.filter(function (f) {
          return f.active;
        });
      if (filter === "inactive")
        return list.filter(function (f) {
          return !f.active;
        });
      return list.slice();
    }

    function computeStats(list) {
      var total = list.length;
      var active = list.filter(function (f) {
        return f.active;
      }).length;
      var live = list.filter(function (f) {
        return f.status === "live";
      }).length;
      var dev = list.filter(function (f) {
        return f.status === "dev";
      }).length;
      var planned = list.filter(function (f) {
        return f.status === "planned";
      }).length;
      return { total: total, active: active, live: live, dev: dev, planned: planned };
    }

    function updateStatsBar(list) {
      var s = computeStats(list);
      var sub = document.getElementById("fm-subtitle");
      if (sub) sub.textContent = s.total + " total features";
      document.getElementById("fm-stat-total").textContent = String(s.total);
      document.getElementById("fm-stat-active").textContent = String(s.active);
      document.getElementById("fm-stat-live-dev").textContent = s.live + " / " + s.dev;
      document.getElementById("fm-stat-planned").textContent = String(s.planned);
    }

    function renderFeatures() {
      var all = loadFeatures();
      updateStatsBar(all);
      var filtered = filterFeatures(all, currentFilter);
      var grid = document.getElementById("fm-grid");
      if (!grid) return;
      grid.innerHTML = "";

      if (filtered.length === 0) {
        var empty = document.createElement("div");
        empty.className = "fm-empty";
        empty.textContent =
          all.length === 0 ? "No features yet" : "No features match this filter";
        grid.appendChild(empty);
        return;
      }

      filtered.forEach(function (f) {
        var card = document.createElement("article");
        card.className = "fm-card";
        card.setAttribute("data-id", f.id);

        var top = document.createElement("div");
        top.className = "fm-card__top";

        var left = document.createElement("div");
        var h = document.createElement("h3");
        h.className = "fm-card__title";
        h.textContent = f.title;
        var p = document.createElement("p");
        p.className = "fm-card__desc";
        p.textContent = f.description;
        left.appendChild(h);
        left.appendChild(p);

        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "fm-toggle";
        toggle.setAttribute("role", "switch");
        toggle.setAttribute("aria-checked", f.active ? "true" : "false");
        toggle.setAttribute("aria-label", "Toggle active");
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var cur = loadFeatures();
          var item = cur.find(function (x) {
            return x.id === f.id;
          });
          if (!item) return;
          item.active = !item.active;
          item.updatedAt = todayISO();
          updateFeature(item, { silent: true });
          showToast("Feature saved");
        });

        top.appendChild(left);
        top.appendChild(toggle);
        card.appendChild(top);

        var tags = document.createElement("div");
        tags.className = "fm-tags";
        var t1 = document.createElement("span");
        t1.className = "fm-tag fm-tag--cat";
        t1.textContent = f.category;
        var t2 = document.createElement("span");
        t2.className = "fm-tag " + statusTagClass(f.status);
        t2.textContent = statusLabel(f.status);
        tags.appendChild(t1);
        tags.appendChild(t2);
        card.appendChild(tags);

        var meta = document.createElement("p");
        meta.className = "fm-card__meta";
        meta.textContent = "Modified " + formatDisplayDate(f.updatedAt) + " by " + (f.author || "—");
        card.appendChild(meta);

        var bottom = document.createElement("div");
        bottom.className = "fm-card__bottom";

        var actions = document.createElement("div");
        actions.className = "fm-card__actions";
        var btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.className = "fm-btn fm-btn--ghost";
        btnEdit.textContent = "Edit";
        btnEdit.addEventListener("click", function () {
          openModalEdit(f.id);
        });
        var btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.className = "fm-btn fm-btn--danger";
        btnDel.textContent = "Delete";
        btnDel.addEventListener("click", function () {
          if (window.confirm("Delete this feature?")) {
            deleteFeature(f.id);
          }
        });
        actions.appendChild(btnEdit);
        actions.appendChild(btnDel);
        bottom.appendChild(actions);
        card.appendChild(bottom);

        grid.appendChild(card);
      });
    }

    function addFeature(entry) {
      var list = loadFeatures();
      list.push(entry);
      saveFeatures(list);
      renderFeatures();
      showToast("Feature saved");
    }

    function updateFeature(entry, options) {
      options = options || {};
      var list = loadFeatures();
      var i = list.findIndex(function (x) {
        return x.id === entry.id;
      });
      if (i === -1) return;
      list[i] = entry;
      saveFeatures(list);
      renderFeatures();
      if (!options.silent) {
        showToast(options.message || "Feature saved");
      }
    }

    function deleteFeature(id) {
      var list = loadFeatures().filter(function (x) {
        return x.id !== id;
      });
      saveFeatures(list);
      renderFeatures();
      showToast("Feature removed");
    }

    var toastTimer;
    function showToast(msg) {
      var t = document.getElementById("fm-toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        t.classList.remove("is-show");
      }, 2200);
    }

    function clearFormErrors() {
      ["title", "desc", "cat", "status", "author"].forEach(function (k) {
        var el = document.getElementById("fm-err-" + k);
        if (el) el.textContent = "";
      });
    }

    function validateForm() {
      clearFormErrors();
      var ok = true;
      var title = document.getElementById("fm-f-title").value.trim();
      var desc = document.getElementById("fm-f-desc").value.trim();
      var cat = document.getElementById("fm-f-cat").value;
      var status = document.getElementById("fm-f-status").value;
      var author = document.getElementById("fm-f-author").value.trim();

      if (!title) {
        document.getElementById("fm-err-title").textContent = "Title is required";
        ok = false;
      }
      if (!desc) {
        document.getElementById("fm-err-desc").textContent = "Description is required";
        ok = false;
      }
      if (!cat) {
        document.getElementById("fm-err-cat").textContent = "Select a category";
        ok = false;
      }
      if (!status) {
        document.getElementById("fm-err-status").textContent = "Select a status";
        ok = false;
      }
      if (!author) {
        document.getElementById("fm-err-author").textContent = "Author is required";
        ok = false;
      }
      return ok;
    }

    function openModalAdd() {
      editingId = null;
      document.getElementById("fm-modal-title").textContent = "Add feature";
      document.getElementById("fm-f-title").value = "";
      document.getElementById("fm-f-desc").value = "";
      document.getElementById("fm-f-cat").value = "";
      document.getElementById("fm-f-status").value = "";
      document.getElementById("fm-f-author").value = "";
      clearFormErrors();
      openModal();
    }

    function openModalEdit(id) {
      var list = loadFeatures();
      var f = list.find(function (x) {
        return x.id === id;
      });
      if (!f) return;
      editingId = id;
      document.getElementById("fm-modal-title").textContent = "Edit feature";
      document.getElementById("fm-f-title").value = f.title;
      document.getElementById("fm-f-desc").value = f.description;
      document.getElementById("fm-f-cat").value = f.category;
      document.getElementById("fm-f-status").value = f.status;
      document.getElementById("fm-f-author").value = f.author;
      clearFormErrors();
      openModal();
    }

    function openModal() {
      var m = document.getElementById("fm-modal");
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      var m = document.getElementById("fm-modal");
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      editingId = null;
    }

    document.getElementById("fm-form").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      var title = document.getElementById("fm-f-title").value.trim();
      var description = document.getElementById("fm-f-desc").value.trim();
      var category = document.getElementById("fm-f-cat").value;
      var status = document.getElementById("fm-f-status").value;
      var author = document.getElementById("fm-f-author").value.trim();

      if (editingId) {
        var list = loadFeatures();
        var prev = list.find(function (x) {
          return x.id === editingId;
        });
        if (!prev) return;
        updateFeature({
          id: prev.id,
          title: title,
          description: description,
          category: category,
          status: status,
          active: prev.active,
          updatedAt: todayISO(),
          author: author,
        });
      } else {
        addFeature({
          id: newId(),
          title: title,
          description: description,
          category: category,
          status: status,
          active: true,
          updatedAt: todayISO(),
          author: author,
        });
      }
      closeModal();
    });

    document.getElementById("fm-btn-add").addEventListener("click", openModalAdd);
    document.getElementById("fm-btn-cancel").addEventListener("click", closeModal);

    document.getElementById("fm-modal").addEventListener("click", function (e) {
      if (e.target.id === "fm-modal") closeModal();
    });

    document.querySelectorAll(".fm-tab[data-filter]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        currentFilter = tab.getAttribute("data-filter");
        document.querySelectorAll(".fm-tab[data-filter]").forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderFeatures();
      });
    });

    var nav = document.getElementById("fm-nav-overlay");
    var burger = document.getElementById("fm-burger");
    function openNav() {
      nav.removeAttribute("hidden");
      nav.setAttribute("aria-hidden", "false");
      nav.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        nav.setAttribute("hidden", "");
      }, 250);
    }
    if (burger) {
      burger.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }
    document.querySelectorAll("[data-fm-close-nav]").forEach(function (el) {
      el.addEventListener("click", closeNav);
    });

    renderFeatures();

    window.FeaturesAdmin = {
      loadFeatures: loadFeatures,
      saveFeatures: saveFeatures,
      renderFeatures: renderFeatures,
      addFeature: addFeature,
      updateFeature: updateFeature,
      deleteFeature: deleteFeature,
      filterFeatures: filterFeatures,
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

  function initAnalyticsPageExternal() {
    if (!document.body || !document.body.classList.contains("analytics-page")) {
      return;
    }

    var requiredIds = ["an-comments-list", "an-views-num", "an-donuts-root", "an-overlay"];
    var iReq;
    for (iReq = 0; iReq < requiredIds.length; iReq++) {
      if (!document.getElementById(requiredIds[iReq])) {
        return;
      }
    }

    var STORAGE_KEY = "dashboard_analytics";

    var DEFAULT_ANALYTICS = {
      views: 1200000,
      subscribers: 45800,
      clients: {
        total: 287,
        active: 156,
        completed: 89,
        pending: 42,
      },
      likes: 89200,
      appreciations: 12400,
      viewsGrowthPercent: 23,
      subsWeeklyNew: 2342,
      growthRatePercent: 23.5,
      growthCurrent: 250000,
      growthProjected: 308750,
      growthChart: [
        { month: "Jan", value: 150000 },
        { month: "Feb", value: 170000 },
        { month: "Mar", value: 180000 },
        { month: "Apr", value: 160000 },
        { month: "May", value: 210000 },
        { month: "Jun", value: 50000 },
        { month: "Jul", value: 120000 },
        { month: "Aug", value: 250000 },
        { month: "Sep", value: 270000 },
        { month: "Oct", value: 290000 },
        { month: "Nov", value: 310000 },
        { month: "Dec", value: 320000 },
      ],
      commentSort: "mostLiked",
      viewsFilter: "7d",
    };

    var DEFAULT_COMMENTS = [
      { user: "Alex Rivera", text: "Loved the new dashboard layout — super clean.", likes: 142, time: "2h ago", ts: Date.now() - 7200000 },
      { user: "Jordan Lee", text: "Can we export reports to PDF?", likes: 89, time: "5h ago", ts: Date.now() - 18000000 },
      { user: "Sam Okonkwo", text: "Analytics load time feels instant now.", likes: 256, time: "1d ago", ts: Date.now() - 86400000 },
      { user: "Morgan Chen", text: "Dark mode mint accent is perfect.", likes: 67, time: "2d ago", ts: Date.now() - 172800000 },
      { user: "Riley Park", text: "Notifications could use grouping.", likes: 34, time: "3d ago", ts: Date.now() - 259200000 },
    ];

    var DONUT_DEFS = [
      {
        title: "User segments",
        segments: [
          { label: "Main", value: 45, color: "#5be7c4" },
          { label: "Secondary", value: 35, color: "#8fd9c4" },
          { label: "Casual", value: 20, color: "#c4b89a" },
        ],
      },
      {
        title: "Traffic sources",
        segments: [
          { label: "Organic", value: 52, color: "#5be7c4" },
          { label: "Direct", value: 28, color: "#7dd4bc" },
          { label: "Referral", value: 20, color: "#b8a88c" },
        ],
      },
      {
        title: "Device usage",
        segments: [
          { label: "Desktop", value: 48, color: "#5be7c4" },
          { label: "Mobile", value: 42, color: "#9ae0cc" },
          { label: "Tablet", value: 10, color: "#a89b82" },
        ],
      },
      {
        title: "Plan type",
        segments: [
          { label: "Pro", value: 40, color: "#5be7c4" },
          { label: "Team", value: 35, color: "#86d8c0" },
          { label: "Free", value: 25, color: "#c9bc9f" },
        ],
      },
      {
        title: "Regional users",
        segments: [
          { label: "NA", value: 44, color: "#5be7c4" },
          { label: "EU", value: 33, color: "#7ecfb8" },
          { label: "APAC", value: 23, color: "#b5a78e" },
        ],
      },
      {
        title: "Activity time",
        segments: [
          { label: "Day", value: 38, color: "#5be7c4" },
          { label: "Evening", value: 37, color: "#8be0cd" },
          { label: "Night", value: 25, color: "#ada08a" },
        ],
      },
    ];

    function formatCompact(n) {
      if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 1 : 1).replace(/\.0$/, "") + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 1 : 1).replace(/\.0$/, "") + "K";
      return String(Math.round(n));
    }

    function formatInt(n) {
      return Math.round(n).toLocaleString("en-US");
    }

    function deepMerge(base, extra) {
      if (!extra || typeof extra !== "object" || Array.isArray(extra)) {
        return JSON.parse(JSON.stringify(base));
      }
      var out = {};
      var k;
      for (k in base) {
        if (!Object.prototype.hasOwnProperty.call(base, k)) continue;
        if (
          base[k] !== null &&
          typeof base[k] === "object" &&
          !Array.isArray(base[k]) &&
          extra[k] &&
          typeof extra[k] === "object" &&
          !Array.isArray(extra[k])
        ) {
          out[k] = deepMerge(base[k], extra[k]);
        } else {
          out[k] = Object.prototype.hasOwnProperty.call(extra, k) ? extra[k] : base[k];
        }
      }
      for (k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k) && !Object.prototype.hasOwnProperty.call(out, k)) {
          out[k] = extra[k];
        }
      }
      return out;
    }

    function saveAnalytics(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    }

    function loadAnalytics() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          var initial = JSON.parse(JSON.stringify(DEFAULT_ANALYTICS));
          initial.comments = DEFAULT_COMMENTS.slice();
          saveAnalytics(initial);
          return initial;
        }
        var parsed = JSON.parse(raw);
        var merged = deepMerge(DEFAULT_ANALYTICS, parsed);
        if (!merged.comments || !Array.isArray(merged.comments) || merged.comments.length === 0) {
          merged.comments = DEFAULT_COMMENTS.slice();
        }
        if (!merged.growthChart || merged.growthChart.length === 0) {
          merged.growthChart = DEFAULT_ANALYTICS.growthChart.slice();
        }
        return merged;
      } catch (e) {
        var fallback = JSON.parse(JSON.stringify(DEFAULT_ANALYTICS));
        fallback.comments = DEFAULT_COMMENTS.slice();
        return fallback;
      }
    }

    function smoothLinePath(points) {
      var n = points.length;
      if (n < 2) return "";
      var d = "M " + points[0].x + " " + points[0].y;
      var i;
      for (i = 0; i < n - 1; i++) {
        var p0 = points[Math.max(0, i - 1)];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = points[Math.min(n - 1, i + 2)];
        var cp1x = p1.x + (p2.x - p0.x) / 6;
        var cp1y = p1.y + (p2.y - p0.y) / 6;
        var cp2x = p2.x - (p3.x - p1.x) / 6;
        var cp2y = p2.y - (p3.y - p1.y) / 6;
        d += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + p2.x + " " + p2.y;
      }
      return d;
    }

    function renderChart(container, series, opts) {
      opts = opts || {};
      var w = opts.width || 800;
      var h = opts.height || 260;
      var padL = 48;
      var padR = 16;
      var padT = 20;
      var padB = 36;
      var innerW = w - padL - padR;
      var innerH = h - padT - padB;
      var values = series.map(function (d) {
        return d.value;
      });
      var maxV = Math.max.apply(null, values) * 1.05;
      var minV = 0;
      var n = series.length;
      var points = series.map(function (d, i) {
        var x = padL + (innerW * i) / Math.max(1, n - 1);
        var y = padT + innerH - ((d.value - minV) / (maxV - minV || 1)) * innerH;
        return { x: x, y: y };
      });
      var lineD = smoothLinePath(points);
      var last = points[points.length - 1];
      var first = points[0];
      var fillD = lineD + " L " + last.x + " " + (h - padB) + " L " + first.x + " " + (h - padB) + " Z";

      var yTicks = 4;
      var yLabels = [];
      var ti;
      for (ti = 0; ti <= yTicks; ti++) {
        var frac = ti / yTicks;
        var val = minV + (maxV - minV) * (1 - frac);
        var ly = padT + innerH * frac;
        yLabels.push({ y: ly, text: formatCompact(val) });
      }

      var svg =
        '<svg viewBox="0 0 ' +
        w +
        " " +
        h +
        '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        "<defs>" +
        '<linearGradient id="anChartGrad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#5be7c4" stop-opacity="0.35"/>' +
        '<stop offset="100%" stop-color="#5be7c4" stop-opacity="0"/>' +
        "</linearGradient>" +
        "</defs>" +
        '<g stroke="rgba(255,255,255,0.08)" stroke-width="1">';
      for (ti = 0; ti < yLabels.length; ti++) {
        svg +=
          '<line x1="' +
          padL +
          '" y1="' +
          yLabels[ti].y +
          '" x2="' +
          (w - padR) +
          '" y2="' +
          yLabels[ti].y +
          '"/>';
      }
      svg += "</g>";

      for (ti = 0; ti < yLabels.length; ti++) {
        svg +=
          '<text x="' +
          (padL - 8) +
          '" y="' +
          (yLabels[ti].y + 4) +
          '" fill="#a1a1a1" font-size="10" text-anchor="end" font-family="Unbounded, sans-serif">' +
          yLabels[ti].text +
          "</text>";
      }

      svg +=
        '<path d="' +
        fillD +
        '" fill="url(#anChartGrad)" stroke="none"/>' +
        '<path d="' +
        lineD +
        '" fill="none" stroke="#5be7c4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';

      series.forEach(function (d, i) {
        var px = points[i].x;
        svg +=
          '<text x="' +
          px +
          '" y="' +
          (h - 8) +
          '" fill="#a1a1a1" font-size="9" text-anchor="middle" font-family="Unbounded, sans-serif">' +
          d.month +
          "</text>";
      });

      svg += "</svg>";
      container.innerHTML = svg;
    }

    function polar(cx, cy, r, angleDeg) {
      var rad = ((angleDeg - 90) * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function donutArcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
      var p1 = polar(cx, cy, rOuter, startAngle);
      var p2 = polar(cx, cy, rOuter, endAngle);
      var p3 = polar(cx, cy, rInner, endAngle);
      var p4 = polar(cx, cy, rInner, startAngle);
      var large = endAngle - startAngle > 180 ? 1 : 0;
      return [
        "M",
        p1.x,
        p1.y,
        "A",
        rOuter,
        rOuter,
        0,
        large,
        1,
        p2.x,
        p2.y,
        "L",
        p3.x,
        p3.y,
        "A",
        rInner,
        rInner,
        0,
        large,
        0,
        p4.x,
        p4.y,
        "Z",
      ].join(" ");
    }

    function renderDonut(container, title, segments) {
      var card = document.createElement("article");
      card.className = "an-card an-donut-card";
      card.setAttribute("aria-label", title);

      var h = document.createElement("h3");
      h.className = "an-card__title";
      h.textContent = title;
      card.appendChild(h);

      var wrap = document.createElement("div");
      wrap.className = "an-donut-card__chart";

      var total = segments.reduce(function (s, x) {
        return s + x.value;
      }, 0);
      var cx = 50;
      var cy = 50;
      var rO = 38;
      var rI = 24;
      var start = 0;
      var svgNS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      segments.forEach(function (seg) {
        var sweep = (seg.value / total) * 360;
        var end = start + sweep;
        if (sweep > 0.1) {
          var path = document.createElementNS(svgNS, "path");
          path.setAttribute("d", donutArcPath(cx, cy, rO, rI, start, end));
          path.setAttribute("fill", seg.color);
          svg.appendChild(path);
        }
        start = end;
      });

      wrap.appendChild(svg);
      card.appendChild(wrap);

      var leg = document.createElement("div");
      leg.className = "an-legend";
      segments.forEach(function (seg) {
        var row = document.createElement("div");
        row.className = "an-legend__row";
        var sw = document.createElement("span");
        sw.className = "an-legend__swatch";
        sw.style.background = seg.color;
        var tx = document.createElement("span");
        tx.textContent = seg.label + " · " + seg.value + "%";
        row.appendChild(sw);
        row.appendChild(tx);
        leg.appendChild(row);
      });
      card.appendChild(leg);

      container.appendChild(card);
    }

    function renderComments(data) {
      var list = document.getElementById("an-comments-list");
      if (!list) return;
      var sort = data.commentSort === "recent" ? "recent" : "mostLiked";
      var items = (data.comments || []).slice();
      if (sort === "mostLiked") {
        items.sort(function (a, b) {
          return (b.likes || 0) - (a.likes || 0);
        });
      } else {
        items.sort(function (a, b) {
          return (b.ts || 0) - (a.ts || 0);
        });
      }
      list.innerHTML = "";
      items.forEach(function (c) {
        var el = document.createElement("article");
        el.className = "an-comment";
        el.innerHTML =
          '<div class="an-comment__head">' +
          '<span class="an-comment__user"></span>' +
          '<span class="an-comment__time"></span>' +
          "</div>" +
          '<p class="an-comment__text"></p>' +
          '<div class="an-comment__meta"><span class="an-comment__likes"></span> likes</div>';
        el.querySelector(".an-comment__user").textContent = c.user;
        el.querySelector(".an-comment__time").textContent = c.time;
        el.querySelector(".an-comment__text").textContent = c.text;
        el.querySelector(".an-comment__likes").textContent = c.likes;
        list.appendChild(el);
      });
    }

    function bindUI(data) {
      document.querySelectorAll("[data-comment-sort]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-comment-sort") === data.commentSort);
        btn.onclick = function () {
          data.commentSort = btn.getAttribute("data-comment-sort");
          saveAnalytics(data);
          renderComments(data);
          document.querySelectorAll("[data-comment-sort]").forEach(function (b) {
            b.classList.toggle("is-active", b.getAttribute("data-comment-sort") === data.commentSort);
          });
        };
      });

      document.querySelectorAll("[data-views-filter]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-views-filter") === data.viewsFilter);
        btn.onclick = function () {
          data.viewsFilter = btn.getAttribute("data-views-filter");
          saveAnalytics(data);
          applyViewsFilter(data);
          document.querySelectorAll("[data-views-filter]").forEach(function (b) {
            b.classList.toggle("is-active", b.getAttribute("data-views-filter") === data.viewsFilter);
          });
        };
      });
    }

    function applyViewsFilter(data) {
      var el = document.getElementById("an-views-num");
      if (el) el.textContent = formatCompact(data.views);
    }

    function updateKPIs(data) {
      var vg = document.getElementById("an-views-growth");
      if (vg) vg.textContent = "+" + (data.viewsGrowthPercent || 23) + "% increase from last month";

      var subsNum = document.getElementById("an-subs-num");
      if (subsNum) subsNum.textContent = formatCompact(data.subscribers);
      var note = document.getElementById("an-subs-note");
      if (note) note.textContent = "+" + formatInt(data.subsWeeklyNew || 2342) + " new subscribers this week";

      var clientsTotal = document.getElementById("an-clients-total");
      var clientsActive = document.getElementById("an-clients-active");
      var clientsCompleted = document.getElementById("an-clients-completed");
      var clientsPending = document.getElementById("an-clients-pending");
      if (clientsTotal) clientsTotal.textContent = String(data.clients.total);
      if (clientsActive) clientsActive.textContent = String(data.clients.active);
      if (clientsCompleted) clientsCompleted.textContent = String(data.clients.completed);
      if (clientsPending) clientsPending.textContent = String(data.clients.pending);

      var appreciationsEl = document.getElementById("an-appreciations");
      var likesEl = document.getElementById("an-likes");
      if (appreciationsEl) appreciationsEl.textContent = formatCompact(data.appreciations);
      if (likesEl) likesEl.textContent = formatCompact(data.likes);

      applyViewsFilter(data);
    }

    function updateChartStats(data) {
      var series = data.growthChart || DEFAULT_ANALYTICS.growthChart;
      var last = series[series.length - 1];
      var prev = series[series.length - 2] || last;
      var rate =
        data.growthRatePercent != null
          ? data.growthRatePercent
          : ((last.value - prev.value) / (prev.value || 1)) * 100;
      var current = data.growthCurrent != null ? data.growthCurrent : last.value;
      var projected =
        data.growthProjected != null ? data.growthProjected : Math.round(current * (1 + rate / 100));

      var curEl = document.getElementById("an-stat-current");
      var grEl = document.getElementById("an-stat-growth");
      var prEl = document.getElementById("an-stat-projected");
      if (curEl) curEl.textContent = formatInt(current);
      if (grEl) grEl.textContent = (rate >= 0 ? "+" : "") + rate.toFixed(1) + "%";
      if (prEl) prEl.textContent = formatInt(projected);
    }

    var analyticsData = loadAnalytics();
    updateKPIs(analyticsData);
    updateChartStats(analyticsData);

    var chartEl = document.getElementById("an-chart-container");
    if (chartEl) {
      renderChart(chartEl, analyticsData.growthChart || DEFAULT_ANALYTICS.growthChart, {
        width: 800,
        height: 260,
      });
    }

    var donutsRoot = document.getElementById("an-donuts-root");
    if (donutsRoot) {
      donutsRoot.innerHTML = "";
      DONUT_DEFS.forEach(function (def) {
        renderDonut(donutsRoot, def.title, def.segments);
      });
    }

    renderComments(analyticsData);
    bindUI(analyticsData);

    var burger = document.getElementById("an-burger");
    var overlay = document.getElementById("an-overlay");
    function openOverlay() {
      if (!overlay) return;
      overlay.removeAttribute("hidden");
      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeOverlay() {
      if (!overlay) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        overlay.setAttribute("hidden", "");
      }, 250);
    }
    if (burger && overlay) {
      burger.addEventListener("click", function () {
        if (overlay.classList.contains("is-open")) closeOverlay();
        else openOverlay();
      });
    }
    document.querySelectorAll("[data-an-close]").forEach(function (el) {
      el.addEventListener("click", closeOverlay);
    });

    window.AnalyticsPage = {
      loadAnalytics: loadAnalytics,
      renderChart: renderChart,
      renderDonut: renderDonut,
    };
  }

  function initPagesAdminPage() {
    if (!document.body || !document.body.classList.contains("pg-page")) return;
    var requiredIds = ["pg-stats", "pg-tbody", "pg-cards", "pg-modal", "pg-form", "pg-btn-new", "pg-nav-overlay", "pg-toast"];
    for (var iReq = 0; iReq < requiredIds.length; iReq++) if (!document.getElementById(requiredIds[iReq])) return;
    var STORAGE_KEY = "dashboard_pages";
    var currentFilter = "all";
    var editingId = null;
    var toastTimer;
    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function randomAnalytics() { return { views: randInt(1200, 120000), retention: randInt(35, 92), bounce: randInt(8, 55), avgTime: randInt(0, 4) + "m " + randInt(0, 59) + "s" }; }
    function newId() { return "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9); }
    function defaultPages() {
      return [
        { id: "p_seed_1", path: "/home", title: "Homepage - Welcome", status: "published", views: 45230, retention: 78, bounce: 22, avgTime: "3m 45s" },
        { id: "p_seed_2", path: "/about", title: "About our studio", status: "published", views: 12840, retention: 62, bounce: 31, avgTime: "2m 12s" },
        { id: "p_seed_3", path: "/blog/draft-post", title: "Upcoming article", status: "draft", views: 0, retention: 0, bounce: 0, avgTime: "0m 0s" },
      ];
    }
    function loadPages() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { var seed = defaultPages(); savePages(seed); return seed.slice(); }
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return defaultPages(); }
    }
    function savePages(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    function filterPages(list, filter) {
      if (filter === "published") return list.filter(function (p) { return p.status === "published"; });
      if (filter === "draft") return list.filter(function (p) { return p.status === "draft"; });
      return list.slice();
    }
    function calculateStats(list) {
      var n = list.length;
      var totalViews = list.reduce(function (s, p) { return s + (p.views || 0); }, 0);
      var avgRet = n > 0 ? Math.round(list.reduce(function (s, p) { return s + (p.retention || 0); }, 0) / n) : 0;
      var pub = list.filter(function (p) { return p.status === "published"; }).length;
      var dr = list.filter(function (p) { return p.status === "draft"; }).length;
      return { total: n, totalViews: totalViews, avgRetention: avgRet, published: pub, draft: dr };
    }
    function renderStats(list) {
      var s = calculateStats(list);
      var el = document.getElementById("pg-stats");
      if (!el) return;
      el.innerHTML = '<div class="pg-stat"><div class="pg-stat__label">Total pages</div><div class="pg-stat__val">' + s.total + '</div></div><div class="pg-stat"><div class="pg-stat__label">Total views</div><div class="pg-stat__val">' + s.totalViews.toLocaleString("en-US") + '</div></div><div class="pg-stat"><div class="pg-stat__label">Avg retention</div><div class="pg-stat__val">' + s.avgRetention + '%</div></div><div class="pg-stat"><div class="pg-stat__label">Published / Draft</div><div class="pg-stat__val">' + s.published + " / " + s.draft + "</div></div>";
    }
    function iconEdit() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'; }
    function iconTrash() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'; }
    function iconEye() { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>'; }
    function escapeHtml(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }
    function escapeAttr(s) { return String(s || "").replace(/\"/g, "&quot;"); }
    function statusBadge(status) { var pub = status === "published"; return '<span class="pg-badge ' + (pub ? "pg-badge--pub" : "pg-badge--draft") + '">' + (pub ? "Published" : "Draft") + "</span>"; }
    function retentionCell(pct) { var v = Math.max(0, Math.min(100, pct || 0)); return '<div class="pg-retention"><div class="pg-retention__bar"><div class="pg-retention__fill" style="width:' + v + '%"></div></div><span>' + v + "%</span></div>"; }
    function renderTable() {
      var all = loadPages();
      renderStats(all);
      var rows = filterPages(all, currentFilter);
      var tbody = document.getElementById("pg-tbody");
      var cards = document.getElementById("pg-cards");
      if (tbody) tbody.innerHTML = "";
      if (cards) cards.innerHTML = "";
      if (rows.length === 0) {
        if (tbody) { var trE = document.createElement("tr"); var tdE = document.createElement("td"); tdE.colSpan = 7; tdE.className = "pg-empty pg-empty-cell"; tdE.textContent = "No pages yet"; trE.appendChild(tdE); tbody.appendChild(trE); }
        if (cards) { var e2 = document.createElement("div"); e2.className = "pg-empty"; e2.textContent = "No pages yet"; cards.appendChild(e2); }
        return;
      }
      rows.forEach(function (p) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<td><div class=\"pg-path\">" + escapeHtml(p.path) + '<span class="pg-path__sub">' + escapeHtml(p.title) + "</span></div></td><td>" + statusBadge(p.status) + "</td><td>" + (p.views || 0).toLocaleString("en-US") + "</td><td>" + retentionCell(p.retention) + "</td><td>" + (p.bounce != null ? p.bounce + "%" : "—") + "</td><td>" + escapeHtml(p.avgTime || "—") + '</td><td><div class="pg-actions"><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="edit" data-id="' + escapeAttr(p.id) + '" title="Edit">' + iconEdit() + '</button><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="del" data-id="' + escapeAttr(p.id) + '" title="Delete">' + iconTrash() + '</button><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="toggle" data-id="' + escapeAttr(p.id) + '" title="Toggle publish">' + iconEye() + "</button></div></td>";
        tr.querySelector("[data-act=edit]").addEventListener("click", function () { openModalEdit(p.id); });
        tr.querySelector("[data-act=del]").addEventListener("click", function () { deletePage(p.id); });
        tr.querySelector("[data-act=toggle]").addEventListener("click", function () { toggleStatus(p.id); });
        if (tbody) tbody.appendChild(tr);
        var card = document.createElement("article");
        card.className = "pg-card";
        card.innerHTML = '<div class="pg-path">' + escapeHtml(p.path) + '<span class="pg-path__sub">' + escapeHtml(p.title) + "</span></div><div>" + statusBadge(p.status) + '</div><div class="pg-card__row"><span>Views</span><span>' + (p.views || 0).toLocaleString("en-US") + '</span></div><div class="pg-card__row"><span>Retention</span><span>' + (p.retention != null ? p.retention + "%" : "—") + '</span></div><div class="pg-card__row"><span>Bounce</span><span>' + (p.bounce != null ? p.bounce + "%" : "—") + '</span></div><div class="pg-card__row"><span>Avg time</span><span>' + escapeHtml(p.avgTime || "—") + '</span></div><div class="pg-actions pg-actions--card"><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="edit" data-id="' + escapeAttr(p.id) + '">' + iconEdit() + '</button><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="del" data-id="' + escapeAttr(p.id) + '">' + iconTrash() + '</button><button type="button" class="pg-btn pg-btn--ghost pg-btn--icon" data-act="toggle" data-id="' + escapeAttr(p.id) + '">' + iconEye() + "</button></div>";
        card.querySelector("[data-act=edit]").addEventListener("click", function () { openModalEdit(p.id); });
        card.querySelector("[data-act=del]").addEventListener("click", function () { deletePage(p.id); });
        card.querySelector("[data-act=toggle]").addEventListener("click", function () { toggleStatus(p.id); });
        if (cards) cards.appendChild(card);
      });
    }
    function addPage(entry) { var list = loadPages(); list.push(entry); savePages(list); renderTable(); showToast("Page added"); }
    function updatePage(entry) { var list = loadPages(); var i = list.findIndex(function (x) { return x.id === entry.id; }); if (i === -1) return; list[i] = entry; savePages(list); renderTable(); showToast("Page saved"); }
    function deletePage(id) { if (!window.confirm("Delete this page?")) return; savePages(loadPages().filter(function (x) { return x.id !== id; })); renderTable(); showToast("Page removed"); }
    function toggleStatus(id) { var list = loadPages(); var i = list.findIndex(function (x) { return x.id === id; }); if (i === -1) return; list[i].status = list[i].status === "published" ? "draft" : "published"; savePages(list); renderTable(); showToast("Status updated"); }
    function openModalEdit(id) {
      var p = loadPages().find(function (x) { return x.id === id; });
      if (!p) return;
      editingId = id;
      document.getElementById("pg-modal-title").textContent = "Edit page";
      document.getElementById("pg-edit-id").value = id;
      document.getElementById("pg-in-path").value = p.path;
      document.getElementById("pg-in-title").value = p.title;
      document.getElementById("pg-in-status").value = p.status;
      document.getElementById("pg-err-path").textContent = "";
      document.getElementById("pg-err-title").textContent = "";
      openModal();
    }
    function openModal() { var m = document.getElementById("pg-modal"); m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
    function closeModal() { var m = document.getElementById("pg-modal"); m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; editingId = null; }
    function normalizePath(path) { var p = String(path || "").trim(); if (!p) return ""; if (p[0] !== "/") p = "/" + p; return p.replace(/\/+/g, "/"); }
    function showToast(msg) { var t = document.getElementById("pg-toast"); if (!t) return; t.textContent = msg; t.classList.add("is-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 2200); }
    document.getElementById("pg-btn-new").addEventListener("click", function () { window.location.href = "add-page.html"; });
    document.getElementById("pg-btn-cancel").addEventListener("click", closeModal);
    document.getElementById("pg-modal").addEventListener("click", function (e) { if (e.target.id === "pg-modal") closeModal(); });
    document.getElementById("pg-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var pathIn = document.getElementById("pg-in-path");
      var titleIn = document.getElementById("pg-in-title");
      var statusIn = document.getElementById("pg-in-status");
      var errPath = document.getElementById("pg-err-path");
      var errTitle = document.getElementById("pg-err-title");
      errPath.textContent = "";
      errTitle.textContent = "";
      var path = normalizePath(pathIn.value);
      var title = titleIn.value.trim();
      if (!path) { errPath.textContent = "Path is required."; return; }
      if (!title) { errTitle.textContent = "Title is required."; return; }
      var list = loadPages();
      var dup = list.some(function (p) { return p.path === path && p.id !== editingId; });
      if (dup) { errPath.textContent = "This path already exists."; return; }
      var status = statusIn.value;
      if (editingId) {
        var prev = list.find(function (x) { return x.id === editingId; });
        if (!prev) return;
        updatePage({ id: prev.id, path: path, title: title, status: status, views: prev.views, retention: prev.retention, bounce: prev.bounce, avgTime: prev.avgTime });
      } else {
        var a = randomAnalytics();
        addPage({ id: newId(), path: path, title: title, status: status, views: a.views, retention: a.retention, bounce: a.bounce, avgTime: a.avgTime });
      }
      closeModal();
    });
    document.querySelectorAll(".pg-tab[data-filter]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        currentFilter = tab.getAttribute("data-filter");
        document.querySelectorAll(".pg-tab[data-filter]").forEach(function (t) { var on = t === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
        renderTable();
      });
    });
    var nav = document.getElementById("pg-nav-overlay");
    var burger = document.getElementById("pg-burger");
    function openNav() { nav.removeAttribute("hidden"); nav.setAttribute("aria-hidden", "false"); nav.classList.add("is-open"); if (burger) burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; }
    function closeNav() { nav.classList.remove("is-open"); nav.setAttribute("aria-hidden", "true"); if (burger) burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; setTimeout(function () { nav.setAttribute("hidden", ""); }, 250); }
    if (burger) burger.addEventListener("click", function () { if (nav.classList.contains("is-open")) closeNav(); else openNav(); });
    document.querySelectorAll("[data-pg-close-nav]").forEach(function (el) { el.addEventListener("click", closeNav); });
    renderTable();
    window.PagesAdmin = { loadPages: loadPages, savePages: savePages, renderTable: renderTable, addPage: addPage, updatePage: updatePage, deletePage: deletePage, toggleStatus: toggleStatus, filterPages: filterPages, calculateStats: calculateStats };
  }

  function initMediaPageExternal() {
    if (!document.body || !document.body.classList.contains("ml-page")) return;

    var grid = document.getElementById("ml-grid");
    var subtitle = document.getElementById("ml-subtitle");
    var form = document.getElementById("ml-form");
    var modal = document.getElementById("ml-modal");
    var nav = document.getElementById("ml-nav-overlay");
    var deleteOverlay = document.getElementById("ml-delete-overlay");
    if (!grid || !subtitle || !form || !modal || !nav || !deleteOverlay) return;

    var STORAGE_KEY = "dashboard_media";
    var pendingDeleteId = null;

    function newId() {
      return "m_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return Math.round(bytes) + " B";
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    }

    function todayISO() {
      var d = new Date();
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var day = String(d.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + day;
    }

    function formatDisplayDate(iso) {
      if (!iso) return "—";
      var d = new Date(iso + "T12:00:00");
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    function loadMedia() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function saveMedia(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return true;
      } catch (e) {
        window.alert("Storage full or unavailable. Try removing images or use smaller files.");
        return false;
      }
    }

    function updateSubtitle(count) {
      var el = document.getElementById("ml-subtitle");
      if (el) el.textContent = count + " total items";
    }

    function renderMedia() {
      var list = loadMedia();
      updateSubtitle(list.length);
      var mediaGrid = document.getElementById("ml-grid");
      if (!mediaGrid) return;
      mediaGrid.innerHTML = "";

      if (list.length === 0) {
        var empty = document.createElement("div");
        empty.className = "ml-empty";
        empty.textContent = "No media yet — upload an image to get started.";
        mediaGrid.appendChild(empty);
        return;
      }

      list.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "ml-card";
        card.setAttribute("data-id", item.id);

        var thumb = document.createElement("div");
        thumb.className = "ml-card__thumb";
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title || "";
        img.loading = "lazy";
        thumb.appendChild(img);

        var badge = document.createElement("span");
        badge.className = "ml-badge " + (item.used ? "ml-badge--used" : "ml-badge--unused");
        badge.textContent = item.used ? "Used" : "Unused";
        thumb.appendChild(badge);

        var actions = document.createElement("div");
        actions.className = "ml-card__actions";
        var btnToggle = document.createElement("button");
        btnToggle.type = "button";
        btnToggle.className = "ml-btn ml-btn--ghost";
        btnToggle.textContent = item.used ? "Mark unused" : "Mark used";
        btnToggle.addEventListener("click", function () {
          toggleUsed(item.id);
        });
        var btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.className = "ml-btn ml-btn--danger";
        btnDel.textContent = "Delete";
        btnDel.addEventListener("click", function () {
          openDeleteOverlay(item.id);
        });
        actions.appendChild(btnToggle);
        actions.appendChild(btnDel);
        thumb.appendChild(actions);

        var body = document.createElement("div");
        body.className = "ml-card__body";
        var h = document.createElement("h2");
        h.className = "ml-card__title";
        h.textContent = item.title || "Untitled";
        var desc = document.createElement("p");
        desc.className = "ml-card__desc";
        desc.textContent = item.description || "—";
        var meta = document.createElement("div");
        meta.className = "ml-card__meta";
        var size = document.createElement("span");
        size.textContent = item.size || "—";
        var date = document.createElement("span");
        date.textContent = formatDisplayDate(item.date);
        meta.appendChild(size);
        meta.appendChild(date);
        body.appendChild(h);
        body.appendChild(desc);
        body.appendChild(meta);

        card.appendChild(thumb);
        card.appendChild(body);
        mediaGrid.appendChild(card);
      });
    }

    function uploadMedia(entry) {
      var list = loadMedia();
      list.unshift(entry);
      if (!saveMedia(list)) return false;
      renderMedia();
      showToast("Image uploaded");
      return true;
    }

    function toggleUsed(id) {
      var list = loadMedia();
      var i = list.findIndex(function (x) {
        return x.id === id;
      });
      if (i === -1) return;
      list[i].used = !list[i].used;
      if (!saveMedia(list)) return;
      renderMedia();
      showToast("Updated");
    }

    function deleteMedia(id) {
      var list = loadMedia().filter(function (x) {
        return x.id !== id;
      });
      if (!saveMedia(list)) return false;
      renderMedia();
      showToast("Image removed");
      return true;
    }

    function openDeleteOverlay(id) {
      var item = loadMedia().find(function (x) {
        return x.id === id;
      });
      if (!item) return;
      pendingDeleteId = id;
      var msg = document.getElementById("ml-delete-msg");
      if (msg) {
        msg.textContent =
          'Are you sure you want to delete "' +
          (item.title || "Untitled") +
          '"? This action cannot be undone.';
      }
      var ov = document.getElementById("ml-delete-overlay");
      if (!ov) return;
      ov.classList.add("is-open");
      ov.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        var c = document.getElementById("ml-delete-confirm");
        if (c) c.focus();
      }, 0);
    }

    function closeDeleteOverlay() {
      pendingDeleteId = null;
      var ov = document.getElementById("ml-delete-overlay");
      if (!ov) return;
      ov.classList.remove("is-open");
      ov.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function confirmPendingDelete() {
      if (!pendingDeleteId) return;
      var id = pendingDeleteId;
      closeDeleteOverlay();
      deleteMedia(id);
    }

    var toastTimer;
    function showToast(msg) {
      var t = document.getElementById("ml-toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        t.classList.remove("is-show");
      }, 2200);
    }

    function openModal() {
      var m = document.getElementById("ml-modal");
      if (!m) return;
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      var m = document.getElementById("ml-modal");
      if (!m) return;
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      var mediaForm = document.getElementById("ml-form");
      if (mediaForm) mediaForm.reset();
      var errFile = document.getElementById("ml-err-file");
      var errTitle = document.getElementById("ml-err-title");
      if (errFile) errFile.textContent = "";
      if (errTitle) errTitle.textContent = "";
    }

    var btnUpload = document.getElementById("ml-btn-upload");
    var btnCancel = document.getElementById("ml-btn-cancel");
    if (!btnUpload || !btnCancel) return;

    btnUpload.addEventListener("click", openModal);
    btnCancel.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target.id === "ml-modal") closeModal();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fileInput = document.getElementById("ml-file");
      var titleInput = document.getElementById("ml-title");
      var descInput = document.getElementById("ml-desc");
      var errFile = document.getElementById("ml-err-file");
      var errTitle = document.getElementById("ml-err-title");
      if (!fileInput || !titleInput || !descInput || !errFile || !errTitle) return;
      errFile.textContent = "";
      errTitle.textContent = "";

      var file = fileInput.files && fileInput.files[0];
      if (!file) {
        errFile.textContent = "Please choose an image file.";
        return;
      }
      if (!file.type || file.type.indexOf("image/") !== 0) {
        errFile.textContent = "Only image files are allowed.";
        return;
      }

      var title = titleInput.value.trim();
      if (!title) {
        errTitle.textContent = "Title is required.";
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        var src = reader.result;
        var entry = {
          id: newId(),
          src: src,
          title: title,
          description: (descInput.value || "").trim(),
          size: formatBytes(file.size),
          date: todayISO(),
          used: false
        };
        if (uploadMedia(entry)) closeModal();
      };
      reader.onerror = function () {
        errFile.textContent = "Could not read file.";
      };
      reader.readAsDataURL(file);
    });

    var burger = document.getElementById("ml-burger");
    function openNav() {
      nav.removeAttribute("hidden");
      nav.setAttribute("aria-hidden", "false");
      nav.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        nav.setAttribute("hidden", "");
      }, 250);
    }
    if (burger) {
      burger.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }
    document.querySelectorAll("[data-ml-close-nav]").forEach(function (el) {
      el.addEventListener("click", closeNav);
    });

    var deleteCancel = document.getElementById("ml-delete-cancel");
    var deleteConfirm = document.getElementById("ml-delete-confirm");
    if (deleteCancel) deleteCancel.addEventListener("click", closeDeleteOverlay);
    if (deleteConfirm) deleteConfirm.addEventListener("click", confirmPendingDelete);
    document.querySelectorAll("[data-ml-delete-close]").forEach(function (el) {
      el.addEventListener("click", closeDeleteOverlay);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var delOv = document.getElementById("ml-delete-overlay");
      if (delOv && delOv.classList.contains("is-open")) {
        e.preventDefault();
        closeDeleteOverlay();
      }
    });

    renderMedia();

    window.MediaLibrary = {
      loadMedia: loadMedia,
      saveMedia: saveMedia,
      renderMedia: renderMedia,
      uploadMedia: uploadMedia,
      deleteMedia: deleteMedia,
      openDeleteOverlay: openDeleteOverlay,
      toggleUsed: toggleUsed
    };
  }

  function initSettingsPageExternal() {
    var body = document.body;
    if (!body || !body.classList.contains("settings-app")) return;

    var requiredIds = ["settings-toast", "settings-logout", "settings-nav-overlay", "settings-burger"];
    var i;
    for (i = 0; i < requiredIds.length; i++) {
      if (!document.getElementById(requiredIds[i])) return;
    }
    if (!document.querySelector(".settings-toggle[data-path]")) return;
    if (!document.querySelector(".settings-nav__btn[data-section]")) return;

    var STORAGE_KEY = "dashboard_settings";

    var DEFAULTS = {
      profile: {
        showEmail: false,
        showPhone: false,
        visibility: false,
        messages: false
      },
      security: {
        twoFactorStarted: false,
        alerts: false,
        sessions: false,
        passwordChangeDays: 10
      },
      permissions: {
        admin: false,
        users: false,
        content: false,
        payments: false,
        analytics: false,
        notifications: false
      }
    };

    function deepMerge(base, extra) {
      if (!extra || typeof extra !== "object") {
        return JSON.parse(JSON.stringify(base));
      }
      var out = {};
      var k;
      for (k in base) {
        if (!Object.prototype.hasOwnProperty.call(base, k)) continue;
        if (
          base[k] !== null &&
          typeof base[k] === "object" &&
          !Array.isArray(base[k]) &&
          extra[k] &&
          typeof extra[k] === "object"
        ) {
          out[k] = deepMerge(base[k], extra[k]);
        } else {
          out[k] = Object.prototype.hasOwnProperty.call(extra, k) ? extra[k] : base[k];
        }
      }
      for (k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k) && !Object.prototype.hasOwnProperty.call(out, k)) {
          out[k] = extra[k];
        }
      }
      return out;
    }

    function loadSettings() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
        var parsed = JSON.parse(raw);
        return JSON.parse(JSON.stringify(deepMerge(DEFAULTS, parsed)));
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULTS));
      }
    }

    function saveSettings(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getByPath(obj, path) {
      var parts = path.split(".");
      var cur = obj;
      var idx;
      for (idx = 0; idx < parts.length; idx++) {
        if (cur == null || typeof cur !== "object") return undefined;
        cur = cur[parts[idx]];
      }
      return cur;
    }

    function setByPath(obj, path, value) {
      var parts = path.split(".");
      var cur = obj;
      var idx;
      for (idx = 0; idx < parts.length - 1; idx++) {
        var p = parts[idx];
        if (!cur[p] || typeof cur[p] !== "object") cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
    }

    var settingsState = loadSettings();
    var toastEl = document.getElementById("settings-toast");
    var toastTimer;

    function showToast() {
      if (!toastEl) return;
      toastEl.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.classList.remove("is-show");
      }, 2200);
    }

    function persist() {
      saveSettings(settingsState);
      showToast();
    }

    function applyToggleUI(btn, value) {
      var on = !!value;
      btn.setAttribute("aria-checked", on ? "true" : "false");
    }

    function syncAllToggles() {
      document.querySelectorAll(".settings-toggle[data-path]").forEach(function (btn) {
        var path = btn.getAttribute("data-path");
        var v = getByPath(settingsState, path);
        applyToggleUI(btn, v);
      });
    }

    function updatePasswordButtonLabel() {
      var btn = document.getElementById("btn-password-days");
      if (!btn) return;
      var days = settingsState.security.passwordChangeDays || 10;
      btn.textContent = days + " Days";
    }

    function update2FAButton() {
      var btn = document.getElementById("btn-2fa-start");
      if (!btn) return;
      if (settingsState.security.twoFactorStarted) {
        btn.textContent = "Enabled";
        btn.setAttribute("disabled", "disabled");
      } else {
        btn.textContent = "Start";
        btn.removeAttribute("disabled");
      }
    }

    document.querySelectorAll(".settings-toggle[data-path]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var path = btn.getAttribute("data-path");
        var cur = !!getByPath(settingsState, path);
        setByPath(settingsState, path, !cur);
        applyToggleUI(btn, !cur);
        persist();
      });
    });

    var btn2fa = document.getElementById("btn-2fa-start");
    if (btn2fa) {
      btn2fa.addEventListener("click", function () {
        settingsState.security.twoFactorStarted = true;
        persist();
        update2FAButton();
      });
    }

    var pwdDays = [7, 10, 14, 30];
    var btnPwd = document.getElementById("btn-password-days");
    if (btnPwd) {
      btnPwd.addEventListener("click", function () {
        var cur = settingsState.security.passwordChangeDays || 10;
        var idx = pwdDays.indexOf(cur);
        var next = pwdDays[(idx + 1) % pwdDays.length];
        settingsState.security.passwordChangeDays = next;
        persist();
        updatePasswordButtonLabel();
      });
    }

    var sections = ["profile", "security", "permissions"];

    function showSection(id) {
      sections.forEach(function (s) {
        var panel = document.getElementById("panel-" + s);
        var tab = document.querySelector('.settings-nav__btn[data-section="' + s + '"]');
        var active = s === id;
        if (panel) {
          panel.classList.toggle("is-visible", active);
          panel.hidden = !active;
        }
        if (tab) {
          tab.classList.toggle("is-active", active);
          tab.setAttribute("aria-selected", active ? "true" : "false");
        }
      });
    }

    document.querySelectorAll(".settings-nav__btn[data-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-section");
        if (id) showSection(id);
      });
    });

    showSection("profile");

    syncAllToggles();
    updatePasswordButtonLabel();
    update2FAButton();

    var logoutBtn = document.getElementById("settings-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        try {
          localStorage.removeItem("currentUser");
        } catch (e) {}
        window.location.href = "index.html";
      });
    }

    var overlay = document.getElementById("settings-nav-overlay");
    var burger = document.getElementById("settings-burger");

    function openOverlay() {
      if (!overlay) return;
      overlay.removeAttribute("hidden");
      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeOverlay() {
      if (!overlay) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        overlay.setAttribute("hidden", "");
      }, 300);
    }

    if (burger) {
      burger.addEventListener("click", function () {
        if (overlay && overlay.classList.contains("is-open")) {
          closeOverlay();
        } else {
          openOverlay();
        }
      });
    }

    document.querySelectorAll("[data-close-overlay]").forEach(function (el) {
      el.addEventListener("click", closeOverlay);
    });

    document.querySelectorAll(".settings-overlay__link").forEach(function (link) {
      link.addEventListener("click", closeOverlay);
    });
  }

  function initFaqPageExternal() {
    var body = document.body;
    if (!body || !body.classList.contains("faq-page")) return;

    var contentEl = document.getElementById("faq-content");
    var tocEl = document.getElementById("faq-toc");
    var editBtnEl = document.getElementById("faq-btn-edit");
    var saveBtnEl = document.getElementById("faq-btn-save");
    var cancelBtnEl = document.getElementById("faq-btn-cancel");
    var navEl = document.getElementById("faq-nav-overlay");
    if (!contentEl || !tocEl || !editBtnEl || !saveBtnEl || !cancelBtnEl || !navEl) return;

    var STORAGE_KEY = "dashboard_faq";

    var DEFAULT_FAQ = {
      intro:
        "This Privacy Policy describes how we collect, use, and protect your information when you use our dashboard and related services.",
      sections: [
        {
          id: "1",
          title: "01. INFORMATION WE COLLECT",
          content:
            "We collect information you provide directly (such as account details), usage data, and technical information needed to operate the service securely.",
        },
        {
          id: "2",
          title: "02. HOW WE USE YOUR INFORMATION",
          content:
            "We use the information to provide and improve our services, communicate with you, ensure security, and comply with legal obligations.",
        },
      ],
    };

    var isEditMode = false;
    var snapshot = null;

    function newSectionId() {
      return "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    }

    function loadFAQ() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          saveFAQ(JSON.parse(JSON.stringify(DEFAULT_FAQ)));
          return JSON.parse(JSON.stringify(DEFAULT_FAQ));
        }
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return JSON.parse(JSON.stringify(DEFAULT_FAQ));
        if (!Array.isArray(parsed.sections)) parsed.sections = [];
        if (typeof parsed.intro !== "string") parsed.intro = DEFAULT_FAQ.intro;
        return parsed;
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_FAQ));
      }
    }

    function saveFAQ(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getSectionAnchorId(id) {
      return "faq-section-" + id;
    }

    function generateTOC(sections) {
      var nav = document.getElementById("faq-toc");
      if (!nav) return;
      nav.innerHTML = "";
      var label = document.createElement("p");
      label.className = "faq-toc__label";
      label.textContent = "Contents";
      nav.appendChild(label);
      sections.forEach(function (sec) {
        var a = document.createElement("a");
        a.className = "faq-toc__link";
        a.href = "#" + getSectionAnchorId(sec.id);
        a.textContent = sec.title || "Section";
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var el = document.getElementById(getSectionAnchorId(sec.id));
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        nav.appendChild(a);
      });
    }

    function padNum(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function nextNumberedTitle(index) {
      return padNum(index + 1) + ". NEW SECTION";
    }

    function renderViewMode() {
      var data = loadFAQ();
      var wrap = document.getElementById("faq-content");
      if (!wrap) return;
      wrap.innerHTML = "";

      var intro = document.createElement("p");
      intro.className = "faq-intro faq-intro--view";
      intro.textContent = data.intro || "";
      wrap.appendChild(intro);

      var list = document.createElement("div");
      list.className = "faq-sections";
      data.sections.forEach(function (sec) {
        var block = document.createElement("section");
        block.className = "faq-section";
        block.id = getSectionAnchorId(sec.id);
        var h = document.createElement("h2");
        h.className = "faq-section__title";
        h.textContent = sec.title || "";
        var p = document.createElement("p");
        p.className = "faq-section__body faq-section__body--view";
        p.textContent = sec.content || "";
        block.appendChild(h);
        block.appendChild(p);
        list.appendChild(block);
      });
      wrap.appendChild(list);

      generateTOC(data.sections);
    }

    function collectEditFormData() {
      var introEl = document.getElementById("faq-edit-intro");
      var intro = introEl ? introEl.value : "";
      var sections = [];
      document.querySelectorAll("[data-faq-section]").forEach(function (row) {
        var id = row.getAttribute("data-faq-section");
        var titleIn = row.querySelector(".faq-section__title-input");
        var bodyIn = row.querySelector(".faq-section__textarea");
        sections.push({
          id: id,
          title: titleIn ? titleIn.value.trim() : "",
          content: bodyIn ? bodyIn.value : "",
        });
      });
      return { intro: intro, sections: sections };
    }

    function renderEditMode() {
      var data = loadFAQ();
      var wrap = document.getElementById("faq-content");
      if (!wrap) return;
      wrap.innerHTML = "";

      var intro = document.createElement("textarea");
      intro.id = "faq-edit-intro";
      intro.className = "faq-intro faq-intro--edit";
      intro.rows = 5;
      intro.placeholder = "Intro paragraph...";
      intro.value = data.intro || "";
      wrap.appendChild(intro);

      var list = document.createElement("div");
      list.className = "faq-sections";
      data.sections.forEach(function (sec) {
        list.appendChild(buildEditSection(sec));
      });
      wrap.appendChild(list);

      var addWrap = document.createElement("div");
      addWrap.className = "faq-add-section";
      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "faq-btn faq-btn--ghost";
      addBtn.textContent = "+ Add section";
      addBtn.addEventListener("click", function () {
        addSection();
      });
      addWrap.appendChild(addBtn);
      wrap.appendChild(addWrap);

      generateTOC(data.sections);
    }

    function buildEditSection(sec) {
      var block = document.createElement("div");
      block.className = "faq-section";
      block.setAttribute("data-faq-section", sec.id);
      block.id = getSectionAnchorId(sec.id);

      var titleIn = document.createElement("input");
      titleIn.type = "text";
      titleIn.className = "faq-section__title-input";
      titleIn.placeholder = "Section title";
      titleIn.value = sec.title || "";

      var bodyIn = document.createElement("textarea");
      bodyIn.className = "faq-section__textarea";
      bodyIn.rows = 6;
      bodyIn.placeholder = "Section content...";
      bodyIn.value = sec.content || "";

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "faq-btn faq-btn--danger faq-section__delete";
      delBtn.textContent = "Delete section";
      delBtn.addEventListener("click", function () {
        deleteSection(sec.id);
      });

      block.appendChild(titleIn);
      block.appendChild(bodyIn);
      block.appendChild(delBtn);
      return block;
    }

    function addSection() {
      var data = collectEditFormData();
      var n = data.sections.length;
      data.sections.push({
        id: newSectionId(),
        title: nextNumberedTitle(n),
        content: "",
      });
      saveFAQ(data);
      renderEditMode();
    }

    function deleteSection(id) {
      if (!window.confirm("Delete this section?")) return;
      var data = collectEditFormData();
      data.sections = data.sections.filter(function (s) {
        return s.id !== id;
      });
      saveFAQ(data);
      renderEditMode();
    }

    function setModeButtons() {
      var editBtn = document.getElementById("faq-btn-edit");
      var saveBtn = document.getElementById("faq-btn-save");
      var cancelBtn = document.getElementById("faq-btn-cancel");
      if (editBtn) editBtn.hidden = isEditMode;
      if (saveBtn) saveBtn.hidden = !isEditMode;
      if (cancelBtn) cancelBtn.hidden = !isEditMode;
    }

    function enterEditMode() {
      snapshot = JSON.stringify(loadFAQ());
      isEditMode = true;
      setModeButtons();
      renderEditMode();
    }

    function cancelEdit() {
      if (snapshot) {
        try {
          saveFAQ(JSON.parse(snapshot));
        } catch (e) {}
      }
      isEditMode = false;
      setModeButtons();
      renderViewMode();
    }

    function saveChanges() {
      var data = collectEditFormData();
      saveFAQ(data);
      isEditMode = false;
      setModeButtons();
      renderViewMode();
      showToast("Changes saved");
    }

    var toastTimer;
    function showToast(msg) {
      var t = document.getElementById("faq-toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        t.classList.remove("is-show");
      }, 2200);
    }

    editBtnEl.addEventListener("click", enterEditMode);
    saveBtnEl.addEventListener("click", saveChanges);
    cancelBtnEl.addEventListener("click", cancelEdit);

    var burger = document.getElementById("faq-burger");
    function openNav() {
      navEl.removeAttribute("hidden");
      navEl.setAttribute("aria-hidden", "false");
      navEl.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      navEl.classList.remove("is-open");
      navEl.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        navEl.setAttribute("hidden", "");
      }, 250);
    }
    if (burger) {
      burger.addEventListener("click", function () {
        if (navEl.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }
    document.querySelectorAll("[data-faq-close-nav]").forEach(function (el) {
      el.addEventListener("click", closeNav);
    });

    renderViewMode();
    setModeButtons();

    window.FAQAdmin = {
      loadFAQ: loadFAQ,
      saveFAQ: saveFAQ,
      renderViewMode: renderViewMode,
      renderEditMode: renderEditMode,
      addSection: addSection,
      deleteSection: deleteSection,
      generateTOC: generateTOC,
    };
  }

  function initPrivacyPageExternal() {
    var body = document.body;
    if (!body || !body.classList.contains("privacy-page")) return;

    var contentEl = document.getElementById("privacy-content");
    var tocEl = document.getElementById("privacy-toc");
    var editBtnEl = document.getElementById("privacy-btn-edit");
    var saveBtnEl = document.getElementById("privacy-btn-save");
    var cancelBtnEl = document.getElementById("privacy-btn-cancel");
    var navEl = document.getElementById("privacy-nav-overlay");
    if (!contentEl || !tocEl || !editBtnEl || !saveBtnEl || !cancelBtnEl || !navEl) return;

    var STORAGE_KEY = "dashboard_privacy";

    var DEFAULT_POLICY = {
      intro:
        "This Privacy Policy describes how we collect, use, and protect your information when you use our dashboard and related services.",
      sections: [
        {
          id: "1",
          title: "01. INFORMATION WE COLLECT",
          content:
            "We collect information you provide directly (such as account details), usage data, and technical information needed to operate the service securely.\n\nExamples include:\n- Account email and name\n- Log and device data\n- Cookies essential to the product",
        },
        {
          id: "2",
          title: "02. HOW WE USE YOUR INFORMATION",
          content:
            "We use the information to provide and improve our services, communicate with you, ensure security, and comply with legal obligations.",
        },
      ],
    };

    var isEditMode = false;
    var snapshot = null;

    function newSectionId() {
      return "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
    }

    function loadPolicy() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          savePolicy(JSON.parse(JSON.stringify(DEFAULT_POLICY)));
          return JSON.parse(JSON.stringify(DEFAULT_POLICY));
        }
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
          return JSON.parse(JSON.stringify(DEFAULT_POLICY));
        }
        if (!Array.isArray(parsed.sections)) parsed.sections = [];
        if (typeof parsed.intro !== "string") parsed.intro = DEFAULT_POLICY.intro;
        return parsed;
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_POLICY));
      }
    }

    function savePolicy(data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getSectionAnchorId(id) {
      return "privacy-section-" + String(id).replace(/[^a-zA-Z0-9_-]/g, "-");
    }

    function generateTOC(sections) {
      var nav = document.getElementById("privacy-toc");
      if (!nav) return;
      nav.innerHTML = "";
      var label = document.createElement("p");
      label.className = "privacy-toc__label";
      label.textContent = "Contents";
      nav.appendChild(label);
      sections.forEach(function (sec) {
        var a = document.createElement("a");
        a.className = "privacy-toc__link";
        a.href = "#" + getSectionAnchorId(sec.id);
        a.textContent = sec.title || "Section";
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var el = document.getElementById(getSectionAnchorId(sec.id));
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        nav.appendChild(a);
      });
    }

    function padNum(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function nextNumberedTitle(index) {
      return padNum(index + 1) + ". NEW SECTION";
    }

    function renderSectionBodyView(container, text) {
      container.className = "privacy-section__body";
      var lines = String(text || "").split(/\r?\n/);
      var i = 0;
      while (i < lines.length) {
        var line = lines[i];
        var trimmed = line.trim();
        if (trimmed === "") {
          i++;
          continue;
        }
        var bullet = /^\s*[-*•]\s+(.+)$/.exec(line);
        if (bullet) {
          var ul = document.createElement("ul");
          ul.className = "privacy-section__list";
          while (i < lines.length) {
            var m = /^\s*[-*•]\s+(.+)$/.exec(lines[i]);
            if (!m) break;
            var li = document.createElement("li");
            li.textContent = m[1];
            ul.appendChild(li);
            i++;
          }
          container.appendChild(ul);
        } else {
          var buf = [trimmed];
          i++;
          while (i < lines.length) {
            var lineText = lines[i];
            if (lineText.trim() === "") break;
            if (/^\s*[-*•]\s+/.test(lineText)) break;
            buf.push(lineText.trim());
            i++;
          }
          var p = document.createElement("p");
          p.textContent = buf.join(" ");
          container.appendChild(p);
        }
      }
      if (!container.children.length && text && String(text).trim()) {
        var fallback = document.createElement("p");
        fallback.textContent = text;
        container.appendChild(fallback);
      }
    }

    function renderViewMode() {
      var data = loadPolicy();
      var wrap = document.getElementById("privacy-content");
      if (!wrap) return;
      wrap.innerHTML = "";

      var intro = document.createElement("p");
      intro.className = "privacy-intro privacy-intro--view";
      intro.textContent = data.intro || "";
      wrap.appendChild(intro);

      var list = document.createElement("div");
      list.className = "privacy-sections";
      data.sections.forEach(function (sec) {
        var block = document.createElement("section");
        block.className = "privacy-section";
        block.id = getSectionAnchorId(sec.id);
        var h = document.createElement("h2");
        h.className = "privacy-section__title";
        h.textContent = sec.title || "";
        var bodyWrap = document.createElement("div");
        renderSectionBodyView(bodyWrap, sec.content || "");
        block.appendChild(h);
        block.appendChild(bodyWrap);
        list.appendChild(block);
      });
      wrap.appendChild(list);

      generateTOC(data.sections);
    }

    function collectEditFormData() {
      var introEl = document.getElementById("privacy-edit-intro");
      var intro = introEl ? introEl.value : "";
      var sections = [];
      document.querySelectorAll("[data-privacy-section]").forEach(function (row) {
        var id = row.getAttribute("data-privacy-section");
        var titleIn = row.querySelector(".privacy-section__title-input");
        var bodyIn = row.querySelector(".privacy-section__textarea");
        sections.push({
          id: id,
          title: titleIn ? titleIn.value.trim() : "",
          content: bodyIn ? bodyIn.value : "",
        });
      });
      return { intro: intro, sections: sections };
    }

    function buildEditSection(sec) {
      var block = document.createElement("div");
      block.className = "privacy-section";
      block.setAttribute("data-privacy-section", sec.id);
      block.id = getSectionAnchorId(sec.id);

      var titleIn = document.createElement("input");
      titleIn.type = "text";
      titleIn.className = "privacy-section__title-input";
      titleIn.placeholder = "Section title";
      titleIn.value = sec.title || "";

      var bodyIn = document.createElement("textarea");
      bodyIn.className = "privacy-section__textarea";
      bodyIn.rows = 6;
      bodyIn.placeholder = "Section content... Use lines starting with - for bullets.";
      bodyIn.value = sec.content || "";

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "privacy-btn privacy-btn--danger privacy-section__delete";
      delBtn.textContent = "Delete section";
      delBtn.addEventListener("click", function () {
        deleteSection(sec.id);
      });

      block.appendChild(titleIn);
      block.appendChild(bodyIn);
      block.appendChild(delBtn);
      return block;
    }

    function renderEditMode() {
      var data = loadPolicy();
      var wrap = document.getElementById("privacy-content");
      if (!wrap) return;
      wrap.innerHTML = "";

      var intro = document.createElement("textarea");
      intro.id = "privacy-edit-intro";
      intro.className = "privacy-intro privacy-intro--edit";
      intro.rows = 5;
      intro.placeholder = "Intro paragraph...";
      intro.value = data.intro || "";
      wrap.appendChild(intro);

      var list = document.createElement("div");
      list.className = "privacy-sections";
      data.sections.forEach(function (sec) {
        list.appendChild(buildEditSection(sec));
      });
      wrap.appendChild(list);

      var addWrap = document.createElement("div");
      addWrap.className = "privacy-add-section";
      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "privacy-btn privacy-btn--ghost";
      addBtn.textContent = "+ Add Section";
      addBtn.addEventListener("click", function () {
        addSection();
      });
      addWrap.appendChild(addBtn);
      wrap.appendChild(addWrap);

      generateTOC(data.sections);
    }

    function addSection() {
      var data = collectEditFormData();
      var n = data.sections.length;
      data.sections.push({
        id: newSectionId(),
        title: nextNumberedTitle(n),
        content: "",
      });
      savePolicy(data);
      renderEditMode();
    }

    function deleteSection(id) {
      if (!window.confirm("Delete this section? This cannot be undone.")) return;
      var data = collectEditFormData();
      data.sections = data.sections.filter(function (s) {
        return s.id !== id;
      });
      savePolicy(data);
      renderEditMode();
    }

    function setModeButtons() {
      var editBtn = document.getElementById("privacy-btn-edit");
      var saveBtn = document.getElementById("privacy-btn-save");
      var cancelBtn = document.getElementById("privacy-btn-cancel");
      if (editBtn) editBtn.hidden = isEditMode;
      if (saveBtn) saveBtn.hidden = !isEditMode;
      if (cancelBtn) cancelBtn.hidden = !isEditMode;
    }

    function enterEditMode() {
      snapshot = JSON.stringify(loadPolicy());
      isEditMode = true;
      setModeButtons();
      renderEditMode();
    }

    function cancelEdit() {
      if (snapshot) {
        try {
          savePolicy(JSON.parse(snapshot));
        } catch (e) {}
      }
      isEditMode = false;
      setModeButtons();
      renderViewMode();
    }

    function saveChanges() {
      var data = collectEditFormData();
      savePolicy(data);
      isEditMode = false;
      setModeButtons();
      renderViewMode();
      showToast("Saved successfully");
    }

    var toastTimer;
    function showToast(msg) {
      var t = document.getElementById("privacy-toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("is-show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        t.classList.remove("is-show");
      }, 2400);
    }

    editBtnEl.addEventListener("click", enterEditMode);
    saveBtnEl.addEventListener("click", saveChanges);
    cancelBtnEl.addEventListener("click", cancelEdit);

    var burger = document.getElementById("privacy-burger");
    function openNav() {
      navEl.removeAttribute("hidden");
      navEl.setAttribute("aria-hidden", "false");
      navEl.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      navEl.classList.remove("is-open");
      navEl.setAttribute("aria-hidden", "true");
      if (burger) burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        navEl.setAttribute("hidden", "");
      }, 250);
    }
    if (burger) {
      burger.addEventListener("click", function () {
        if (navEl.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }
    document.querySelectorAll("[data-privacy-close-nav]").forEach(function (el) {
      el.addEventListener("click", closeNav);
    });

    renderViewMode();
    setModeButtons();

    window.PrivacyAdmin = {
      loadPolicy: loadPolicy,
      savePolicy: savePolicy,
      renderViewMode: renderViewMode,
      renderEditMode: renderEditMode,
      addSection: addSection,
      deleteSection: deleteSection,
      generateTOC: generateTOC,
    };
  }

  function initRedirectPages() {
    var path = (window.location.pathname || "").split("/").pop();
    if (path === "add-post.html") {
      window.location.replace("add-page.html");
      return;
    }
    if (path === "view-post.html") {
      var q = window.location.search || "";
      window.location.replace("post.html" + q);
    }
  }

  function initEditPostPlaceholder() {
    var path = (window.location.pathname || "").split("/").pop();
    if (path !== "edit-post.html") return;
    var id = new URLSearchParams(window.location.search).get("id");
    var hint = document.getElementById("edit-hint");
    if (hint && id) {
      hint.textContent = "Post ID: " + id + " — add your edit form here.";
    }
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
    initReportsPage();
    initAllReportsPage();
    initReportDetailsPage();
    initAddPage();
    initHelpPage();
    initFeaturesPage();
    initAnalyticsPageExternal();
    initPagesAdminPage();
    initMediaPageExternal();
    initSettingsPageExternal();
    initFaqPageExternal();
    initPrivacyPageExternal();
    initRedirectPages();
    initEditPostPlaceholder();
    injectNavOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();

