// events.js
// Attaches DOM event listeners to buttons and wires them to backend systems.

import { summonRandomUnit, getRoster } from '../systems/roster.js';
import { simulateBattle } from '../systems/combat.js';
import { saveGameState, loadGameState } from '../systems/save.js';
import { writeRosterToDOM, appendBattleLog, openModal, closeModal, handleGlobalKeydown, setLastInvoker } from './panels.js';

function buildResultCard(titleText, metaText, statsText) {
  const card = document.createElement('div');
  card.className = 'result-card';
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = titleText;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = metaText;
  card.appendChild(title);
  card.appendChild(meta);
  if (statsText) {
    const stats = document.createElement('div');
    stats.className = 'stats';
    stats.textContent = statsText;
    card.appendChild(stats);
  }
  return card;
}

function initLoadButtonState() {
  const btnLoad = document.getElementById('btn-load');
  if (btnLoad) btnLoad.disabled = true; // disabled until a save occurs
}

export function initUIBindings() {
  const btnSummon = document.getElementById('btn-summon');
  const btnBattle = document.getElementById('btn-battle');
  const btnSave = document.getElementById('btn-save');
  const btnLoad = document.getElementById('btn-load');
  const btnModalClose = document.getElementById('modal-close');

  initLoadButtonState();

  if (btnSummon) {
    btnSummon.addEventListener('click', () => {
      const newUnit = summonRandomUnit();
      writeRosterToDOM(getRoster());
      appendBattleLog(`Summoned: ${newUnit.name} [${newUnit.element}]`);
      const card = buildResultCard('Summon Result', `${newUnit.name} — ${newUnit.element}`, `LV${newUnit.level}  HP:${newUnit.hp}  ATK:${newUnit.atk}`);
      setLastInvoker(btnSummon);
      openModal('Summon', card);
    });
  }

  if (btnBattle) {
    btnBattle.addEventListener('click', () => {
      const report = simulateBattle();
      appendBattleLog(report.summary);
      const card = buildResultCard('Battle Report', report.summary, report.details || '');
      setLastInvoker(btnBattle);
      openModal('Battle', card);
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      saveGameState();
      appendBattleLog('Game saved.');
      if (btnLoad) btnLoad.disabled = false;
    });
  }

  if (btnLoad) {
    btnLoad.addEventListener('click', () => {
      const ok = loadGameState();
      writeRosterToDOM(getRoster());
      appendBattleLog(ok ? 'Game loaded.' : 'No save found.');
      btnLoad.disabled = !ok;
    });
  }

  if (btnModalClose) {
    btnModalClose.addEventListener('click', () => {
      closeModal();
    });
  }

  document.addEventListener('keydown', handleGlobalKeydown);
}
