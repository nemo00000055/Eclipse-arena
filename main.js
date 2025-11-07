
/**
 * main.js (v0.1.1)
 * Entry point that wires UI and bootstraps state.
 */
import { initUIBindings } from './ui/events.js';
import { writeRosterToDOM, writeInventoryToDOM } from './ui/panels.js';
import { initState, getState } from './ui/state.js';

(function bootstrap(){
  document.addEventListener('DOMContentLoaded', () => {
    initState();
    writeRosterToDOM(getState());
    writeInventoryToDOM(getState());
    initUIBindings();
  });
})();
