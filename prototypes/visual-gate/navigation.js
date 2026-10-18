import { REGION_BY_ID } from './anatomy.js';
import { icon } from './icons.js';

// Presentation groups follow the existing reviewed descriptions, not geometry.
// The group headings never select an entire lobe.
export const ANATOMY_GROUPS = [
  { label: 'Lobus frontal', ids: ['precentral-left', 'precentral-right'] },
  { label: 'Lobus parietal', ids: ['postcentral-left', 'postcentral-right'] },
  { label: 'Lobus temporal', ids: ['superior-temporal-left', 'superior-temporal-right'] },
  { label: 'Bagian dalam', ids: ['hippocampus'] },
];

export function groupsFor(view) {
  return ANATOMY_GROUPS.map((group) => ({ ...group,
    regions: group.ids.map((id) => REGION_BY_ID.get(id)).filter((region) => view === 'explorer' || region.kind === 'surface'),
  })).filter((group) => group.regions.length);
}

export function locationFor(id, side = 'both') {
  const group = ANATOMY_GROUPS.find((entry) => entry.ids.includes(id));
  if (!group) return '';
  return id === 'hippocampus' ? `Bagian dalam · ${side === 'left' ? 'kiri' : side === 'right' ? 'kanan' : 'kiri dan kanan'}` : `Permukaan · ${group.label.toLowerCase()}`;
}

// Inline, nonmodal navigation: no backdrop, focus trap, or anatomy-covering sheet.
// Escape / close / selection return to the opening control. Tab remains native.
export function createAnatomyNavigator({ panel, list, current, triggers, closeButton, root, onSelect }) {
  let opener = null, open = false, lastView = null, lastActiveId = null;
  const buttons = new Map();
  function close({ restoreFocus = true } = {}) {
    open = false; panel.hidden = true; root.dataset.navigator = 'closed';
    triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    if (restoreFocus && opener?.isConnected && !opener.disabled) opener.focus();
  }
  function sync({ view, activeId, loaded }) {
    if (open && lastActiveId !== activeId) close({ restoreFocus: false });
    lastActiveId = activeId;
    if (lastView !== view) {
      if (open) close({ restoreFocus: false });
      lastView = view; list.replaceChildren(); buttons.clear();
      for (const group of groupsFor(view)) {
        const section = list.ownerDocument.createElement('fieldset');
        const heading = list.ownerDocument.createElement('legend'); heading.textContent = group.label; section.append(heading);
        for (const region of group.regions) {
          const button = list.ownerDocument.createElement('button');
          button.type = 'button'; button.className = 'anatomy-option'; button.dataset.region = region.id;
          const name = list.ownerDocument.createElement('span'); name.textContent = region.name;
          button.append(name); button.insertAdjacentHTML('beforeend', icon('check'));
          button.addEventListener('click', () => { onSelect(region.id); close(); });
          section.append(button); buttons.set(region.id, button);
        }
        list.append(section);
      }
    }
    current.textContent = activeId ? `Pilihan: ${REGION_BY_ID.get(activeId).name}` : 'Belum ada bagian yang dipilih.';
    for (const [id, button] of buttons) {
      button.disabled = !loaded; button.setAttribute('aria-pressed', String(id === activeId));
    }
    triggers.forEach((trigger) => trigger.disabled = !loaded);
  }
  function show(trigger) {
    if (trigger.disabled) return;
    opener = trigger; open = true; panel.hidden = false; root.dataset.navigator = 'open';
    triggers.forEach((entry) => entry.setAttribute('aria-expanded', 'true'));
    const target = [...buttons.values()].find((button) => button.getAttribute('aria-pressed') === 'true') ?? buttons.values().next().value;
    target?.focus();
  }
  triggers.forEach((trigger) => trigger.addEventListener('click', () => open ? close() : show(trigger)));
  closeButton.addEventListener('click', () => close());
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) { event.preventDefault(); close(); }
  });
  return { sync, close, show, get isOpen() { return open; } };
}
