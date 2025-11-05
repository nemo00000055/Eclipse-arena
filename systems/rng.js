/**
 * /src/systems/rng.js
 * Deterministic seedable RNG (LCG). v0.1 API per INTERFACES.md
 * Exports:
 *  - setSeed(s:number):void
 *  - getSeed():number
 *  - randFloat():number
 *  - randInt(min:number,maxInc:number):number
 *
 * Notes: Additional helpers (next/nextInt) are internal; UI calls only the above.
 */

let _seed = 123456789 >>> 0; // default seed; Frontend should call setSeed() on boot

export function setSeed(s) { _seed = (s >>> 0); }
export function getSeed() { return _seed >>> 0; }

// Internal core RNG
function next() {
  // LCG constants (Numerical Recipes)
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0x100000000;
}

function nextInt(min, maxInclusive) {
  const r = next();
  const span = (maxInclusive - min + 1);
  return min + Math.floor(r * span);
}

// Interface surface
export function randFloat() { return next(); }
export function randInt(min, maxInclusive) { return nextInt(min, maxInclusive); }
