
/**
 * panels.js (v0.1.1)
 * Renders roster, inventory, log, and manages modal.
 */
import { listUnits, listItems } from '../systems/index.js';
import { getState } from './state.js';

const rosterListEl = () => document.getElementById('roster-list');
const logEl = () => document.getElementById('log');
const modalOverlayEl = () => document.getElementById('modal-overlay');
const modalBodyEl = () => document.getElementById('modal-body');
const modalTitleEl = () => document.getElementById('modal-title');
const appRootEl = () => document.getElementById('app-root');

let __lastInvoker = null;
export function setLastInvoker(el){ __lastInvoker = el || null; }

export function writeRosterToDOM(state){
  const list = rosterListEl();
  if (!list) return;
  const units = listUnits(state);
  list.innerHTML = units.map((u,i) => (
    `<div class="row" data-index="${i}"><strong>${u.name}</strong> <span class="muted">(${u.element})</span> — ` +
    `Lv ${u.level} • HP ${u.hp} • ATK ${u.atk} • DEF ${u.def}</div>`
  )).join('') || '<div class="muted">No units yet. Click Summon.</div>';
}

export function writeInventoryToDOM(state){
  const panel = document.getElementById('inventory-panel');
  if (!panel) return;
  const items = listItems(state) || [];
  panel.innerHTML = `<h3>Inventory</h3>` + (items.length ? (
    `<ul class="list">${items.map((it,idx) => `<li>${it.name||('Item '+(idx+1))}</li>`).join('')}</ul>`
  ) : '<div class="muted">Inventory empty.</div>');
}

export function appendLog(line){
  const box = logEl();
  if (!box) return;
  const p = document.createElement('div');
  p.textContent = String(line);
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

export function openModal(title, body){
  modalTitleEl().textContent = title;
  const bodyEl = modalBodyEl();
  bodyEl.textContent = '';
  if (body instanceof Node) bodyEl.appendChild(body);
  else if (body != null) bodyEl.textContent = String(body);
  modalOverlayEl().classList.remove('hidden');
  if (appRootEl()) appRootEl().setAttribute('aria-hidden','true');
  modalOverlayEl().querySelector('.modal').focus();
}

export function closeModal(){
  modalOverlayEl().classList.add('hidden');
  if (appRootEl()) appRootEl().removeAttribute('aria-hidden');
  if (__lastInvoker?.focus) { try{ __lastInvoker.focus(); }catch{} }
}

export function handleGlobalKeydown(ev){
  if (ev.key === 'Escape'){
    const overlay = modalOverlayEl();
    const isOpen = overlay && !overlay.classList.contains('hidden');
    if (isOpen) closeModal();
  }
}
