/**
 * /src/systems/combat.js
 * v0.1 simulateBattle(opts?) per INTERFACES.md
 * Exports:
 *  - simulateBattle(opts?: { enemyName?: string, enemyAtk?: number }): { summary:string, details:string }
 *
 * Behavior:
 *  - Uses first unit in roster as the hero. If none, returns a friendly message.
 *  - Enemy defaults: name 'Training Dummy', atk 15, hp 120.
 *  - Deterministic: uses rng.randInt() for small variance.
 */

import { randInt } from './rng.js';
import { getRoster } from './roster.js';

export function simulateBattle(opts = {}) {
  const roster = getRoster();
  const hero = roster && roster.length ? roster[0] : null;
  if (!hero) {
    return {
      summary: 'No unit available for battle.',
      details: 'You need to summon a unit before battling.',
    };
  }

  const enemyName = typeof opts.enemyName === 'string' ? opts.enemyName : 'Training Dummy';
  const enemyAtk  = Number.isFinite(opts.enemyAtk) ? opts.enemyAtk : 15;

  // Basic enemy stats; hp close to baseline so outcomes vary by seed/unit
  const enemy = { name: enemyName, hp: 120, atk: enemyAtk };

  // Simulate simple exchange: hero strikes first each turn with small variance
  let hHP = hero.hp;
  let eHP = enemy.hp;
  let turns = 0;
  let heroTotal = 0;
  let enemyTotal = 0;
  const TURN_CAP = 100;

  while (hHP > 0 && eHP > 0 && turns < TURN_CAP) {
    const heroVariance = randInt(0, 5);
    const enemyVariance = randInt(0, 5);
    const heroHit = Math.max(0, hero.atk + heroVariance);
    const enemyHit = Math.max(0, enemy.atk + enemyVariance);

    // Hero hits first
    eHP -= heroHit;
    heroTotal += heroHit;
    if (eHP <= 0) break;

    // Enemy counter
    hHP -= enemyHit;
    enemyTotal += enemyHit;
    turns += 1;
  }
  if (turns === 0 && hHP > 0 && eHP <= 0) turns = 1; // single-turn KO normalization

  const outcome = (eHP <= 0 && hHP > 0) ? 'WIN' : 'LOSE';

  const summary = `${hero.name} vs ${enemy.name} \u2192 ${outcome} in ${turns} turn${turns===1?'':'s'}.`;
  const details = [
    `Hero: ${hero.name} (HP ${hero.hp}, ATK ${hero.atk})`,
    `Enemy: ${enemy.name} (HP ${enemy.hp}, ATK ${enemy.atk})`,
    `Turns: ${turns}`,
    `Damage dealt: Hero ${heroTotal} / Enemy ${enemyTotal}`,
    `Outcome: ${outcome}`,
  ].join('\n');

  return { summary, details };
}
