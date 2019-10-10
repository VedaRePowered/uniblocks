"use strict";

class Input {
	constructor() {
		this.held = new Array(256);
		this.last = new Array(256);
		this.down = new Array(256);
		this.up = new Array(256);
		for (let i = 0; i < 256; i++) {
			this.held[i] = false;
			this.last[i] = false;
			this.down[i] = false;
			this.up[i] = false;
		}
		window.addEventListener("keydown", event => {
			if (event.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}

			this.held[event.which] = true;

			// Cancel the default action to avoid it being handled twice
			event.preventDefault();
		}, true);
		window.addEventListener("keyup", event => {
			if (event.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}

			this.held[event.which] = false;

			// Cancel the default action to avoid it being handled twice
			event.preventDefault();
		}, true);
	}
	update() {
		for (const id in this.held) {
			this.down[id] = this.held[id] && !this.last[id];
			this.up[id] = this.last && !this.held[id];
			this.last[id] = this.held[id];
		}
	}
}
