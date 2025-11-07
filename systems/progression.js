// /src/systems/progression.js
// XP -> level logic with cap 100, HP refill on level, +1 talent per 5 levels
const MAX_LEVEL = 100;
function xpForLevel(level){
  // simple quadratic curve
  return Math.floor(50*level + 10*level*level);
}

export function applyXP(state, xpGained){
  const s = JSON.parse(JSON.stringify(state||{}));
  s.progression = s.progression || { level:1, xp:0, hp: s.maxHp||100, talents:0 };
  s.maxHp = s.maxHp || 100;
  const p = s.progression;
  p.xp = Math.max(0, (p.xp||0) + Math.max(0, xpGained|0));
  let leveled = 0;
  while(p.level < MAX_LEVEL && p.xp >= xpForLevel(p.level)){
    p.xp -= xpForLevel(p.level);
    p.level += 1;
    leveled += 1;
    s.hp = s.maxHp; // Refill on level
    if (p.level % 5 === 0) p.talents = (p.talents||0)+1;
  }
  if (p.level >= MAX_LEVEL){ p.level = MAX_LEVEL; p.xp = 0; }
  return s;
}

export function getTalents(state){
  return (state?.progression?.talents)|0;
}
