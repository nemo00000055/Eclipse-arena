
/**
 * events.js (v0.1.1)
 * DOM event bindings using façade-only imports.
 */
import { rollUnit, addUnit, simulateAutoBattle, save as saveState, load as loadState } from '../systems/index.js';
import { getState, setState, persist } from './state.js';
import { writeRosterToDOM, writeInventoryToDOM, appendLog, openModal, closeModal, handleGlobalKeydown, setLastInvoker } from './panels.js';

export function initUIBindings(){
  const btnSummon = document.getElementById('btn-summon');
  const btnBattle = document.getElementById('btn-battle');
  const btnSave = document.getElementById('btn-save');
  const btnLoad = document.getElementById('btn-load');
  const btnInventory = document.getElementById('btn-inventory');
  const btnModalClose = document.getElementById('modal-close');
  const btnNormal = document.getElementById('btn-action-normal');
  const btnSpecial = document.getElementById('btn-action-special');
  const chkAuto = document.getElementById('chk-auto');
  const rngSpeed = document.getElementById('rng-speed');

  // Load button policy: disabled on first load
  if (btnLoad) btnLoad.disabled = true;

  if (btnSummon){
    btnSummon.addEventListener('click', () => {
      const unit = rollUnit(Date.now()|0);
      const next = addUnit(getState(), unit);
      setState(next);
      writeRosterToDOM(getState());
      appendLog(`Summoned: ${unit.name} [${unit.element}]`);
    });
  }

  function runBattle(auto=true){
    const units = (getState()?.roster)||[];
    if (!units || units.length===0){
      setLastInvoker(btnBattle);
      openModal('Battle', 'Battle could not start — check roster.');
      return;
    }
    const cfg = { speed: Number(rngSpeed?.value||1), battleLog: true, auto: !!auto };
    const result = simulateAutoBattle(cfg);
    appendLog(`Battle vs ${result.enemy}: ${result.result} in ${result.turns} turns.`);
    if (Array.isArray(result.log) && result.log.length){
      const body = document.createElement('div');
      body.innerHTML = '<pre>'+result.log.map(l=>String(l)).join('\n')+'</pre>';
      setLastInvoker(btnBattle);
      openModal('Battle Report', body);
    }
  }

  if (btnBattle){
    btnBattle.addEventListener('click', () => runBattle(chkAuto?.checked));
  }

  if (btnNormal){
    btnNormal.addEventListener('click', () => {
      chkAuto && (chkAuto.checked = false);
      runBattle(false);
    });
  }

  if (btnSpecial){
    // Special is handled by auto + internal cooldown; provide UX feedback placeholder
    btnSpecial.addEventListener('click', () => {
      chkAuto && (chkAuto.checked = true);
      runBattle(true);
    });
  }

  if (btnSave){
    btnSave.addEventListener('click', () => {
      const res = persist();
      if (res?.ok){ appendLog('Game saved.'); if (btnLoad) btnLoad.disabled = false; }
      else { appendLog('Save failed.'); }
    });
  }

  if (btnLoad){
    btnLoad.addEventListener('click', () => {
      const loaded = loadState();
      if (loaded && loaded.version){
        setState(loaded);
        writeRosterToDOM(getState());
        writeInventoryToDOM(getState());
        appendLog('Game loaded.');
        btnLoad.disabled = false;
      }else{
        appendLog('Load failed.');
        btnLoad.disabled = true;
      }
    });
  }

  if (btnInventory){
    btnInventory.addEventListener('click', () => {
      const panel = document.getElementById('inventory-panel');
      writeInventoryToDOM(getState());
      if (panel) { panel.classList.remove('hidden'); setLastInvoker(btnInventory); openModal('Inventory', panel); }
    });
  }

  if (btnModalClose){
    btnModalClose.addEventListener('click', () => closeModal());
  }

  document.addEventListener('keydown', handleGlobalKeydown);
}
