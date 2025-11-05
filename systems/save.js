
/**
 * /src/systems/save.js
 * Structured save/load with migration scaffold and sanitization.
 * Façade re-exports saveGameState as save, loadGameState as load, and migrate.
 */

import { listUnits, setRoster } from './roster.js';

export const SAVE_KEY = 'eclipseSummonersSave';
export const SAVE_VERSION_TAG = 'v0.1';

/**
 * Sanitize and normalize state object to current schema.
 * Returns { ok:true, state, from:'v0.1', to:'v0.1' } in v0.1 (no-op),
 * or { ok:false, code:'SCHEMA', message } if irrecoverable.
 */
export function migrate(state){
  const base = { version: SAVE_VERSION_TAG, roster: [] };
  if (!state || typeof state !== 'object'){
    return { ok:true, state: base, from: SAVE_VERSION_TAG, to: SAVE_VERSION_TAG };
  }
  // Accept unknown fields but strip them
  const version = typeof state.version === 'string' ? state.version : SAVE_VERSION_TAG;
  const roster = Array.isArray(state.roster) ? state.roster : [];
  return { ok:true, state: { version, roster }, from: version, to: SAVE_VERSION_TAG };
}

export function saveGameState(){
  try{
    const payload = { version: SAVE_VERSION_TAG, roster: listUnits() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return { ok:true, state: payload };
  }catch(e){
    return { ok:false, code:'UNKNOWN', message: String(e && e.message || 'save failed') };
  }
}

export function loadGameState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw){
      return { ok:false, code:'NOT_FOUND', message:'no saved state' };
    }
    const parsed = JSON.parse(raw);
    const mig = migrate(parsed);
    if (!mig.ok){
      return { ok:false, code:'SCHEMA', message:'failed to migrate state' };
    }
    // Apply sanitized roster to memory
    setRoster(Array.isArray(mig.state.roster) ? mig.state.roster : []);
    return { ok:true, state: mig.state };
  }catch(e){
    return { ok:false, code:'SCHEMA', message:'corrupt or unreadable save' };
  }
}
