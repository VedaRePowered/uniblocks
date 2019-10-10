"use strict";

function bufToRuid(buf, start) {
	let ruid = "";
	for (let i = 0; i < 16; i++) {
		ruid += ("0"+buf[start+i].toString(16)).slice(-2);
	}
	return ruid;
}
function ruidToBuf(ruid, buf, start) {
	for (let i = 0; i < 16; i++) {
		buf[start+i] = parseInt(ruid.substr(i*2, 2), 16);
	}
}
class World {
	constructor() {
		this.regions = {};
		this.tiles = {};
		this.loadedPositionMin = {"x": NaN, "y": NaN};
		this.defaultTile = new Tile("00000000000000000000000000000000", "Unknown", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4woIEBISRGtRKQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAJElEQVQoz2NkwAH+M/zHKs7EQCIY1UAMYMQV3owMjKOhRD8NACTzBB3yj0euAAAAAElFTkSuQmCC", "");

		for (let i = -3; i <= 3; i++) {
			socket.emit("WorldSetTile", i, -3, "65a5fce8876d8e5bad5da510edb9a3f");
			socket.emit("WorldSetTile", 3, i, "65a5fce8876d8e5bad5da510edb9a3f");
		}
	}
	fetch(rx, ry) {
		socket.emit("WorldGetRegion", rx, ry, reg=>{
			if(typeof(this.regions[rx]) === "undefined") {
				this.regions[rx] = {};
			}
			this.regions[rx][ry] = new Uint8Array(reg);
			console.log("loadedregion: ", rx, "/", ry);

			let toLoad = {};
			for (let i = 0; i < 65536*16; i += 16) {
				const ruid = bufToRuid(this.regions[rx][ry], i);
				if (ruid !== "00000000000000000000000000000000" && typeof(this.tiles[ruid]) === "undefined" && typeof(toLoad[ruid]) === "undefined") {
					toLoad[ruid] = true;
					console.log("loadtile@", i);
				}
			}
			for (const ruid of Object.keys(toLoad)) {
				socket.emit("WorldGetTile", ruid, (success, data)=>{
					if (success) {
						this.tiles[ruid] = new Tile(ruid, data.name, data.graphic, data.code);
					} else {
						console.error("Error getting tile #" + ruid);
						this.tiles[ruid] = this.defaultTile;
					}
				});
			}
		});
	}
	update() {
		// The four regions that are closest to the player should always be loaded
		const playerRegionMin = {"x": Math.floor((player.collider.x-128)/256),"y": Math.floor((player.collider.y-128)/256)};
		let overlap = {}; // Overlap of regions, from the perspective of the NEW region (false=reload, true=keep)
		overlap.ll =
			(playerRegionMin.x === this.loadedPositionMin.x || playerRegionMin.x === this.loadedPositionMin.x+1) &&
			(playerRegionMin.y === this.loadedPositionMin.y || playerRegionMin.y === this.loadedPositionMin.y+1);
		overlap.lh =
			(playerRegionMin.x === this.loadedPositionMin.x || playerRegionMin.x === this.loadedPositionMin.x+1) &&
			(playerRegionMin.y+1 === this.loadedPositionMin.y || playerRegionMin.y+1 === this.loadedPositionMin.y+1);
		overlap.hl =
			(playerRegionMin.x+1 === this.loadedPositionMin.x || playerRegionMin.x+1 === this.loadedPositionMin.x+1) &&
			(playerRegionMin.y === this.loadedPositionMin.y || playerRegionMin.y === this.loadedPositionMin.y+1);
		overlap.hh =
			(playerRegionMin.x+1 === this.loadedPositionMin.x || playerRegionMin.x+1 === this.loadedPositionMin.x+1) &&
			(playerRegionMin.y+1 === this.loadedPositionMin.y || playerRegionMin.y+1 === this.loadedPositionMin.y+1);
		if (!overlap.ll) {
			this.fetch(playerRegionMin.x, playerRegionMin.y);
		}
		if (!overlap.lh) {
			this.fetch(playerRegionMin.x, playerRegionMin.y+1);
		}
		if (!overlap.hl) {
			this.fetch(playerRegionMin.x+1, playerRegionMin.y);
		}
		if (!overlap.hh) {
			this.fetch(playerRegionMin.x+1, playerRegionMin.y+1);
		}
		this.loadedPositionMin = playerRegionMin;
	}
	draw() {
		let blocksSize = {"x": Math.ceil(vpSize.x/camera.zoom/2), "y": Math.ceil(vpSize.y/camera.zoom/2)};
		for (let x = Math.floor(camera.x)-blocksSize.x; x <= Math.floor(camera.x)+blocksSize.x; x++) {
			for (let y = Math.floor(camera.y)-blocksSize.y; y <= Math.floor(camera.y)+blocksSize.y; y++) {
				const t = this.getTile(x, y);
				if (t !== 0 && typeof(this.tiles[t]) !== "undefined") {
					this.tiles[t].draw(x, y);
				}
			}
		}
	}
	getTile(x, y) {
		if (typeof(this.regions[Math.floor(x/256)]) !== "undefined" && typeof(this.regions[Math.floor(x/256)][Math.floor(y/256)]) !== "undefined") {
			return bufToRuid(this.regions[Math.floor(x/256)][Math.floor(y/256)], ((x&255)+((y&255)*256))*16);
		} else {
			return "00000000000000000000000000000000";
		}
	}
	setTile(x, y, tileId) {
		if (typeof(this.regions[Math.floor(x/256)]) !== "undefined" && typeof(this.regions[Math.floor(x/256)][Math.floor(y/256)]) !== "undefined") {
			ruidToBuf(tileId, this.regions[Math.floor(x/256)][Math.floor(y/256)], ((x&255)+((y&255)*256))*16);
		}
	}
}
