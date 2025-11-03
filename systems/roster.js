/**
 * roster.js
 * Player's summoned units live here (in-memory).
 * Also defines the pool of possible summons for v0.1 baseline.
 */

import { randInt } from './rng.js';

// This is our active player roster (not persisted until saveGameState()).
let playerRoster = [];

// A minimal summon pool for v0.1
const summonPool = [
  {
    name: 'Lyra Stormborne',
    element: 'Storm',
    baseHP: 120,
    baseATK: 30,
  },
  {
    name: 'Draegon of Embers',
    element: 'Fire',
    baseHP: 150,
    baseATK: 40,
  },
  {
    name: 'Kairon Whisperleaf',
    element: 'Wind',
    baseHP: 100,
    baseATK: 35,
  },
  {
    name: 'Selene Umbra',
    element: 'Dark',
    baseHP: 110,
    baseATK: 28,
  },
  {
    name: 'Eldros Titanheart',
    element: 'Earth',
    baseHP: 180,
    baseATK: 20,
  },
];

export function getRoster() {
  return playerRoster;
}

export function setRoster(newRoster) {
  playerRoster = Array.isArray(newRoster) ? newRoster : [];
}

/**
 * summonRandomUnit()
 * Picks one summon from summonPool using deterministic RNG,
 * creates a leveled instance, and pushes it into playerRoster.
 */
export function summonRandomUnit() {
  const rollIndex = randInt(0, summonPool.length - 1);
  const base = summonPool[rollIndex];

  const unit = {
    name: base.name,
    element: base.element,
    level: 1,
    hp: base.baseHP,
    atk: base.baseATK,
  };

  playerRoster.push(unit);
  return unit;
}
