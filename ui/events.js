/**
 * events.js
 * Attaches DOM event listeners to buttons and wires them to backend systems.
 */

import { summonRandomUnit, getRoster } from '../systems/roster.js';
import { simulateBattle } from '../systems/combat.js';
import { saveGameState, loadGameState } from '../systems/save.js';
import { writeRosterToDOM, appendBattleLog, openModal, closeModal, handleGlobalKeydown } from './panels.js';
import { setLastInvoker } from './panels.js';

export function initUIBindings() {
  const btnSummon = document.getElementById('btn-summon');
  const btnBattle = document.getElementById('btn-battle');
  const btnSave = document.getElementById('btn-save');
  const btnLoad = document.getElementById('btn-load');
  const btnModalClose = document.getElementById('modal-close');

  // Summon button: add a unit to roster
  if (btnSummon) {
    btnSummon.addEventListener('click', () => {
      const newUnit = summonRandomUnit();
      writeRosterToDOM(getRoster());
      appendBattleLog(`Summoned: ${newUnit.name} [${newUnit.element}]`);
    });
  }

  // Battle button: run combat sim and print result
  if (btnBattle) {
    btnBattle.addEventListener('click', () => {
      const report = simulateBattle();
      appendBattleLog(report.summary);
      if (report.details) {
        setLastInvoker(btnBattle);
        openModal('Battle Report', report.details);
      }
    });
  }

  // Save button
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      saveGameState();
      appendBattleLog('Game saved.');
    });
  }

  // Load button
  if (btnLoad) {
    btnLoad.addEventListener('click', () => {
      const loadedOK = loadGameState();
      writeRosterToDOM(getRoster());
      appendBattleLog(loadedOK ? 'Game loaded.' : 'No save found.');
    });
  }

  // Modal close
  if (btnModalClose) {
    btnModalClose.addEventListener('click', () => {
      closeModal();
    });
  }

  // Escape key handling for modal close
  document.addEventListener('keydown', handleGlobalKeydown);
}
