class Tile {
	constructor(tileId, name, graphic, code) {
		this.imageTag = new Image(16, 16);
		this.imageTag.src = graphic;
		this.tileId = tileId;
		this.display = {"name": name};
		this.code = code;
	}
	draw(x, y) {
		const screenPos = camera.toScreen(x, y);
		canvasContext.drawImage(this.imageTag, screenPos.x-camera.zoom/2, screenPos.y-camera.zoom/2, camera.zoom, camera.zoom);
	}
}
