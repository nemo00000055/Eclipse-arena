// /src/systems/rng.js
// Deterministic PRNG (Mulberry32) with explicit seed control.
let _seed = 123456789;
export function setSeed(seed) { _seed = (seed>>>0) || 0; return _seed; }
export function getSeed(){ return _seed; }
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a>>>15, 1 | a); t = t + Math.imul(t ^ t>>>7, 61 | t) ^ t; return ((t ^ t>>>14) >>> 0) / 4294967296; } }
export function makeRng(seed){ const s = (seed>>>0) || _seed; const f = mulberry32(s); return { next:()=>f(), int:(min,max)=>Math.floor(f()*(max-min+1))+min, pick:(arr)=>arr.length?arr[Math.floor(f()*arr.length)]:null }; }
export function rand(){ return makeRng(_seed).next(); }
export function randInt(min, max){ return makeRng(_seed).int(min,max); }
export function choice(arr){ return makeRng(_seed).pick(arr); }
