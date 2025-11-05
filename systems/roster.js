
/**
 * /src/systems/roster.js
 * Minimal roster model for v0.1 Core Loop.
 * Public (also via façade):
 *  - addUnit(unit)
 *  - getFirstUnit()
 *  - listUnits()
 *  - summonRandomUnit()
 */

import { rng } from './rng.js';

let _playerRoster = [];

const summonPool = [
  { name: 'Lyra Stormborne',   element: 'Storm', baseHP: 120, baseATK: 30 },
  { name: 'Draegon of Embers', element: 'Fire',  baseHP: 150, baseATK: 40 },
  { name: 'Kairon Whisperleaf',element: 'Wind',  baseHP: 100, baseATK: 35 },
  { name: 'Selene Umbra',      element: 'Dark',  baseHP: 110, baseATK: 28 },
  { name: 'Eldros Titanheart', element: 'Earth', baseHP: 180, baseATK: 20 },
];

export function addUnit(unit){
  const u = {
    name: String(unit?.name ?? 'Unknown'),
    element: String(unit?.element ?? 'Neutral'),
    level: 1,
    hp: Number(unit?.hp ?? unit?.baseHP ?? 1),
    atk: Number(unit?.atk ?? unit?.baseATK ?? 1),
  };
  _playerRoster.push(u);
  return u;
}

export function getFirstUnit(){
  return _playerRoster.length ? _playerRoster[0] : null;
}

export function listUnits(){
  return _playerRoster.slice();
}

export function summonRandomUnit(){
  const idx = rng.randInt(0, summonPool.length - 1);
  const base = summonPool[idx];
  return addUnit({
    name: base.name, element: base.element, baseHP: base.baseHP, baseATK: base.baseATK
  });
}

// legacy helpers preserved for any older callers
export function getRoster(){ return _playerRoster; }
export function setRoster(newRoster){ _playerRoster = Array.isArray(newRoster) ? newRoster : []; }
export function rollUnit(){ return summonRandomUnit(); }
