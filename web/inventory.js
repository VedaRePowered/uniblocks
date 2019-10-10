"use strict";

class Inventory {
	constructor() {
		this.tiles = [];
		this.gui = new Ui();
	}
	addTile(ruid) {
		this.tiles.push(ruid);
		world.loadTile(ruid, tile=>{
			this.gui.addElement(new Dragable(vpSize.x-64-4, 4, 64, 64, tile.imageTag, function(posX, posY) {
				this.x = vpSize.x-64-4;
				this.y = 4;

				const pos = camera.toWorld(posX, posY);
				socket.emit("WorldSetTile", Math.round(pos.x), Math.round(pos.y), ruid);
			}));
		});
	}
	draw() {
		this.gui.draw();
	}
}
