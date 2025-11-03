/**
 * /src/systems/rng.js
 * Deterministic seedable RNG (LCG). v0.1 API
 * - setSeed(seed): set initial seed (uint32)
 * - getSeed(): get current seed (uint32)
 * - next(): float in [0,1)
 * - nextInt(min, maxInclusive): int in [min, maxInclusive]
 *
 * Back-compat wrappers kept: randFloat(), randInt(min,maxInclusive)
 * No DOM access. Pure outputs given seed & call order.
 */

let _seed = 123456789 >>> 0; // default; Frontend should call setSeed() once on boot

export function setSeed(s) { _seed = (s >>> 0); }
export function getSeed() { return _seed >>> 0; }

export function next() {
  // LCG constants (Numerical Recipes)
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 0x100000000;
}

export function nextInt(min, maxInclusive) {
  const r = next();
  const span = (maxInclusive - min + 1);
  return min + Math.floor(r * span);
}

// --- v0.1 Back-compat wrappers (do not remove without PM approval)
export function randFloat() { return next(); }
export function randInt(min, maxInclusive) { return nextInt(min, maxInclusive); }
