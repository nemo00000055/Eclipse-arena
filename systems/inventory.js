// /src/systems/inventory.js
// inventory, stash, lock, move, sell 50%
import { priceFor } from './loot.js';

export function addDrop(state, item){
  const s = JSON.parse(JSON.stringify(state||{}));
  s.inventory = s.inventory || [];
  s.inventory.push(JSON.parse(JSON.stringify(item)));
  return s;
}

export function listItems(state){ return Array.isArray(state?.inventory)? state.inventory.slice(): []; }

export function lockItem(state, index, locked=true){
  const s = JSON.parse(JSON.stringify(state||{}));
  if (!Array.isArray(s.inventory) || index<0 || index>=s.inventory.length) return { error:'BAD_INPUT' };
  s.inventory[index].locked = !!locked;
  return s;
}

export function moveToStash(state, index){
  const s = JSON.parse(JSON.stringify(state||{}));
  if (!Array.isArray(s.inventory) || index<0 || index>=s.inventory.length) return { error:'BAD_INPUT' };
  s.stash = s.stash || [];
  const [it] = s.inventory.splice(index,1);
  s.stash.push(it);
  return s;
}

export function sellItem(state, index){
  const s = JSON.parse(JSON.stringify(state||{}));
  if (!Array.isArray(s.inventory) || index<0 || index>=s.inventory.length) return { error:'BAD_INPUT' };
  const it = s.inventory[index];
  if (it.locked) return { error:'LOCKED' };
  const gold = Math.floor(priceFor(it)*0.5);
  s.gold = (s.gold||0)+gold;
  s.inventory.splice(index,1);
  return { state:s, gold };
}
