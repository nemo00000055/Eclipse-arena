/**
 * /src/systems/roster.js
 * Roster model per INTERFACES.md v0.1
 * Exports:
 *  - getRoster():Unit[]
 *  - setRoster(newRoster:Unit[]):void
 *  - summonRandomUnit():Unit
 *
 * Unit shape (STATE_SCHEMA v0.1):
 * { name:string, element:'Storm'|'Fire'|'Wind'|'Dark'|'Earth', level:1, hp:number, atk:number }
 */

import { randInt } from './rng.js';

let _playerRoster = [];

// Summon pool (v0.1)
const summonPool = [
  { name: 'Lyra Stormborne',   element: 'Storm', baseHP: 120, baseATK: 30 },
  { name: 'Draegon of Embers', element: 'Fire',  baseHP: 150, baseATK: 40 },
  { name: 'Kairon Whisperleaf',element: 'Wind',  baseHP: 100, baseATK: 35 },
  { name: 'Selene Umbra',      element: 'Dark',  baseHP: 110, baseATK: 28 },
  { name: 'Eldros Titanheart', element: 'Earth', baseHP: 180, baseATK: 20 },
];

export function getRoster() {
  return _playerRoster;
}

export function setRoster(newRoster) {
  _playerRoster = Array.isArray(newRoster) ? newRoster : [];
}

export function summonRandomUnit() {
  const idx = randInt(0, summonPool.length - 1);
  const base = summonPool[idx];
  const unit = {
    name: base.name,
    element: base.element,
    level: 1,
    hp: base.baseHP,
    atk: base.baseATK,
  };
  _playerRoster.push(unit);
  return unit;
}
