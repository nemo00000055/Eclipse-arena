// /src/systems/save.js
// SAVE_VERSION = 2, migrate v1->v2 with safe defaults. Side effects only here.
export const SAVE_VERSION = 2;

export function migrate(oldState){
  const s = oldState || {};
  // Handle v0.1 string or 1 numeric
  const version = typeof s.version === 'string' ? 1 : (Number.isFinite(s.version)? s.version : 1);
  const base = { version: SAVE_VERSION, roster: Array.isArray(s.roster)? s.roster:[], inventory: Array.isArray(s.inventory)? s.inventory:[], gold: s.gold||0, progression: s.progression||{ level:1, xp:0, talents:0 }, equipment: s.equipment||{} };
  // Ensure picklists/arrays present
  base.stash = Array.isArray(s.stash)? s.stash: [];
  base.shop = s.shop || { restockId:0, tabs:{ gear:[], consumables:[], featured:null }, buyback:[], lastWaveRestock:0 };
  base.waveIndex = s.waveIndex||0;
  base.seed = (s.seed|0) || 1;
  return base;
}

export function saveGameState(state){
  const safe = migrate(state);
  try{
    localStorage.setItem('eclipse_skyfall_save', JSON.stringify(safe));
    return { ok:true };
  }catch(e){
    return { ok:false, error: String(e?.message||e) };
  }
}

export function loadGameState(){
  try{
    const raw = localStorage.getItem('eclipse_skyfall_save');
    if (!raw) return migrate({});
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  }catch(e){
    return migrate({});
  }
}
