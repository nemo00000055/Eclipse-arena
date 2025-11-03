import { getRoster } from './roster.js'; import { randInt } from './rng.js';
export function simulateBattle(){
 const roster=getRoster(); if(!roster.length) return {summary:'No battle: you have no units. Summon first.', details:'Empty roster. Please summon a unit.'};
 const hero=roster[0]; const enemy={name:'Wraith of the Fracture', hp:80, atk:15};
 const heroRoll=hero.atk+randInt(0,10); const enemyRoll=enemy.atk+randInt(0,10);
 const winner= heroRoll>=enemyRoll ? hero.name : enemy.name;
 const details=`BATTLE START
Your Unit: ${hero.name} (ATK ${hero.atk})
Enemy: ${enemy.name} (ATK ${enemy.atk})

Rolls:
- ${hero.name}: ${heroRoll}
- ${enemy.name}: ${enemyRoll}

Winner: ${winner}
`;
 return { summary:`Battle resolved. Winner: ${winner}`, details };
}