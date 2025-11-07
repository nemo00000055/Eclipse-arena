// /src/systems/loot.js
// Rarities x7 with weights/budgets; Rare+ affixes; boss rarity bias; priceFor
import { makeRng } from './rng.js';

const RARITIES = ['Common','Uncommon','Rare','Epic','Legendary','Mythic','Ancient'];
const WEIGHTS   = [  40,       30,       15,     8,           5,         1.5,     0.5 ];
const BUDGET    = [  5,        8,        12,     18,          25,        35,      50 ];

function weightedPick(rng, arr, weights){
  const total = weights.reduce((a,b)=>a+b,0);
  let r = rng.next()*total;
  for(let i=0;i<arr.length;i++){ r -= weights[i]; if(r<=0) return arr[i]; }
  return arr[arr.length-1];
}

export function rollItem(seed, context={}){
  const rng = makeRng(seed||1);
  const bossBias = context?.bossTier ? 1.75 : 1.0;
  const weights = WEIGHTS.map((w,i)=> i>=2 ? w/bossBias : w); // Rare+ more likely on boss
  const rarity = weightedPick(rng, RARITIES, weights);
  const budget = BUDGET[RARITIES.indexOf(rarity)]||5;
  const base = { atk: rng.int(0,budget), def:rng.int(0,Math.floor(budget/2)), lifesteal: rng.int(0,Math.floor(budget/5)) };
  const item = { name: `${rarity} Item`, rarity, ...base };
  // Rare+ affixes
  if (RARITIES.indexOf(rarity) >= 2){
    if (rng.next()<0.5) item.atk += rng.int(1,3);
    if (rng.next()<0.5) item.def += rng.int(1,2);
    if (rng.next()<0.25) item.lifesteal += 1;
  }
  return item;
}

export function priceFor(item){
  const idx = RARITIES.indexOf(item?.rarity);
  const mult = idx>=0 ? (1+idx*0.4) : 1.0;
  const power = (item.atk||0)*2 + (item.def||0) + (item.lifesteal||0)*5;
  return Math.max(1, Math.floor(power * mult));
}
