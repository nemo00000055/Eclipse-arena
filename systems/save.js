/**
 * /src/systems/save.js
 * v0.1 Save/Load service (localStorage). Version tag is a string 'v0.1'.
 * APIs:
 *  - save(state, versionTag = 'v0.1') -> boolean
 *  - load() -> { version: string, roster: array } | null
 *  - migrate(oldObj) -> { version: string, roster: array }
 *
 * Back-compat wrappers kept: saveGameState(), loadGameState()
 */

import { listUnits, setRoster } from './roster.js';

const SAVE_KEY = 'eclipseSummonersSave';
const CURRENT_VERSION = 'v0.1';

/**
 * Migrate various historical formats into the current v0.1 shape.
 * Supported legacy:
 *  - { version: 1, roster: [...] }  // pre-v0.1 numeric version
 *  - { roster: [...] }               // missing version (very early)
 */
export function migrate(oldObj) {
  if (!oldObj || typeof oldObj !== 'object') {
    return { version: CURRENT_VERSION, roster: [] };
  }
  // If already in v0.1 format
  if (typeof oldObj.version === 'string') {
    return { version: oldObj.version, roster: Array.isArray(oldObj.roster) ? oldObj.roster : [] };
  }
  // Older numeric version -> map to v0.1
  if (typeof oldObj.version === 'number') {
    return { version: CURRENT_VERSION, roster: Array.isArray(oldObj.roster) ? oldObj.roster : [] };
  }
  // No version field
  return { version: CURRENT_VERSION, roster: Array.isArray(oldObj.roster) ? oldObj.roster : [] };
}

export function save(state, versionTag = CURRENT_VERSION) {
  const payload = {
    version: String(versionTag),
    roster: Array.isArray(state?.roster) ? state.roster : listUnits(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    return migrated;
  } catch {
    return null;
  }
}

// --- Back-compat wrappers used by older FE stubs
export function saveGameState() {
  return save({ roster: listUnits() }, CURRENT_VERSION);
}

export function loadGameState() {
  const data = load();
  if (!data) return false;
  setRoster(Array.isArray(data.roster) ? data.roster : []);
  return true;
}
