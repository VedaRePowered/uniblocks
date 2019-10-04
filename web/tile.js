class Tile {
	constructor(tileId, name, graphic, code) {
		this.imageTag = new Image(16, 16);
		this.imageTag.src = graphic;
		this.tileId = tileId;
		this.display = {"name": name};
		this.code = code;
	}
	draw(x, y) {
		canvasContext.drawImage(this.imageTag, x, y)
	}
}