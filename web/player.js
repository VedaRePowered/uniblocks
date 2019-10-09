"use strict";

class Player {
	constructor(id) {
		this.id = id;
		this.x = 0; this.y = 0;
		this.vx = 0; this.vy = 0;
		this.colour = "#" + Math.floor(Math.random()*Math.pow(2, 24)).toString(16).padStart(6, "0");
	}
	input(held) {
		if (held[37]) {
			this.x -= 0.08;
		}
		if (held[39]) {
			this.x += 0.08;
		}
		if (held[40]) {
			this.y -= 0.08;
		}
		if (held[38]) {
			this.y += 0.08;
		}
	}
	update() {
		camera.scroll(this.x, this.y, 0.1);
	}
	draw() {
		canvasContext.fillStyle = this.colour;
		const screenPos = camera.toScreen(this.x, this.y);
		canvasContext.fillRect(screenPos.x-camera.zoom/2, screenPos.y-camera.zoom/2, camera.zoom, camera.zoom);
	}
}
