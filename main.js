/**
 * main.js
 * Entry point for v0.1 baseline.
 * Wires UI events to backend systems and handles basic render updates.
 */

import { initUIBindings } from './ui/events.js';
import { getRoster } from './systems/roster.js';
import { writeRosterToDOM } from './ui/panels.js';

// bootstrap app state
(function bootstrap() {
  // At load, render whatever roster we have (likely empty first run)
  writeRosterToDOM(getRoster());

  // Setup button listeners, escape handling, etc.
  initUIBindings();
})();
