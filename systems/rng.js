
/**
 * /src/systems/rng.js
 * Seeded deterministic RNG (LCG) for v0.1.
 * Public surface (also exposed via façade):
 *   - named export: rng  (object)
 *       rng.next(): number in [0,1)
 *       rng.randInt(min:number, maxInclusive:number): number
 *       rng.setSeed(s:number): void
 *       rng.getSeed(): number
 * Back-compat named exports kept: setSeed, getSeed, randFloat, randInt
 */

let _seed = 123456789 >>> 0; // default; UI should call rng.setSeed(seed) once on boot

function _nextFloat() {
  // Numerical Recipes LCG
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0x100000000;
}
function _nextInt(min, maxInclusive) {
  const span = (maxInclusive - min + 1);
  return min + Math.floor(_nextFloat() * span);
}

export const rng = {
  next: _nextFloat,
  randInt: _nextInt,
  setSeed(s) { _seed = (s >>> 0); },
  getSeed() { return _seed >>> 0; },
};

// Back-compat simple functions
export function setSeed(s){ rng.setSeed(s); }
export function getSeed(){ return rng.getSeed(); }
export function randFloat(){ return rng.next(); }
export function randInt(min, maxInclusive){ return rng.randInt(min, maxInclusive); }
