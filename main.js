import { initUIBindings } from './ui/events.js';
import { getRoster } from './systems/roster.js';
import { writeRosterToDOM } from './ui/panels.js';
(function(){ writeRosterToDOM(getRoster()); initUIBindings(); })();