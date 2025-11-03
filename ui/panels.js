/**
 * panels.js
 * Renders roster and battle log panels.
 * Controls modal open/close for future sub-panels.
 */

const rosterListEl = () => document.getElementById('roster-list');
const battleLogEl = () => document.getElementById('battle-log');
const modalOverlayEl = () => document.getElementById('modal-overlay');
const modalBodyEl = () => document.getElementById('modal-body');
const modalTitleEl = () => document.getElementById('modal-title');

let __lastInvoker = null;
/** Remember the element that triggered the modal so we can restore focus on close. */
export function setLastInvoker(el) { __lastInvoker = el || null; }

export function writeRosterToDOM(roster) {
  if (!rosterListEl()) return;
  if (!Array.isArray(roster) || roster.length === 0) {
    rosterListEl().textContent = '(no units yet)';
    return;
  }
  rosterListEl().textContent = roster
    .map((unit, idx) => {
      return `#${idx+1} ${unit.name} [${unit.element}] LV${unit.level} HP:${unit.hp} ATK:${unit.atk}`;
    })
    .join('\n');
}

export function appendBattleLog(line) {
  if (!battleLogEl()) return;
  const box = battleLogEl();
  box.textContent += (box.textContent ? '\n' : '') + line;
  box.scrollTop = box.scrollHeight;
}

/**
 * Open modal with a title and body.
 * If body is a Node, it will be appended. Otherwise, it will be rendered as text.
 */
export function openModal(title, body) {
  modalTitleEl().textContent = title;
  const bodyEl = modalBodyEl();
  // reset previous content
  bodyEl.textContent = '';
  if (body instanceof Node) {
    bodyEl.appendChild(body);
  } else if (body !== undefined && body !== null) {
    bodyEl.textContent = String(body);
  }
  modalOverlayEl().classList.remove('hidden');
  // focus the modal for accessibility
  modalOverlayEl().querySelector('.modal').focus();
}

export function closeModal() {
  modalOverlayEl().classList.add('hidden');
  // restore focus to the invoker if we have it
  if (__lastInvoker && typeof __lastInvoker.focus === 'function') {
    try { __lastInvoker.focus(); } catch {}
  }
}

/**
 * Support Escape key to close modal.
 */
export function handleGlobalKeydown(ev) {
  if (ev.key === 'Escape') {
    // if modal is visible, close it
    const overlay = modalOverlayEl();
    const isOpen = overlay && !overlay.classList.contains('hidden');
    if (isOpen) {
      closeModal();
    }
  }
}
