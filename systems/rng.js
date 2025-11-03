let _seed=123456789;
export function setSeed(s){ _seed=(s>>>0); }
export function getSeed(){ return _seed>>>0; }
export function randFloat(){ _seed=(_seed*1664525+1013904223)>>>0; return _seed/0x100000000; }
export function randInt(min,maxInc){ const r=randFloat(); const span=maxInc-min+1; return min+Math.floor(r*span); }