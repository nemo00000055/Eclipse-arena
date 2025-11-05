/**
 * /src/systems/save.js
 * v0.1 Save/Load per INTERFACES.md and STATE_SCHEMA.md
 * Exports:
 *  - SAVE_KEY:string = 'eclipseSummonersSave'
 *  - SAVE_VERSION:number = 1
 *  - saveGameState():boolean
 *  - loadGameState():boolean
 *  - migrate(state:any):SaveState
 *
 * SaveState shape:
 *  { version:number, roster: Unit[] }
 */

import { getRoster, setRoster } from './roster.js';

export const SAVE_KEY = 'eclipseSummonersSave';
export const SAVE_VERSION = 1;

// Accepts legacy shapes and returns normalized {version:1, roster:[]}
export function migrate(state) {
  if (!state || typeof state !== 'object') {
    return { version: SAVE_VERSION, roster: [] };
  }
  // Handle earlier experimental string version e.g., 'v0.1'
  if (typeof state.version === 'string') {
    return { version: SAVE_VERSION, roster: Array.isArray(state.roster) ? state.roster : [] };
  }
  // Numeric version
  const v = Number.isFinite(state.version) ? state.version : SAVE_VERSION;
  const roster = Array.isArray(state.roster) ? state.roster : [];
  return { version: v, roster };
}

export function saveGameState() {
  const data = { version: SAVE_VERSION, roster: getRoster() };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const normalized = migrate(parsed);
    setRoster(Array.isArray(normalized.roster) ? normalized.roster : []);
    return true;
  } catch {
    return false;
  }
}
