"use strict";

class Inventory {
	constructor() {
		this.tiles = [];
		this.gui = new Ui();
		this.page = 0;
		this.lastSize = {"x": NaN, "y": NaN};
		this.tileCounter = 0;
		this.blockCreator = {"open": false};

		this.createTile = this.gui.addElement(new Button(vpSize.x-camera.zoom*2, camera.zoom*0.5, camera.zoom*1.5, camera.zoom*0.375, document.getElementById("buttonImage"), ()=>{
			let overlay = document.createElement("div");
			let blockCreator = document.createElement("canvas");
			let closeButton = document.createElement("button");
			overlay.classList.add("overlay");
			blockCreator.id = "blockCreatorCanvas";
			closeButton.id = "blockCreatorClose";
			closeButton.innerHTML = "&#x2612;";
			closeButton.addEventListener("click", e=>{
				clearInterval(this.blockCreator.loop);
				this.blockCreator.overlayDiv.outerHTML = "";
				this.blockCreator.open = false;
			});
			overlay.appendChild(blockCreator);
			overlay.appendChild(closeButton);
			document.body.insertBefore(overlay, document.getElementById("mainCanvas"));
			document.getElementById("inputOverlayButton").blur();
			this.blockCreator.overlayDiv = overlay;
			this.blockCreator.open = true;
			this.blockCreator.element = blockCreator;
			this.blockCreator.context = blockCreator.getContext("2d");
			this.blockCreator.loop = setInterval(()=>{this.renderBlockCreator();}, 16);
		}));
	}
	renderBlockCreator() {
		this.blockCreator.width = this.blockCreator.element.offsetWidth;
		this.blockCreator.height = this.blockCreator.element.offsetHeight;
		this.blockCreator.element.width = this.blockCreator.width;
		this.blockCreator.element.height = this.blockCreator.height;
		this.blockCreator.context.fillStyle = "#c9d4db";
		this.blockCreator.context.fillRect(0, 0, this.blockCreator.width, this.blockCreator.height);
	}
	addTile(ruid) {
		const item = {"ruid": ruid, "originY": (this.tileCounter+1)*camera.zoom*1.25, "id": this.tileCounter};
		this.tileCounter++;
		world.loadTile(ruid, tile => {
			item.dragable = new Dragable(vpSize.x-camera.zoom*1.75, 0, 64, 64, tile.imageTag, function(posX, posY) {
				this.x = vpSize.x-camera.zoom*1.75;
				this.y = item.originY;

				const pos = camera.toWorld(posX, posY);
				socket.emit("WorldSetTile", Math.round(pos.x), Math.round(pos.y), ruid);
			});
			this.gui.addElement(item.dragable);
			this.tiles[item.id] = item;
			this.lastSize = {"x": NaN, "y": NaN};
		});
	}
	draw() {
		if (this.lastSize.x !== vpSize.x || this.lastSize.y !== vpSize.y) {
			for (const item of Object.values(this.tiles)) {
				item.dragable.x = vpSize.x-camera.zoom*1.75;
				item.dragable.y = item.originY;
			}
			this.lastSize.x = vpSize.x;
			this.lastSize.y = vpSize.y;

			this.gui.elements[0].x = vpSize.x-camera.zoom*2;
		}

		canvasContext.fillStyle = "rgba(0.04, 0.02, 0, 0.4)";
		canvasContext.fillRect(vpSize.x-camera.zoom*2.25, camera.zoom*0.25, camera.zoom*2, vpSize.y-camera.zoom*0.5);
		this.gui.draw();
	}
}
