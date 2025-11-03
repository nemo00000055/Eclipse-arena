/**
 * /src/systems/combat.js
 * v0.1 Auto-battle stub — pure logic given inputs, no DOM.
 * API:
 *  simulateAutoBattle(playerUnit, dummyEnemy) -> {
 *    outcome: 'WIN' | 'LOSE',
 *    turns: number,
 *    damageSummary: { heroDamageDealt: number, enemyDamageDealt: number }
 *  }
 *
 * Determinism: Damage rolls use RNG.nextInt with a global seeded RNG.
 */

import { nextInt } from './rng.js';

/**
 * Advance one turn of trading blows (hero first).
 * Returns updated { heroHP, enemyHP, heroDamage, enemyDamage }
 */
function stepTurn(hero, enemy) {
  // Small random variance keeps things interesting but deterministic by seed
  const heroVariance = nextInt(0, 5);
  const enemyVariance = nextInt(0, 5);
  const heroHit = Math.max(0, hero.atk + heroVariance);
  const enemyHit = Math.max(0, enemy.atk + enemyVariance);
  return {
    heroDamage: heroHit,
    enemyDamage: enemyHit,
    heroHP: hero.hp - enemyHit,
    enemyHP: enemy.hp - heroHit,
  };
}

export function simulateAutoBattle(playerUnit, dummyEnemy) {
  // Defensive copies; function remains pure w.r.t. inputs
  const hero = { hp: Number(playerUnit?.hp ?? 0), atk: Number(playerUnit?.atk ?? 0) };
  const enemy = { hp: Number(dummyEnemy?.hp ?? 0), atk: Number(dummyEnemy?.atk ?? 0) };

  let turns = 0;
  let heroHP = hero.hp;
  let enemyHP = enemy.hp;
  let heroDamageDealt = 0;
  let enemyDamageDealt = 0;

  // Cap to avoid infinite loops in degenerate inputs
  const TURN_CAP = 100;

  while (heroHP > 0 && enemyHP > 0 && turns < TURN_CAP) {
    const res = stepTurn({ hp: heroHP, atk: hero.atk }, { hp: enemyHP, atk: enemy.atk });
    turns += 1;
    heroHP = res.heroHP;
    enemyHP = res.enemyHP;
    heroDamageDealt += res.heroDamage;
    enemyDamageDealt += res.enemyDamage;
  }

  const outcome = (enemyHP <= 0 && heroHP > 0) ? 'WIN' : 'LOSE';
  return {
    outcome,
    turns,
    damageSummary: { heroDamageDealt, enemyDamageDealt },
  };
}
