/* Slider hero: waktu, progress, jeda, kontrol, dan lifecycle browser. */
(() => {
  "use strict";
  const slideshow = document.querySelector("[data-slideshow]");
  if (!slideshow) return;
  const hero = slideshow.closest("section") || slideshow;
  const slides = [...slideshow.querySelectorAll(".hero-slide")];
  if (!slides.length) return;
  const dots = [...hero.querySelectorAll("[data-slide-to]")];
  const steps = [...hero.querySelectorAll("[data-slide-step]")];
  const caption = hero.querySelector("[data-slide-caption]");
  const pauseButton = hero.querySelector("[data-slideshow-pause]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DURATION = 5000;
  let active = 0;
  let userPaused = reduceMotion.matches;
  let hoverPaused = false;
  let focusPaused = false;
  let onScreen = true;
  let pageHidden = false;
  let timer;
  let dueAt = 0;
  let remaining = DURATION;
  let progressAnimation;
  const hoverable = window.matchMedia("(hover: hover)");

  function mayPlay() {
    return !userPaused && !hoverPaused && !focusPaused && onScreen && !pageHidden && !document.hidden && !document.body.classList.contains("dialog-open") && !document.body.classList.contains("menu-open") && !document.documentElement.classList.contains("is-loading") && !document.documentElement.classList.contains("is-leaving");
  }
  function stopClock() {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
      remaining = Math.max(0, dueAt - performance.now());
    }
    progressAnimation?.pause();
    hero.classList.add("slideshow-paused");
  }
  function schedule() {
    if (!mayPlay()) { stopClock(); return; }
    if (timer !== undefined) return;
    hero.classList.remove("slideshow-paused");
    progressAnimation?.play();
    dueAt = performance.now() + remaining;
    timer = window.setTimeout(() => {
      timer = undefined;
      show(active + 1);
    }, remaining);
  }
  function updatePauseButton() {
    if (!pauseButton) return;
    pauseButton.textContent = userPaused ? "Putar" : "Jeda";
    pauseButton.setAttribute("aria-pressed", String(userPaused));
    pauseButton.setAttribute("aria-label", userPaused ? "Putar pergantian foto" : "Jeda pergantian foto");
  }
  function show(index) {
    stopClock();
    progressAnimation?.cancel();
    remaining = DURATION;
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === active);
      slide.setAttribute("aria-hidden", String(i !== active));
      if (i === active || i === (active + 1) % slides.length) {
        const image = slide.querySelector("img");
        if (image) image.loading = "eager";
      }
    });
    dots.forEach((button, i) => {
      if (i === active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      const fill = button.querySelector(".slide-indicator-fill");
      if (fill) fill.style.transform = "scaleX(" + (i < active ? "1" : "0") + ")";
    });
    const fill = dots[active]?.querySelector(".slide-indicator-fill");
    progressAnimation = null;
    if (fill && fill.animate && !reduceMotion.matches) {
      progressAnimation = fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DURATION, fill: "forwards", easing: "linear" });
      progressAnimation.pause();
    } else if (fill) fill.style.transform = "scaleX(1)";
    if (caption) caption.textContent = String(active + 1).padStart(2, "0") + " / " + (slides[active].dataset.slideLabel || "Foto proyek");
    schedule();
  }
  dots.forEach((button) => button.addEventListener("click", () => show(Number(button.dataset.slideTo))));
  steps.forEach((button) => button.addEventListener("click", () => show(active + Number(button.dataset.slideStep))));
  pauseButton?.addEventListener("click", () => {
    userPaused = !userPaused;
    // An explicit Play command resumes immediately, including while the button has focus.
    if (!userPaused) { hoverPaused = false; focusPaused = false; }
    updatePauseButton(); schedule();
  });
  hero.querySelector(".hero-progress")?.addEventListener("keydown", (event) => {
    if (!event.target.closest("[data-slide-to]")) return;
    let index;
    if (event.key === "ArrowRight") index = active + 1;
    else if (event.key === "ArrowLeft") index = active - 1;
    else if (event.key === "Home") index = 0;
    else if (event.key === "End") index = slides.length - 1;
    else return;
    event.preventDefault(); show(index); dots[active]?.focus({ preventScroll: true });
  });
  hero.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && hoverable.matches) { hoverPaused = true; schedule(); }
  });
  hero.addEventListener("pointerleave", () => { hoverPaused = false; schedule(); });
  hero.addEventListener("focusin", () => { focusPaused = true; schedule(); });
  hero.addEventListener("focusout", (event) => { focusPaused = Boolean(event.relatedTarget && hero.contains(event.relatedTarget)); schedule(); });
  ["visibilitychange", "site:ready", "site:menu-toggle", "site:dialog-toggle", "site:navigate"].forEach((name) => document.addEventListener(name, schedule));
  window.addEventListener("pagehide", () => { pageHidden = true; stopClock(); });
  window.addEventListener("pageshow", () => { pageHidden = false; schedule(); });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; schedule(); }, { threshold: 0.05 });
    observer.observe(hero);
  }
  const motionChanged = () => {
    if (reduceMotion.matches) { userPaused = true; progressAnimation?.cancel(); }
    updatePauseButton(); schedule();
  };
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", motionChanged);
  else reduceMotion.addListener(motionChanged);
  updatePauseButton();
  show(0);
})();
