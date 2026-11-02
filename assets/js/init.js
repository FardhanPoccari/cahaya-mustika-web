/* Dijalankan sebelum CSS: tema konsisten saat membuka atau berganti halaman. */
(() => {
  "use strict";
  const root = document.documentElement;
  let theme = "light";
  try {
    const fromURL = new URLSearchParams(location.search).get("theme");
    const saved = localStorage.getItem("theme");
    theme = fromURL === "dark" || fromURL === "light" ? fromURL : saved === "dark" ? "dark" : "light";
  } catch (_) {
    try { if (new URLSearchParams(location.search).get("theme") === "dark") theme = "dark"; } catch (_) { /* Use light. */ }
  }
  root.dataset.theme = theme;
  root.classList.add("js", "is-loading");
  // Fail-safe: a failed later script must never leave the page covered.
  window.setTimeout(() => {
    if (root.classList.contains("is-loading")) {
      root.classList.remove("is-loading");
      document.dispatchEvent(new CustomEvent("site:ready"));
    }
  }, 2200);
})();
