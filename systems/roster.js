// /src/systems/roster.js
// Pure roster & unit generation utilities to satisfy façade contracts:
// - rollUnit(seed)
// - addUnit(state, unit)
// - getFirstUnit(state)
// - listUnits(state)
// - setUnitElement(state, index, element)
//
// Deterministic via seeded PRNG; no DOM; JSON-serializable returns.

import { makeRng } from './rng.js';

const CLASSES = ['Warrior','Mage','Rogue','Cleric','Ranger'];
const ELEMENTS = ['Fire','Water','Earth','Air','Light','Dark'];

// Helper to deep-clone JSON-safe objects
function clone(x){ return JSON.parse(JSON.stringify(x ?? {})); }

export function rollUnit(seed){
  const rng = makeRng((seed>>>0) || 1);
  const cls = CLASSES[Math.floor(rng.next()*CLASSES.length)] || CLASSES[0];
  const element = ELEMENTS[Math.floor(rng.next()*ELEMENTS.length)] || ELEMENTS[0];

  // Base stats by class (simple deterministic table)
  const base = {
    Warrior: { hp: 120, atk: 14, def: 8 },
    Mage:    { hp:  90, atk: 18, def: 4 },
    Rogue:   { hp: 100, atk: 16, def: 6 },
    Cleric:  { hp: 110, atk: 12, def: 7 },
    Ranger:  { hp: 100, atk: 15, def: 5 },
  }[cls] || { hp: 100, atk: 12, def: 6 };

  // Light randomization within bounded ranges for determinism
  const hp  = base.hp  + rng.int(0, 10);
  const atk = base.atk + rng.int(0, 3);
  const def = base.def + rng.int(0, 2);

  const id = `${cls.slice(0,2).toUpperCase()}-${element.slice(0,2).toUpperCase()}-${rng.int(10000,99999)}`;
  const unit = {
    id,
    name: `${element} ${cls}`,
    class: cls,
    element,
    level: 1,
    hp,
    atk,
    def
  };
  return unit;
}

export function addUnit(state, unit){
  const s = clone(state);
  s.roster = Array.isArray(s.roster) ? s.roster.slice() : [];
  s.roster.push(clone(unit));
  return s;
}

export function getFirstUnit(state){
  const r = Array.isArray(state?.roster) ? state.roster : [];
  return r.length ? clone(r[0]) : null;
}

export function listUnits(state){
  const r = Array.isArray(state?.roster) ? state.roster : [];
  return r.map(u => clone(u));
}

export function setUnitElement(state, index, element){
  const s = clone(state);
  if (!Array.isArray(s.roster) || index < 0 || index >= s.roster.length){
    return { error: 'BAD_INPUT' };
  }
  const safeElement = ELEMENTS.includes(element) ? element : ELEMENTS[0];
  s.roster[index] = { ...s.roster[index], element: safeElement };
  return s;
}
