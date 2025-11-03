/**
 * /src/systems/roster.js
 * In-memory roster model for v0.1.
 * APIs:
 *  - addUnit(unit)
 *  - getFirstUnit()
 *  - listUnits()              // returns a shallow copy
 *  - rollUnit()               // create & add a unit chosen deterministically from summonPool
 *
 * Back-compat:
 *  - getRoster(), setRoster(), summonRandomUnit() wrappers retained.
 */

import { nextInt } from './rng.js';

let _playerRoster = [];

// Minimal summon pool for v0.1 (no rarity, no elements used in combat logic)
const summonPool = [
  { name: 'Lyra Stormborne',  element: 'Storm', baseHP: 120, baseATK: 30 },
  { name: 'Draegon of Embers', element: 'Fire',  baseHP: 150, baseATK: 40 },
  { name: 'Kairon Whisperleaf', element: 'Wind',  baseHP: 100, baseATK: 35 },
  { name: 'Selene Umbra',     element: 'Dark',  baseHP: 110, baseATK: 28 },
  { name: 'Eldros Titanheart', element: 'Earth', baseHP: 180, baseATK: 20 },
];

export function addUnit(unit) {
  // Minimal shape guard
  const u = {
    name: String(unit?.name ?? 'Unknown'),
    element: String(unit?.element ?? 'Neutral'),
    level: Number(unit?.level ?? 1),
    hp: Number(unit?.hp ?? 1),
    atk: Number(unit?.atk ?? 1),
  };
  _playerRoster.push(u);
  return u;
}

export function getFirstUnit() {
  return _playerRoster.length ? _playerRoster[0] : null;
}

export function listUnits() {
  return _playerRoster.slice();
}

export function rollUnit() {
  const idx = nextInt(0, summonPool.length - 1);
  const base = summonPool[idx];
  const unit = {
    name: base.name,
    element: base.element,
    level: 1,
    hp: base.baseHP,
    atk: base.baseATK,
  };
  addUnit(unit);
  return unit;
}

// --- Back-compat helpers (used by older FE stubs)
export function getRoster() { return _playerRoster; }
export function setRoster(newRoster) { _playerRoster = Array.isArray(newRoster) ? newRoster : []; }
export function summonRandomUnit() { return rollUnit(); }
