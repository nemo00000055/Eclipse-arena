import { getRoster,setRoster } from './roster.js';
export const SAVE_KEY='eclipseSummonersSave'; export let SAVE_VERSION=1;
export function saveGameState(){ const state={version:SAVE_VERSION, roster:getRoster()}; try{ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); return true; }catch(e){ console.error('saveGameState:',e); return false; } }
export function loadGameState(){ try{ const raw=localStorage.getItem(SAVE_KEY); if(!raw) return false; const parsed=JSON.parse(raw); if(Array.isArray(parsed.roster)) setRoster(parsed.roster); else setRoster([]); return true; }catch(e){ console.error('loadGameState:',e); return false; } }
export function migrate(state){ return state; }