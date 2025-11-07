
/**
 * ui/state.js
 * Simple front-end app state holder that uses the systems façade save/load.
 */
import { load, save, setSeed } from '../systems/index.js';

let __state = null;

export function initState(){
  // load from storage or get migrated default
  __state = load();
  // seed RNG once for deterministic session feel
  if (__state?.seed) setSeed(__state.seed);
  return __state;
}

export function getState(){ return __state; }

export function setState(next){
  __state = next;
  return __state;
}

export function persist(){
  try { return save(__state); } catch(e){ return { ok:false, error:String(e?.message||e) }; }
}
