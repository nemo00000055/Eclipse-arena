import { randInt } from './rng.js';
let playerRoster=[];
const pool=[
 {name:'Lyra Stormborne',element:'Storm',baseHP:120,baseATK:30},
 {name:'Draegon of Embers',element:'Fire',baseHP:150,baseATK:40},
 {name:'Kairon Whisperleaf',element:'Wind',baseHP:100,baseATK:35},
 {name:'Selene Umbra',element:'Dark',baseHP:110,baseATK:28},
 {name:'Eldros Titanheart',element:'Earth',baseHP:180,baseATK:20},
];
export function getRoster(){ return playerRoster; }
export function setRoster(r){ playerRoster=Array.isArray(r)?r:[]; }
export function summonRandomUnit(){
 const i=randInt(0,pool.length-1), b=pool[i];
 const u={ name:b.name, element:b.element, level:1, hp:b.baseHP, atk:b.baseATK };
 playerRoster.push(u); return u;
}