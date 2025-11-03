/**
 * rng.js
 * Deterministic seedable RNG (linear congruential generator).
 * This lets QA reproduce summons / battles by reusing the same seed.
 */

let _seed = 123456789; // default seed; can be overridden later

export function setSeed(s) {
  _seed = (s >>> 0); // force uint32
}

export function getSeed() {
  return _seed >>> 0;
}

export function randFloat() {
  // LCG constants (Numerical Recipes style)
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  // scale to [0,1)
  return _seed / 0x100000000;
}

export function randInt(min, maxInclusive) {
  const r = randFloat();
  const span = maxInclusive - min + 1;
  return min + Math.floor(r * span);
}
