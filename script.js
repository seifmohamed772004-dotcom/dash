/**
 * Main app script — shared storage + per-page initializers
 */
(function () {
  "use strict";

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

  function initApp() {
    ensureDefaultAdminUser();
    initLoginPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
