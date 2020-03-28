"use strict";

function newDragableTile(ruid, originX, originY, callback) {
	world.loadTile(ruid, tile => {
		const dragable = new Dragable(vpSize.x-camera.zoom*1.75, 0, 64, 64, tile.imageTag, function(posX, posY) {
			this.x = originX;
			this.y = originY;

			const pos = camera.toWorld(posX, posY);
			socket.emit("WorldSetTile", Math.round(pos.x), Math.round(pos.y), ruid);
		});
		callback(dragable);
	});
}
