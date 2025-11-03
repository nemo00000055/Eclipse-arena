// panels.js
// Renders roster and battle log panels and controls modal open/close.

const rosterListEl = () => document.getElementById('roster-list');
const battleLogEl = () => document.getElementById('battle-log');
const modalOverlayEl = () => document.getElementById('modal-overlay');
const modalBodyEl = () => document.getElementById('modal-body');
const modalTitleEl = () => document.getElementById('modal-title');

let lastInvoker = null;
export function setLastInvoker(el){ lastInvoker = el || null; }

export function writeRosterToDOM(roster) {
  const list = rosterListEl();
  if (!list) return;
  if (!Array.isArray(roster) || roster.length === 0) {
    list.textContent = '(no units yet)';
    return;
  }
  list.textContent = roster
    .map((unit, idx) => {
      const star = idx === 0 ? '★ ' : '';
      return `${star}#${idx+1} ${unit.name} [${unit.element}] LV${unit.level} HP:${unit.hp} ATK:${unit.atk}`;
    })
    .join('\n');
}

export function appendBattleLog(line) {
  const box = battleLogEl();
  if (!box) return;
  box.textContent += (box.textContent ? '\n' : '') + line;
  box.scrollTop = box.scrollHeight;
}

export function openModal(title, body) {
  const overlay = modalOverlayEl();
  if (!overlay) return;
  modalTitleEl().textContent = title;
  const bodyEl = modalBodyEl();
  bodyEl.textContent = '';
  if (body instanceof Node) {
    bodyEl.appendChild(body);
  } else if (body !== undefined && body !== null) {
    bodyEl.textContent = String(body);
  }
  overlay.classList.remove('hidden');
  overlay.querySelector('.modal').focus();
}

export function closeModal() {
  const overlay = modalOverlayEl();
  if (!overlay) return;
  overlay.classList.add('hidden');
  // restore focus to the control that opened the modal
  if (lastInvoker && typeof lastInvoker.focus === 'function') {
    lastInvoker.focus();
  }
}

/** Support Escape key to close modal. */
export function handleGlobalKeydown(ev) {
  if (ev.key === 'Escape') {
    const overlay = modalOverlayEl();
    const isOpen = overlay && !overlay.classList.contains('hidden');
    if (isOpen) closeModal();
  }
}
