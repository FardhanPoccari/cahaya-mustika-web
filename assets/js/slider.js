/* Automatic hero slideshow: exactly one clock per page. */
(() => {
  "use strict";
  const slideshow = document.querySelector("[data-slideshow]");
  if (!slideshow || slideshow.dataset.initialized === "true") return;
  slideshow.dataset.initialized = "true";
  const hero = slideshow.closest("section") || slideshow;
  const slides = [...slideshow.querySelectorAll(".hero-slide")];
  if (slides.length < 2) return;
  const dots = [...hero.querySelectorAll("[data-slide-to]")];
  const steps = [...hero.querySelectorAll("[data-slide-step]")];
  const caption = hero.querySelector("[data-slide-caption]");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DURATION = 5000;
  let active = 0, remaining = DURATION, dueAt = 0;
  let timer, progress;
  let onScreen = true, hiddenPage = false;
  function mayPlay() {
    return !motion.matches && onScreen && !hiddenPage && !document.hidden &&
      !document.body.classList.contains("dialog-open") && !document.body.classList.contains("menu-open") &&
      !document.documentElement.classList.contains("is-loading");
  }
  function stop() {
    if (timer !== undefined) {
      clearTimeout(timer); timer = undefined;
      remaining = Math.max(0, dueAt - performance.now());
    }
    progress?.pause(); hero.classList.add("slideshow-paused");
  }
  function schedule() {
    if (!mayPlay()) { stop(); return; }
    if (timer !== undefined) return;
    hero.classList.remove("slideshow-paused"); progress?.play();
    dueAt = performance.now() + remaining;
    timer = window.setTimeout(() => { timer = undefined; show(active + 1); }, remaining);
  }
  function show(index) {
    stop(); progress?.cancel(); progress = undefined; remaining = DURATION;
    active = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => {
      slide.classList.toggle("is-active",i === active);
      slide.setAttribute("aria-hidden",String(i !== active));
      if (i === active || i === (active + 1) % slides.length) {
        const photo = slide.querySelector("img"); if (photo) photo.loading = "eager";
      }
    });
    dots.forEach((button,i) => {
      if (i === active) button.setAttribute("aria-current","true"); else button.removeAttribute("aria-current");
      const fill = button.querySelector(".slide-indicator-fill");
      if (fill) fill.style.transform = i < active ? "scaleX(1)" : "scaleX(0)";
    });
    const fill = dots[active]?.querySelector(".slide-indicator-fill");
    if (fill?.animate && !motion.matches) {
      progress = fill.animate([{transform:"scaleX(0)"},{transform:"scaleX(1)"}],{duration:DURATION,fill:"forwards",easing:"linear"}); progress.pause();
    } else if (fill) fill.style.transform = "scaleX(1)";
    if (caption) caption.textContent = String(active+1).padStart(2,"0") + " / " + (slides[active].dataset.slideLabel || "Foto proyek");
    schedule();
  }
  dots.forEach(button => button.addEventListener("click",() => show(Number(button.dataset.slideTo))));
  steps.forEach(button => button.addEventListener("click",() => show(active + Number(button.dataset.slideStep))));
  hero.querySelector(".hero-progress")?.addEventListener("keydown",event => {
    if (!event.target.closest("[data-slide-to]")) return;
    const index = {ArrowRight:active+1,ArrowLeft:active-1,Home:0,End:slides.length-1}[event.key];
    if (index === undefined) return;
    event.preventDefault(); show(index); dots[active]?.focus({preventScroll:true});
  });
  ["visibilitychange","site:ready","site:menu-toggle","site:dialog-toggle"].forEach(name => document.addEventListener(name,schedule));
  window.addEventListener("pagehide",() => { hiddenPage = true; stop(); });
  window.addEventListener("pageshow",() => { hiddenPage = false; schedule(); });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; schedule(); },{threshold:.05}); observer.observe(hero);
  }
  const changeMotion = () => { stop(); show(active); };
  if (motion.addEventListener) motion.addEventListener("change",changeMotion); else motion.addListener(changeMotion);
  show(0);
})();
