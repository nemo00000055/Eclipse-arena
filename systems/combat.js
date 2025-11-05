
/**
 * /src/systems/combat.js
 * Auto-battle logic (pure I/O) with structured results & validation.
 * Internal export name: simulateBattle (façade maps to simulateAutoBattle).
 */

import { rng } from './rng.js';

/**
 * Validate a unit-like object.
 */
function isUnit(u){
  return u && Number.isFinite(+u.hp) && Number.isFinite(+u.atk);
}

/**
 * Simulate battle between playerUnit and dummyEnemy.
 * Returns:
 *   - on success: { ok:true, outcome:'WIN'|'LOSE', turns:number, damageSummary:{ player:number, enemy:number } }
 *   - on bad input: { ok:false, code:'BAD_INPUT', message:string }
 */
export function simulateBattle(playerUnit, dummyEnemy){
  if (!isUnit(playerUnit)) {
    return { ok:false, code:'BAD_INPUT', message:'playerUnit must have numeric hp and atk.' };
  }
  if (!isUnit(dummyEnemy)) {
    return { ok:false, code:'BAD_INPUT', message:'dummyEnemy must have numeric hp and atk.' };
  }

  const hero = { hp: +playerUnit.hp, atk: +playerUnit.atk };
  const enemy = { hp: +dummyEnemy.hp, atk: +dummyEnemy.atk };

  let turns = 0;
  let hHP = hero.hp;
  let eHP = enemy.hp;
  let playerTotal = 0;
  let enemyTotal = 0;
  const TURN_CAP = 100;

  while (hHP > 0 && eHP > 0 && turns < TURN_CAP){
    const heroVar = rng.randInt(0,5);
    const enemyVar = rng.randInt(0,5);
    const heroHit = Math.max(0, hero.atk + heroVar);
    const enemyHit = Math.max(0, enemy.atk + enemyVar);

    // hero strikes first
    eHP -= heroHit;
    playerTotal += heroHit;
    if (eHP <= 0) break;

    hHP -= enemyHit;
    enemyTotal += enemyHit;
    turns += 1;
  }
  if (turns === 0 && hHP > 0 && eHP <= 0) turns = 1;

  const outcome = (eHP <= 0 && hHP > 0) ? 'WIN' : 'LOSE';
  return { ok:true, outcome, turns, damageSummary:{ player: playerTotal, enemy: enemyTotal } };
}
