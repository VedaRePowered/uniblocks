"use strict";

const xAirDrag = 0.95;
const xGroundDrag = 0.9;
const yAirDrag = 0.975;
const yWallDrag = 0.85;
const jumpVelocity = 18;
const airAcceleration = 0.7;
const groundAcceleration = 0.17;
const jumpGravity = 0.6;
const gravity = 0.01//1.25;

class Player {
	constructor(id) {
		this.id = id;
		this.collider = new Collision(1, 1);
		this.onGround = false;
		this.onRightWall = false;
		this.onLeftWall = false;
		this.jumping = false;

		this.colour = "#" + Math.floor(Math.random()*Math.pow(2, 24)).toString(16).padStart(6, "0");
	}
	update(held) {
		this.collider.vy -= this.jumping ? jumpGravity : gravity;
		if (held[37]) { // left
			this.collider.vx -= this.onGround ? groundAcceleration : airAcceleration;
		}
		if (held[39]) { // right
			this.collider.vx += this.onGround ? groundAcceleration : airAcceleration;
		}
		if (held[40]) { /* down */ }
		if (this.onGround && held[38]) { // up
			this.collider.vy = jumpVelocity;
			this.jumping = true;
		}
		if (this.collider.vy >= 0 || !held[38]) {
			this.jumping = false;
		}

		let ovx = this.collider.vx, ovy = this.collider.vy;
		let [xCollider, yCollider] = this.collider.slide(1/60)

		camera.scroll(this.collider.x, this.collider.y, 0.1);
	}
	draw() {
		canvasContext.fillStyle = this.colour;
		const screenPos = camera.toScreen(this.collider.x, this.collider.y);
		canvasContext.fillRect(screenPos.x-camera.zoom/2, screenPos.y-camera.zoom/2, camera.zoom, camera.zoom);
	}
}
