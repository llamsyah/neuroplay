// A single 24-unit, 1.6-stroke vocabulary; no font glyphs or icon dependency.
const paths = {
  back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
  history: '<path d="M4 9a8 8 0 1 1 0 7M4 4v5h5M12 8v5l3 2"/>',
  rotateLeft: '<path d="M5 9a7.5 7.5 0 1 1 0 6M5 4v5h5"/>',
  rotateRight: '<path d="M19 9a7.5 7.5 0 1 0 0 6M19 4v5h-5"/>',
  zoomIn: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6M10 7v6"/>',
  zoomOut: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6"/>',
  reset: '<path d="M4 9V4h5M20 15v5h-5M4 4l5 5m11 11-5-5M15 4h5v5M9 20H4v-5"/>',
  deeper: '<path d="M5 19 19 5M7 5h12v12"/>',
  switch: '<rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="3" y="14" width="6" height="6" rx="1.5"/><path d="M13 7h8m-3-3 3 3-3 3M21 17h-8m3-3-3 3 3 3"/>',
  context: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M9 5c-3 4-3 10 0 14m6-14c3 4 3 10 0 14"/>',
  show: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  hide: '<path d="m3 3 18 18M10 5c6-1 12 7 12 7s-1 2-3 4M6 6c-3 2-4 6-4 6s4 7 10 7c2 0 4-1 5-2M10 10a3 3 0 0 0 4 4"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};

export function icon(name) {
  if (!paths[name]) throw new Error(`Unknown UI icon: ${name}`);
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

export function mountIcons(scope = document) {
  scope.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = icon(element.dataset.icon);
  });
}
