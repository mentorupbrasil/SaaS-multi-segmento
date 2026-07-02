/** Remove backdrops Radix (Sheet/Dialog) que ficam presos após navegação ou refresh. */
export function clearStuckOverlays() {
  if (typeof document === "undefined") return;

  document.querySelectorAll("[data-radix-dialog-overlay]").forEach((el) => el.remove());

  document.body.style.removeProperty("pointer-events");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
  document.body.removeAttribute("data-scroll-locked");
  document.documentElement.removeAttribute("data-scroll-locked");
}
