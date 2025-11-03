import { summonRandomUnit,getRoster } from '../systems/roster.js';
import { simulateBattle } from '../systems/combat.js';
import { saveGameState,loadGameState } from '../systems/save.js';
import { writeRosterToDOM,appendBattleLog,openModal,closeModal,handleGlobalKeydown } from './panels.js';
export function initUIBindings(){
 const s=document.getElementById('btn-summon');
 const b=document.getElementById('btn-battle');
 const sv=document.getElementById('btn-save');
 const ld=document.getElementById('btn-load');
 const mc=document.getElementById('modal-close');
 if(s){ s.addEventListener('click',()=>{ const u=summonRandomUnit(); writeRosterToDOM(getRoster()); appendBattleLog(`Summoned: ${u.name} [${u.element}]`); }); }
 if(b){ b.addEventListener('click',()=>{ const r=simulateBattle(); appendBattleLog(r.summary); if(r.details) openModal('Battle Report', r.details); }); }
 if(sv){ sv.addEventListener('click',()=>{ saveGameState(); appendBattleLog('Game saved.'); }); }
 if(ld){ ld.addEventListener('click',()=>{ const ok=loadGameState(); writeRosterToDOM(getRoster()); appendBattleLog(ok?'Game loaded.':'No save found.'); }); }
 if(mc){ mc.addEventListener('click',()=>{ closeModal(); }); }
 document.addEventListener('keydown', handleGlobalKeydown);
}