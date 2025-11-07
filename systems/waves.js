// /src/systems/waves.js
// Pure wave scheduling and preview utilities
import { makeRng } from './rng.js';

const THEMES = ['Forest','Desert','Ice','Volcano','Ruins','Sky'];
const TIERS = ['Normal','Elite','Boss','Super'];
const BASE_COUNTS = { Normal: 6, Elite: 3, Boss: 1, Super: 1 };
const TIER_MULT = { Normal: 1.0, Elite: 1.5, Boss: 2.25, Super: 4.0 };

export function themeForWave(waveIndex){
  const idx = Math.floor((waveIndex-1)/30) % THEMES.length;
  return THEMES[idx] || THEMES[0];
}

export function tierForWave(waveIndex){
  if (waveIndex % 30 === 0) return 'Super';
  if (waveIndex % 10 === 0) return 'Elite';
  if (waveIndex % 5  === 0) return 'Boss';
  return 'Normal';
}

export function tierMultiplier(tier){
  return TIER_MULT[tier] ?? 1.0;
}

export function generateWave(state, waveIndex, seed){
  const rng = makeRng(seed ?? state?.seed ?? 1);
  const tier = tierForWave(waveIndex);
  const theme = themeForWave(waveIndex);
  // Sample simple enemies by theme
  const pool = getEnemyPool(theme);
  const count = Math.max(1, BASE_COUNTS[tier] + rng.int(0,2));
  const enemies = [];
  for (let i=0;i<count;i++){
    enemies.push({ name: rng.pick(pool), tier, mult: tierMultiplier(tier) });
  }
  return { waveIndex, theme, tier, enemies };
}

function getEnemyPool(theme){
  const map = {
    Forest:['Wolf','Treant','Sprite','Vinebeast','Dryad'],
    Desert:['Scarab','Bandit','Sand Wraith','Cobra','Golem'],
    Ice:['Yeti','Ice Imp','Frost Wolf','Glacierling','Wendigo'],
    Volcano:['Imp','Lava Hound','Magma Slug','Ash Drake','Salamander'],
    Ruins:['Skeleton','Ghoul','Shade','Warlock','Wraith'],
    Sky:['Harpy','Zephyr','Cloudling','Sky Serpent','Griffin']
  };
  return map[theme] || map['Forest'];
}

export function previewNextWave(state){
  const next = (state?.waveIndex ?? 0) + 1;
  const w = generateWave(state, next, state?.seed);
  // Merge duplicates
  const counts = {};
  for(const e of w.enemies){
    const k = `${e.name}|${e.tier}`;
    counts[k] = (counts[k]||0)+1;
  }
  const merged = Object.entries(counts).map(([k,c])=>{
    const [name,tier] = k.split('|');
    return { name, tier, count:c };
  });
  return { waveIndex: w.waveIndex, theme: w.theme, tier: w.tier, merged };
}
