"use strict";

const xAirDrag = 0.95;
const xGroundDrag = 0.9;
const yAirDrag = 0.975;
const yWallDrag = 0.9;
const jumpVelocity = 14;
const airAcceleration = 0.3;
const groundAcceleration = 0.6;
const jumpGravity = 0.2;
const gravity = 0.75;

const wallJumpTime = 0.2;
const endJumpSpeed = 7;

class Player {
	constructor(id) {
		this.id = id;
		this.collider = new Collision(1, 1);
		this.onGround = false;
		this.onRightWall = false;
		this.onLeftWall = false;
		this.jumping = false;
		this.leftWallTimer = 0;
		this.rightWallTimer = 0;
		this.inventory = new Inventory();

		this.inventory.addTile("65a5fce8876d8e5bad5da510edb9a30f");

		this.colour = "#" + Math.floor(Math.random()*Math.pow(2, 24)).toString(16).padStart(6, "0");
	}
	update(inp) {
		this.collider.vy -= this.jumping ? jumpGravity : gravity;
		this.leftWallTimer -= 1/60;
		this.rightWallTimer -= 1/60;
		if (inp.held[37]) { // left
			this.collider.vx -= this.onGround ? groundAcceleration : airAcceleration;
		}
		if (inp.held[39]) { // right
			this.collider.vx += this.onGround ? groundAcceleration : airAcceleration;
		}
		if (inp.held[40]) { /* down */ }
		if (inp.held[38]) { /* up */ }
		if (this.onGround && inp.down[32]) { // space
			this.collider.vy = jumpVelocity;
			this.jumping = true;
		}
		if (this.leftWallTimer > 0 && ((inp.held[39] && inp.down[32]) || (inp.held[32] && inp.down[39]))) { // right+space
			this.collider.vy = jumpVelocity/4*3;

			this.collider.vx = jumpVelocity/3;
			this.leftWallTimer = 0;
			this.jumping = true;
		}
		if (this.rightWallTimer > 0 && ((inp.held[37] && inp.down[32]) || (inp.held[32] && inp.down[37]))) { // left+space
			this.collider.vy = jumpVelocity/4*3;
			this.collider.vx = -jumpVelocity/3;
			this.rightWallTimer = 0;
			this.jumping = true;
		}
		if (this.collider.vy < endJumpSpeed || !inp.held[32]) {
			this.jumping = false;
		}

		let ovx = this.collider.vx, ovy = this.collider.vy;
		let [xCollider, yCollider] = this.collider.slide(1/60);

		this.onLeftWall = ovx < 0 && this.collider.vx === 0;
		this.onRightWall = ovx > 0 && this.collider.vx === 0;
		this.onGround = ovy < 0 && this.collider.vy === 0;

		if (this.onLeftWall) {
			this.leftWallTimer = wallJumpTime;
		}
		if (this.onRightWall) {
			this.rightWallTimer = wallJumpTime;
		}

		let xdm = this.onGround ? xGroundDrag : xAirDrag;
		let ydm = this.onLeftWall || this.onRightWall ? yWallDrag : yAirDrag;

		let txv = 0*(1/xdm-1); // to handle object-on-object drag in future
		let tyv = 0*(1/ydm-1);

		this.collider.vx = (this.collider.vx + txv) * xdm;
		this.collider.vy = (this.collider.vy + tyv) * ydm;

		camera.scroll(this.collider.x, this.collider.y, 0.1);
	}
	draw() {
		canvasContext.fillStyle = this.colour;
		const screenPos = camera.toScreen(this.collider.x, this.collider.y);
		canvasContext.fillRect(screenPos.x-camera.zoom/2, screenPos.y-camera.zoom/2, camera.zoom, camera.zoom);
		this.inventory.draw();
	}
}
