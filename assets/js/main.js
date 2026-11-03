/* Fungsi bersama. Semua isi halaman tetap berada di HTML dan bisa dibuka langsung. */
(() => {
  "use strict";
  const initializedKey = "__cahaya_main";
  if (window[initializedKey]) return;
  window[initializedKey] = true;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listenMedia = (media, handler) => {
    if (media.addEventListener) media.addEventListener("change", handler);
    else if (media.addListener) media.addListener(handler);
  };

  // Tema: disiapkan oleh init.js sebelum CSS, lalu disinkronkan dengan tombol.
  const themeButtons = [...document.querySelectorAll("[data-theme-toggle]")];
  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme === "dark" ? "dark" : "light";
    const dark = root.dataset.theme === "dark";
    themeButtons.forEach((button) => {
      button.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
      button.setAttribute("aria-pressed", String(dark));
      button.title = dark ? "Mode terang" : "Mode gelap";
      const icon = button.querySelector("[data-theme-icon]");
      const label = button.querySelector("[data-theme-label]");
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (label) label.textContent = dark ? "Mode terang" : "Mode gelap";
    });
    if (persist) {
      try { localStorage.setItem("theme", root.dataset.theme); } catch (_) { /* Optional persistence. */ }
      // Local file storage differs across browsers. The URL also carries the theme.
      if (location.protocol === "file:") {
        try {
          const url = new URL(location.href);
          url.searchParams.set("theme", root.dataset.theme);
          history.replaceState(history.state, "", url.href);
        } catch (_) { /* Links can still carry it on the next navigation. */ }
      }
    }
  }
  applyTheme(root.dataset.theme);
  themeButtons.forEach((button) => button.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true)));
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") applyTheme(event.newValue === "dark" ? "dark" : "light");
  });

  // Menu HP: ikon, scroll lock, focus, Escape, klik luar, dan perubahan lebar layar.
  const header = document.querySelector("header");
  const headerBar = header?.firstElementChild;
  function syncNavbarHeight() {
    if (headerBar) root.style.setProperty("--navbar-height", Math.ceil(headerBar.getBoundingClientRect().height + 1) + "px");
  }
  syncNavbarHeight();
  if (headerBar && "ResizeObserver" in window) new ResizeObserver(syncNavbarHeight).observe(headerBar);
  else window.addEventListener("resize", syncNavbarHeight, {passive: true});
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.getElementById("mobile-menu");
  const desktop = window.matchMedia("(min-width: 1280px)");
  const blockedRegions = [...document.querySelectorAll("main, footer, body > a[aria-label]")];
  const wasInert = new Map(blockedRegions.map((element) => [element, element.inert]));
  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !mobileMenu) return;
    open = Boolean(open && !desktop.matches);
    const focusWasInMenu = mobileMenu.contains(document.activeElement);
    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    const icon = menuButton.querySelector("span");
    if (icon) { icon.textContent = open ? "✕" : "☰"; icon.setAttribute("aria-hidden", "true"); }
    blockedRegions.forEach((element) => { element.inert = open || wasInert.get(element); });
    if (!open && (restoreFocus || focusWasInMenu) && !desktop.matches) menuButton.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("site:menu-toggle", { detail: { open } }));
  }
  if (menuButton && mobileMenu && header) {
    menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));
    menuButton.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault(); setMenu(true);
        mobileMenu.querySelector("a")?.focus();
      }
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (mobileMenu.hidden) return;
      if (event.key === "Escape") { event.preventDefault(); setMenu(false, true); }
      if (event.key === "Tab") {
        const links = [...header.querySelectorAll("a[href], button:not([disabled])")].filter((element) => element.getClientRects().length && !element.closest("[hidden]"));
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    });
    document.addEventListener("click", (event) => {
      if (!mobileMenu.hidden && !event.composedPath().includes(header)) setMenu(false);
    });
    listenMedia(desktop, () => { if (desktop.matches) setMenu(false); });
  }
  function updateHeader() { header?.classList.toggle("is-scrolled", window.scrollY > 24); }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("pageshow", () => { setMenu(false); updateHeader(); });
  document.addEventListener("site:navigate", () => setMenu(false));

  // Katalog: filter disimpan pada URL agar kembali dari detail tetap konsisten.
  const filters = [...document.querySelectorAll("[data-brand-filter]")];
  const groups = [...document.querySelectorAll("[data-product-brand]")];
  const filterStatus = document.querySelector("[data-filter-status]");
  function filterProducts(brand, changeURL = false, animate = false) {
    if (!filters.some((button) => button.dataset.brandFilter === brand)) brand = "all";
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.brandFilter === brand)));
    let count = 0;
    groups.forEach((group) => {
      group.hidden = brand !== "all" && group.dataset.productBrand !== brand;
      if (!group.hidden) {
        count += group.querySelectorAll("a.card").length;
        if (animate && !reduceMotion.matches && group.animate) {
          group.animate([{ opacity: 0.25, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" });
        }
      }
    });
    if (filterStatus) filterStatus.textContent = count + " produk ditampilkan";
    if (changeURL) {
      try {
        const url = new URL(location.href);
        if (brand === "all") url.searchParams.delete("brand"); else url.searchParams.set("brand", brand);
        history.replaceState(history.state, "", url.href);
      } catch (_) { /* Filtering itself does not require History API access. */ }
    }
    document.dispatchEvent(new CustomEvent("site:filter"));
  }
  if (filters.length) {
    filterProducts(new URLSearchParams(location.search).get("brand") || "all");
    filters.forEach((button) => button.addEventListener("click", () => filterProducts(button.dataset.brandFilter, true, true)));
    window.addEventListener("popstate", () => filterProducts(new URLSearchParams(location.search).get("brand") || "all"));
  }

  // FAQ: satu status native dan satu animasi tinggi per pertanyaan.
  const faqs = [...document.querySelectorAll(".faq-item")];
  const faqAnimations = new Map();
  function updateFAQIcon(item) {
    const icon = item.querySelector(".faq-symbol");
    if (icon) icon.textContent = item.open ? "−" : "+";
  }
  function setFAQ(item, open) {
    const start = item.getBoundingClientRect().height;
    const previous = faqAnimations.get(item);
    if (previous) { clearTimeout(previous.timer); previous.animation.cancel(); }
    faqAnimations.delete(item);
    item.style.removeProperty("overflow");
    // Toggle native state once. Closing an earlier item happens before opening the next.
    item.open = open;
    updateFAQIcon(item);
    const end = item.getBoundingClientRect().height;
    if (reduceMotion.matches || !item.animate || Math.abs(start - end) < 1) return;
    item.style.overflow = "hidden";
    const animation = item.animate([{height: start + "px"}, {height: end + "px"}], {
      duration: 260, easing: "cubic-bezier(.22,1,.36,1)"
    });
    const record = { animation, timer: undefined };
    faqAnimations.set(item, record);
    const finish = () => {
      if (faqAnimations.get(item) !== record) return;
      clearTimeout(record.timer);
      faqAnimations.delete(item);
      item.style.removeProperty("overflow");
      animation.cancel();
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
    // Closing native details can defer animation events in an offscreen frame.
    // Always restore natural layout, including after rapid repeated clicks.
    record.timer = window.setTimeout(finish, 284);
  }
  faqs.forEach((item) => {
    item.open = false;
    item.removeAttribute("name");
    updateFAQIcon(item);
    item.addEventListener("toggle", () => updateFAQIcon(item));
    item.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      const nextOpen = !item.open;
      const group = item.closest("[data-faq-group]");
      if (nextOpen) faqs.forEach((other) => {
        if (other !== item && other.open && other.closest("[data-faq-group]") === group) setFAQ(other, false);
      });
      setFAQ(item, nextOpen);
    });
  });
  function finishFAQAnimations() {
    faqAnimations.forEach((record, item) => {
      clearTimeout(record.timer);
      record.animation.cancel();
      item.style.removeProperty("overflow");
    });
    faqAnimations.clear();
  }
  listenMedia(reduceMotion, () => { if (reduceMotion.matches) finishFAQAnimations(); });
  window.addEventListener("resize", finishFAQAnimations, {passive: true});

  // Sebuah gambar yang gagal tidak boleh menyisakan kotak kosong tanpa keterangan.
  function handleImageError(image) {
    if (image.dataset.fallbackApplied || image.alt === "" || image.closest(".page-cover")) return;
    image.dataset.fallbackApplied = "true";
    if (image.closest("[data-slideshow]")) return; // The dark hero backdrop remains readable.
    image.hidden = true;
    const fallback = document.createElement("span");
    fallback.className = "image-error";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", image.alt);
    fallback.textContent = "Gambar belum tersedia";
    const trigger = image.closest("[data-lightbox]");
    if (trigger) { trigger.disabled = true; trigger.setAttribute("aria-label", "Gambar belum tersedia"); }
    image.parentElement?.append(fallback);
  }
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => handleImageError(image), { once: true });
    if (image.complete && image.naturalWidth === 0) handleImageError(image);
  });
})();
