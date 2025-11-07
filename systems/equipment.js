// /src/systems/equipment.js
// Equipment slots, equip/unequip, calcStats, set bonuses
const SLOTS = ['weapon','armor','trinket','boots','headgear','hands'];

export function validSlot(slot){ return SLOTS.includes(slot); }

export function equip(state, item, slot){
  if(!validSlot(slot)) return { error:'BAD_INPUT' };
  const s = JSON.parse(JSON.stringify(state||{}));
  s.equipment = s.equipment || {};
  s.equipment[slot] = JSON.parse(JSON.stringify(item));
  return s;
}

export function unequip(state, slot){
  if(!validSlot(slot)) return { error:'BAD_INPUT' };
  const s = JSON.parse(JSON.stringify(state||{}));
  s.equipment = s.equipment || {};
  delete s.equipment[slot];
  return s;
}

export function calcStats(state){
  const base = { atk: (state?.atk)||10, def:(state?.def)||10, lifesteal:(state?.lifesteal)||0, cooldownMod:0 };
  const eq = state?.equipment||{};
  for(const slot of Object.keys(eq)){
    const it = eq[slot];
    if(!it) continue;
    base.atk += (it.atk||0);
    base.def += (it.def||0);
    base.lifesteal += (it.lifesteal||0);
  }
  const set = setBonus(state);
  base.cooldownMod += set.cooldownMod||0;
  return base;
}

export function setBonus(state){
  // Dragon 4p: -1 special cooldown
  const eq = state?.equipment||{};
  let dragonPieces = 0;
  for (const it of Object.values(eq)){
    if (it?.set === 'Dragon') dragonPieces++;
  }
  return { cooldownMod: dragonPieces>=4 ? -1 : 0 };
}
