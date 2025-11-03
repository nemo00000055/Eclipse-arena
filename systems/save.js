/**
 * save.js
 * Persist and restore game state to localStorage for v0.1.
 * Includes versioning so we can migrate later when schemas change.
 */

import { getRoster, setRoster } from './roster.js';

const SAVE_KEY = 'eclipseSummonersSave';
const SAVE_VERSION = 1;

/**
 * saveGameState()
 * Grabs current roster and stores it.
 */
export function saveGameState() {
  const state = {
    version: SAVE_VERSION,
    roster: getRoster(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('saveGameState error:', err);
    return false;
  }
}

/**
 * loadGameState()
 * Loads from localStorage and attempts to migrate if needed.
 * Returns true if loaded something, false if not found.
 */
export function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw);

    // basic forward-compat skeleton for future migrations
    if (!parsed.version) {
      // hypothetically migrate older format; not needed yet
    }

    if (Array.isArray(parsed.roster)) {
      setRoster(parsed.roster);
    } else {
      setRoster([]);
    }
    return true;
  } catch (err) {
    console.error('loadGameState error:', err);
    return false;
  }
}
