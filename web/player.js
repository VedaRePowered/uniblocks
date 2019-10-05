class Player {
	constructor(id) {
		this.id = id;
		this.x = 0; this.y = 0;
		this.vx = 0; this.vy = 0;
		this.colour = "#" + Math.floor(Math.random()*2**24).toString(16).padStart(6, "0");;
	}
	draw() {
		canvasContext.fillStyle = this.colour;
		const screenPos = camera.toScreen(this.x, this.y);
		canvasContext.fillRect(screenPos.x-camera.zoom/2, screenPos.y-camera.zoom/2, camera.zoom, camera.zoom);
	}
}
