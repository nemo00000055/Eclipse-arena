// /src/systems/combat.js
// v0.1.1 logic-only combat + façade wrapper simulateAutoBattle()
// - simulateCombat(input)
// - simulateAutoBattle(config) -> convenience wrapper for auto special use

import { makeRng } from './rng.js';
import { calcStats, setBonus } from './equipment.js';

export function simulateCombat(input){
  const cfg = input||{};
  makeRng(cfg.seed||1); // ensure deterministic sequence even if not used further
  const heroStats = calcStats(cfg.hero||{});
  const hero = { hp: (cfg.heroHp ?? 100), ...heroStats };
  const enemy = { hp: (cfg.enemyHp ?? 120), atk: cfg.enemyAtk ?? 15, def: cfg.enemyDef ?? 5, name: cfg.enemyName ?? 'Training Dummy' };
  const lifesteal = hero.lifesteal||0;
  const cdOffset = setBonus(cfg.hero||{}).cooldownMod||0;
  let specialCd = Math.max(1, (cfg.specialCd ?? 5) + cdOffset);
  let cd = 0;
  const speed = Math.max(1, Math.min(4, cfg.speed || 1));
  const log = [];
  let turn = 0;

  while(hero.hp>0 && enemy.hp>0 && turn<200){
    turn++;
    // Hero turn
    let dmg = Math.max(1, Math.floor((hero.atk ?? 10) - enemy.def));
    if (cd===0 && cfg.auto){
      dmg = Math.floor(dmg*1.5); // special
      cd = specialCd;
      if (cfg.battleLog) log.push(`Turn ${turn}: Special hits for ${dmg}`);
    } else {
      if (cfg.battleLog) log.push(`Turn ${turn}: Hit for ${dmg}`);
      cd = Math.max(0, cd-1);
    }
    enemy.hp -= dmg;

    if (lifesteal>0){
      const heal = Math.min(dmg, lifesteal);
      hero.hp = Math.min((cfg.heroHp ?? 100), hero.hp + heal);
      if (cfg.battleLog) log.push(`Lifesteal +${heal}`);
    }
    if (enemy.hp<=0) break;

    // Enemy turn
    const edmg = Math.max(1, Math.floor((enemy.atk ?? 10) - (hero.def ?? 0)));
    hero.hp -= edmg;
    if (cfg.battleLog) log.push(`Enemy hits for ${edmg}`);

    // Speed is a logic param; does not change outcomes (no RNG scaling), loop bound kept deterministic
    (void)speed;
  }

  const result = hero.hp>0 ? 'WIN':'LOSS';
  return { result, turns: turn, enemy: enemy.name, log: (cfg.battleLog ? log : []) };
}

// Façade helper expected by INTERFACES.md
export function simulateAutoBattle(config){
  const cfg = { ...(config||{}), auto: true, battleLog: !!config?.battleLog };
  return simulateCombat(cfg);
}
