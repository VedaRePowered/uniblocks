"use strict";

function newDragableTile(ruid, originX, originY, callback) {
	world.loadTile(ruid, tile => {
		const dragable = new Dragable(originX, originY, 64, 64, tile.imageTag, function(posX, posY) {
			const resetX = this.originX < 0 ? vpSize.x + originX : originX;
			const resetY = this.originY < 0 ? vpSize.y + originY : originY;
			this.x = resetX;
			this.y = resetY;

			const pos = camera.toWorld(posX, posY);
			socket.emit("WorldSetTile", Math.round(pos.x), Math.round(pos.y), ruid);
		});
		callback(dragable);
	});
}
