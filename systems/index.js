// /src/systems/index.js
// Façade re-exports aligned with INTERFACES.md audit:
//  - rng
//  - setSeed
//  - rollUnit
//  - roster ops: addUnit, getFirstUnit, listUnits, setUnitElement
//  - simulateAutoBattle
//  - existing systems: inventory, loot, equipment, waves, progression, shop, combat, save

import { makeRng, setSeed as _setSeed, getSeed, rand, randInt, choice } from './rng.js';
import { rollItem, priceFor } from './loot.js';
import { addDrop, listItems, lockItem, moveToStash, sellItem } from './inventory.js';
import { equip as equipItem, unequip as unequipItem, calcStats, setBonus } from './equipment.js';
import { themeForWave, tierForWave, tierMultiplier, generateWave, previewNextWave } from './waves.js';
import { applyXP, getTalents } from './progression.js';
import { generateShop, refreshShop, getRefreshCost, buyItem, autobumpOnWave } from './shop.js';
import { simulateCombat, simulateAutoBattle } from './combat.js';
import { SAVE_VERSION, migrate, saveGameState as save, loadGameState as load } from './save.js';
import { rollUnit, addUnit, getFirstUnit, listUnits, setUnitElement } from './roster.js';

// Façade 'rng' object expected by audit/INTERFACES.md
const rng = {
  makeRng,
  getSeed,
  rand,
  randInt,
  choice,
};

function setSeed(seed){ return _setSeed(seed); }

export {
  // Audit-required exports
  rng,
  setSeed,
  rollUnit,
  addUnit,
  getFirstUnit,
  listUnits,
  setUnitElement,
  simulateAutoBattle,

  // Inventory & loot
  rollItem,
  priceFor,
  addDrop,
  listItems,
  lockItem,
  moveToStash,
  sellItem,

  // Equipment
  equipItem,
  unequipItem,
  calcStats,
  setBonus,

  // Waves & progression
  themeForWave,
  tierForWave,
  tierMultiplier,
  generateWave,
  previewNextWave,
  applyXP,
  getTalents,

  // Shop
  generateShop,
  refreshShop,
  getRefreshCost,
  buyItem,
  autobumpOnWave,

  // Combat (full API still available)
  simulateCombat,

  // Persistence
  SAVE_VERSION,
  migrate,
  save,
  load,
};
