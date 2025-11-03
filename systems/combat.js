/**
 * combat.js
 * Simulate a simple battle between the first unit in roster and a dummy enemy.
 * This is intentionally basic for v0.1 — QA just needs a deterministic result.
 */

import { getRoster } from './roster.js';
import { randInt } from './rng.js';

/**
 * simulateBattle()
 * Returns:
 * {
 *   summary: string   // short 1-line
 *   details: string   // multiline breakdown
 * }
 */
export function simulateBattle() {
  const roster = getRoster();
  if (!roster.length) {
    return {
      summary: 'No battle: you have no units. Summon first.',
      details: 'You attempted to battle with an empty roster. Please summon a unit.',
    };
  }

  const hero = roster[0];

  // dummy enemy for now
  const enemy = {
    name: 'Wraith of the Fracture',
    hp: 80,
    atk: 15,
  };

  // super simple resolution: hero damage roll vs enemy damage roll
  const heroRoll = hero.atk + randInt(0, 10);
  const enemyRoll = enemy.atk + randInt(0, 10);

  let winner;
  if (heroRoll >= enemyRoll) {
    winner = hero.name;
  } else {
    winner = enemy.name;
  }

  const details =
`BATTLE START
Your Unit: ${hero.name} (ATK ${hero.atk})
Enemy: ${enemy.name} (ATK ${enemy.atk})

Rolls:
- ${hero.name}: ${heroRoll}
- ${enemy.name}: ${enemyRoll}

Winner: ${winner}
`;

  return {
    summary: `Battle resolved. Winner: ${winner}`,
    details,
  };
}
