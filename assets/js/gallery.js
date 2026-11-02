/* Galeri lokal: perbesar foto, panah, keyboard, swipe, Escape, dan restore focus. */
(() => {
  "use strict";
  const triggers = [...document.querySelectorAll("[data-lightbox]")];
  if (!triggers.length) return;
  let dialog;
  let opener;
  let current = 0;
  let gallery = [];
  let photo;
  let title;
  let status;
  let counter;
  let previous;
  let next;
  let swipeStart;

  function update(index) {
    current = (index + gallery.length) % gallery.length;
    const source = gallery[current].querySelector("img");
    if (!source) return;
    title.textContent = source.alt || "Foto videotron";
    counter.textContent = String(current + 1) + " / " + gallery.length;
    photo.alt = source.alt;
    photo.hidden = false;
    status.textContent = "Memuat foto…";
    photo.src = source.currentSrc || source.src;
    previous.hidden = next.hidden = gallery.length < 2;
  }
  function buildDialog() {
    dialog = document.createElement("dialog");
    dialog.className = "photo-dialog";
    dialog.id = "photo-dialog";
    dialog.setAttribute("aria-labelledby", "photo-dialog-caption");
    dialog.innerHTML = '<div class="photo-dialog-toolbar"><p class="photo-dialog-counter" aria-live="polite"></p><button type="button" class="photo-close" aria-label="Tutup foto">Tutup <span aria-hidden="true">×</span></button></div><div class="photo-viewer"><button type="button" class="photo-previous" aria-label="Foto sebelumnya">‹</button><figure><img alt="" decoding="async"><figcaption id="photo-dialog-caption"></figcaption></figure><button type="button" class="photo-next" aria-label="Foto berikutnya">›</button></div><p class="photo-status" role="status" aria-live="polite"></p><p class="photo-help">Gunakan panah untuk berganti foto · Esc untuk menutup</p>';
    document.body.append(dialog);
    photo = dialog.querySelector("img");
    title = dialog.querySelector("figcaption");
    status = dialog.querySelector(".photo-status");
    counter = dialog.querySelector(".photo-dialog-counter");
    previous = dialog.querySelector(".photo-previous");
    next = dialog.querySelector(".photo-next");
    dialog.querySelector(".photo-close").addEventListener("click", () => dialog.close());
    previous.addEventListener("click", () => update(current - 1));
    next.addEventListener("click", () => update(current + 1));
    photo.addEventListener("load", () => { status.textContent = ""; });
    photo.addEventListener("error", () => { photo.hidden = true; status.textContent = "Foto tidak dapat dimuat. Pilih foto lainnya."; });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); update(current - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); update(current + 1); }
    });
    const viewer = dialog.querySelector(".photo-viewer");
    viewer.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") swipeStart = { x: event.clientX, y: event.clientY };
    });
    viewer.addEventListener("pointerup", (event) => {
      if (!swipeStart || event.pointerType !== "touch") return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      if (Math.abs(dx) > 45 && Math.abs(dy) < 80) update(current + (dx < 0 ? 1 : -1));
      swipeStart = null;
    });
    viewer.addEventListener("pointercancel", () => { swipeStart = null; });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
      document.dispatchEvent(new CustomEvent("site:dialog-toggle"));
      opener?.focus({ preventScroll: true });
    });
    window.addEventListener("pagehide", () => { if (dialog.open) dialog.close(); });
  }
  triggers.forEach((button) => button.addEventListener("click", () => {
    const source = button.querySelector("img");
    if (!source || button.disabled) return;
    if (typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) {
      window.open(source.currentSrc || source.src, "_blank", "noopener");
      return;
    }
    if (!dialog) buildDialog();
    opener = button;
    gallery = triggers.filter((item) => item.dataset.gallery === button.dataset.gallery && !item.disabled && !item.closest("[hidden]"));
    update(gallery.indexOf(button));
    dialog.showModal();
    document.body.classList.add("dialog-open");
    document.dispatchEvent(new CustomEvent("site:dialog-toggle"));
  }));
})();
