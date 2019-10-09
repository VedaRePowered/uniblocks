"use strict";

class Input {
	constructor() {
		this.held = new Array(256);
		for (let i = 0; i < 256; i++) {
			this.held[i] = false;
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
}
