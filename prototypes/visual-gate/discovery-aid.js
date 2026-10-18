// Presentation-only aids. They never change selection, opacity, pose, or history.
export function surfaceFeedback({ node, selected, hovered, previewId, showAreas, mode, surfaceByNode }) {
  if (selected) return 'selected';
  const region = surfaceByNode.get(node);
  if (mode === 'whole' && region && region.id === previewId) return 'preview';
  if (hovered) return 'hover';
  if (mode === 'whole' && showAreas && region) return 'available';
  return 'base';
}

// Runs before OrbitControls' target/bubble wheel listener. Keep the browser's
// default scroll action: do NOT preventDefault. Touch/pinch events are untouched.
export function keepWheelForPage(event) { event.stopImmediatePropagation(); }
