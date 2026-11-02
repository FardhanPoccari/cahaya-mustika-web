/* Transisi seluruh halaman dan animasi scroll; tetap bekerja melalui file://. */
(() => {
  "use strict";
  const initializedKey = "__cahaya_animation";
  if (window[initializedKey]) return;
  window[initializedKey] = true;
  const root = document.documentElement;
  const main = document.querySelector("main");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let bootTimer;

  function revealVisible() {
    document.querySelectorAll(".reveal-pending").forEach((element) => {
      const box = element.getBoundingClientRect();
      if (box.top < innerHeight && box.bottom > 0 && box.height > 0) {
        element.classList.remove("reveal-pending");
        element.classList.add("is-revealed");
      }
    });
  }
  function enterPage() {
    clearTimeout(bootTimer);
    root.classList.remove("is-loading", "is-leaving", "page-entering");
    main?.removeAttribute("aria-busy");
    revealVisible();
    document.dispatchEvent(new CustomEvent("site:ready"));
  }
  // Satu intro di halaman tujuan; klik tautan tidak menjalankan intro keluar.
  bootTimer = window.setTimeout(() => enterPage(), reduceMotion.matches ? 0 : 420);
  window.addEventListener("pageshow", (event) => { if (event.persisted) enterPage(); });
  window.addEventListener("pagehide", () => clearTimeout(bootTimer));

  function canNavigate(anchor, event, url) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("data-no-transition")) return false;
    if (url.protocol !== "file:" && !/^https?:$/.test(url.protocol)) return false;
    if (url.protocol !== location.protocol || url.host !== location.host) return false;
    const siteRoot = new URL(root.dataset.siteRoot || "./", location.href);
    if (!url.pathname.startsWith(siteRoot.pathname) || !url.pathname.toLowerCase().endsWith(".html")) return false;
    return !(url.pathname === location.pathname && url.search === location.search);
  }
  document.addEventListener("click", (event) => {
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!anchor) return;
    let url;
    try { url = new URL(anchor.href, location.href); } catch (_) { return; }
    if (!canNavigate(anchor, event, url)) return;
    // HTTP(S) memakai navigasi native. File lokal hanya meneruskan tema, tanpa animasi keluar.
    if (location.protocol !== "file:") return;
    url.searchParams.set("theme", root.dataset.theme === "dark" ? "dark" : "light");
    if (url.href !== anchor.href) {
      event.preventDefault();
      try { location.assign(url.href); } catch (_) { enterPage(); }
    }
  });

  // Progressive enhancement: content is visible by default, only offscreen nodes wait.
  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  let observer;
  function showAll() {
    observer?.disconnect();
    revealNodes.forEach((node) => { node.classList.remove("reveal-pending"); node.classList.add("is-revealed"); });
  }
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove("reveal-pending");
        target.classList.add("is-revealed");
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -28px 0px" });
    revealNodes.forEach((node) => {
      const box = node.getBoundingClientRect();
      node.style.setProperty("--reveal-delay", Math.min(Number(node.dataset.revealDelay) || 0, 180) + "ms");
      if (box.top >= innerHeight || box.bottom <= 0 || box.height === 0) node.classList.add("reveal-pending");
      else node.classList.add("is-revealed");
      observer.observe(node);
    });
  } else showAll();
  document.addEventListener("focusin", (event) => {
    // Keyboard focus must never land in invisible content.
    const pending = event.target.closest?.(".reveal-pending");
    if (pending) { pending.classList.remove("reveal-pending"); pending.classList.add("is-revealed"); observer?.unobserve(pending); }
  });
  document.addEventListener("site:filter", () => requestAnimationFrame(revealVisible));
  const motionChanged = () => { if (reduceMotion.matches) { showAll(); enterPage(); } };
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", motionChanged);
  else reduceMotion.addListener(motionChanged);
})();
