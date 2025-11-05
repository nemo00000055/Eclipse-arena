
/**
 * /src/systems/index.js — façade
 * Stable import surface for UI.
 */

export { rng } from './rng.js';
export { addUnit, getFirstUnit, listUnits, summonRandomUnit as rollUnit } from './roster.js';
export { simulateBattle as simulateAutoBattle } from './combat.js';
export { saveGameState as save, loadGameState as load, migrate } from './save.js';
