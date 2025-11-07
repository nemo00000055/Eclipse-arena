// /src/systems/shop.js
// tabs, featured -30%, refresh cost 20+10×restockId, buyback 60%, auto restock /20 waves
import { makeRng } from './rng.js';
import { rollItem, priceFor } from './loot.js';

export function generateShop(state){
  const s = JSON.parse(JSON.stringify(state||{}));
  s.shop = s.shop || { restockId:0, tabs:{ gear:[], consumables:[], featured:null }, buyback:[] };
  const rng = makeRng(s.seed||1);
  const mkItem = ()=> rollItem(rng.int(1,1<<30),{});
  s.shop.tabs.gear = [mkItem(),mkItem(),mkItem()];
  s.shop.tabs.consumables = []; // placeholder for v0.1.1
  const f = mkItem();
  f.price = Math.max(1, Math.floor(priceFor(f)*0.7));
  s.shop.tabs.featured = f;
  return s;
}

export function getRefreshCost(state){
  const id = state?.shop?.restockId|0;
  return 20 + 10*id;
}

export function refreshShop(state){
  const s = JSON.parse(JSON.stringify(state||{}));
  s.shop = s.shop || { restockId:0 };
  const cost = getRefreshCost(s);
  if ((s.gold||0) < cost) return { error:'INSUFFICIENT_GOLD' };
  s.gold -= cost;
  s.shop.restockId += 1;
  return generateShop(s);
}

export function buyItem(state, tab, index=0){
  const s = JSON.parse(JSON.stringify(state||{}));
  const t = s?.shop?.tabs?.[tab];
  if (!Array.isArray(t)) return { error:'BAD_INPUT' };
  const it = t[index];
  if (!it) return { error:'NOT_FOUND' };
  const price = it.price ?? priceFor(it);
  if ((s.gold||0) < price) return { error:'INSUFFICIENT_GOLD' };
  s.gold -= price;
  s.inventory = s.inventory || [];
  s.inventory.push(it);
  t.splice(index,1);
  // add to buyback
  s.shop.buyback = s.shop.buyback || [];
  const bb = { ...it, buyPrice: Math.floor(price*0.6) };
  s.shop.buyback.unshift(bb);
  s.shop.buyback = s.shop.buyback.slice(0,5);
  return s;
}

export function autobumpOnWave(state, newWaveIndex){
  const s = JSON.parse(JSON.stringify(state||{}));
  const lastRestock = s.shop?.lastWaveRestock|0;
  if (newWaveIndex - lastRestock >= 20){
    const after = generateShop(s);
    after.shop.lastWaveRestock = newWaveIndex;
    return after;
  }
  return s;
}
