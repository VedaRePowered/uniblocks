"use strict";
class BlockCreator {
	constructor () {
		this.open = false;
	}
	openMenu() {
		let overlay = document.createElement("div");
		let blockCreator = document.createElement("canvas");
		let closeButton = document.createElement("button");
		overlay.classList.add("overlay");
		blockCreator.id = "blockCreatorCanvas";
		closeButton.id = "blockCreatorClose";
		closeButton.innerHTML = "&#x2612;";
		closeButton.addEventListener("click", e=>{
			clearInterval(this.loop);
			this.overlayDiv.outerHTML = "";
			document.getElementById("inputOverlayButton").focus();
			document.removeEventListener("mousedown", this.events.down);
			document.removeEventListener("mousemove", this.events.move);
			document.removeEventListener("mouseup", this.events.up);
			this.open = false;
		});
		overlay.appendChild(blockCreator);
		overlay.appendChild(closeButton);
		document.body.insertBefore(overlay, document.getElementById("mainCanvas"));
		document.getElementById("inputOverlayButton").blur();
		this.overlayDiv = overlay;
		this.open = true;
		this.element = blockCreator;
		this.context = blockCreator.getContext("2d");
		this.loop = setInterval(()=>{this.render();}, 16);

		const style = window.getComputedStyle(blockCreator);
		this.originX = parseInt(style.marginLeft, 10);
		this.originY = parseInt(style.marginTop, 10);

		this.pencil = {"down": false, "mode": "freehand", "colour": 1};
		this.image = {"grid": new Uint8Array(256), "palette": new Uint32Array(16)};
		this.events = {
			"down": e => {this.penDown(e);},
			"move": e => {this.penMove(e);},
			"up": e => {this.penUp(e);},
		};
		document.addEventListener("mousedown", this.events.down);
		document.addEventListener("mousemove", this.events.move);
		document.addEventListener("mouseup", this.events.up);

		this.image.palette[0] = 0x00000000;
		this.image.palette[1] = 0x000000ff;
		this.image.palette[2] = 0xffffffff;
		this.image.palette[3] = 0xff0000ff;
		this.image.palette[4] = 0xffff00ff;
		this.image.palette[5] = 0x00ff00ff;
		this.image.palette[6] = 0x0000ffff;
		this.image.palette[7] = 0xff007fff;
	}
	penDown(event) {
		this.pencil.down = true;
		const pix = this.pixelToGrid(event.clientX-this.originX, event.clientY-this.originY);
		if (pix.x >= 0 && pix.x < 16 && pix.y >= 16.5 && pix.y < 17.5) {
			this.pencil.colour = Math.floor(pix.x);
		}
		this.penMove(event);
	}
	penMove(event) {
		if (this.pencil.down) {
			const pix = this.pixelToGrid(event.clientX-this.originX, event.clientY-this.originY);
			if (pix.x >= 0 && pix.y >= 0 && pix.x < 16 && pix.y < 16) {
				pix.x = Math.floor(pix.x);
				pix.y = Math.floor(pix.y);
				this.image.grid[pix.x+pix.y*16] = this.pencil.colour;
			}
			if (pix.x >= 0 && pix.y >= 18 && pix.x < 4 && pix.y < 22) {
				const colour = this.numberToColour(this.image.palette[this.pencil.colour]);
				switch (Math.floor(pix.y)) {
				case 18:
					colour.r = pix.x/4*255;
					break;
				case 19:
					colour.g = pix.x/4*255;
					break;
				case 20:
					colour.b = pix.x/4*255;
					break;
				case 21:
					colour.a = pix.x/4*255;
					break;
				}
				this.image.palette[this.pencil.colour] = this.colourToNumber(colour.r, colour.g, colour.b, colour.a);
			}
		}
	}
	penUp(event) {
		this.pencil.down = false;
	}
	gridToPixel(x, y) {
		return {"x": x*this.gridSize()+this.width/20, "y": y*this.gridSize()+this.width/20};
	}
	gridSize() {
		return this.width/16*0.9;
	}
	pixelToGrid(x, y) {
		return {"x": (x-this.width/20)/this.gridSize(), "y": (y-this.width/20)/this.gridSize()};
	}
	numberToColour(n) {
		return {
			"r": (this.image.palette[this.pencil.colour] & 0xff000000) >>> 24,
			"g": (this.image.palette[this.pencil.colour] & 0x00ff0000) >>> 16,
			"b": (this.image.palette[this.pencil.colour] & 0x0000ff00) >>> 8,
			"a": this.image.palette[this.pencil.colour] & 0x000000ff,
		};
	}
	colourToNumber(r, g, b, a) {
		return r<<24 | g<<16 | b<<8 | a;
	}
	render() {
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;
		this.element.width = this.width;
		this.element.height = this.height;
		this.context.imageSmoothingEnabled = false;
		const style = window.getComputedStyle(this.element);
		this.originX = parseInt(style.marginLeft, 10);
		this.originY = parseInt(style.marginTop, 10);
		this.context.fillStyle = "#c9d4db";
		this.context.fillRect(0, 0, this.width, this.height);

		const corner = this.gridToPixel(0, 0);
		this.context.drawImage(document.getElementById("editbgImage"), corner.x-this.gridSize()/2, corner.y-this.gridSize()/2, this.gridSize()*17, this.gridSize()*23);
		const size = this.gridSize();
		for (let y = 0; y < 16; y++) {
			for (let x = 0; x < 16; x++) {
				const pos = this.gridToPixel(x, y);
				this.context.fillStyle = "#"+("0000000" + this.image.palette[this.image.grid[x+y*16]].toString(16)).slice(-8);
				this.context.fillRect(pos.x, pos.y, size, size);
			}
		}

		for (let i = 0; i < 16; i++) {
			const pos = this.gridToPixel(i, 16.5);
			this.context.fillStyle = "#"+("0000000" + this.image.palette[i].toString(16)).slice(-8);
			this.context.fillRect(pos.x, pos.y, size, size);
		}
		this.context.strokeStyle = "#e0e0efef";
		this.context.lineWidth = this.gridSize()/4;
		const pos = this.gridToPixel(this.pencil.colour, 16.5);
		this.context.strokeRect(pos.x, pos.y, size, size);

		const sliderPos = this.gridToPixel(0, 18);
		const colour = this.numberToColour(this.pencil.colour);
		const redSlider = this.context.createLinearGradient(0, 0, this.gridSize()*4, 0);
		redSlider.addColorStop(0, "rgba(0," + colour.g.toString() + "," + colour.b.toString() + "," + colour.a.toString());
		redSlider.addColorStop(1, "rgba(255," + colour.g.toString() + "," + colour.b.toString() + "," + colour.a.toString());
		const greenSlider = this.context.createLinearGradient(0, 0, this.gridSize()*4, 0);
		greenSlider.addColorStop(0, "rgba(" + colour.r.toString() + ",0," + colour.b.toString() + "," + colour.a.toString());
		greenSlider.addColorStop(1, "rgba(" + colour.r.toString() + ",255," + colour.b.toString() + "," + colour.a.toString());
		const blueSlider = this.context.createLinearGradient(0, 0, this.gridSize()*4, 0);
		blueSlider.addColorStop(0, "rgba(" + colour.r.toString() + "," + colour.g.toString() + ",0," + colour.a.toString());
		blueSlider.addColorStop(1, "rgba(" + colour.r.toString() + "," + colour.g.toString() + ",255," + colour.a.toString());
		const alphaSlider = this.context.createLinearGradient(0, 0, this.gridSize()*4, 0);
		alphaSlider.addColorStop(0, "rgba(" + colour.r.toString() + "," + colour.g.toString() + "," + colour.b.toString() + ",0");
		alphaSlider.addColorStop(1, "rgba(" + colour.r.toString() + "," + colour.g.toString() + "," + colour.b.toString() + ",255");
		this.context.fillStyle = redSlider;
		this.context.fillRect(sliderPos.x, sliderPos.y, this.gridSize()*4, this.gridSize());
		this.context.moveTo(sliderPos.x+colour.r/255*this.gridSize()*4, sliderPos.y);
		this.context.lineTo(sliderPos.x+colour.r/255*this.gridSize()*4, sliderPos.y+this.gridSize());
		this.context.fillStyle = greenSlider;
		this.context.fillRect(sliderPos.x, sliderPos.y+this.gridSize(), this.gridSize()*4, this.gridSize());
		this.context.moveTo(sliderPos.x+colour.g/255*this.gridSize()*4, sliderPos.y+this.gridSize());
		this.context.lineTo(sliderPos.x+colour.g/255*this.gridSize()*4, sliderPos.y+this.gridSize()*2);
		this.context.fillStyle = blueSlider;
		this.context.fillRect(sliderPos.x, sliderPos.y+this.gridSize()*2, this.gridSize()*4, this.gridSize());
		this.context.moveTo(sliderPos.x+colour.b/255*this.gridSize()*4, sliderPos.y+this.gridSize()*2);
		this.context.lineTo(sliderPos.x+colour.b/255*this.gridSize()*4, sliderPos.y+this.gridSize()*3);
		this.context.fillStyle = alphaSlider;
		this.context.fillRect(sliderPos.x, sliderPos.y+this.gridSize()*3, this.gridSize()*4, this.gridSize());
		this.context.moveTo(sliderPos.x+colour.a/255*this.gridSize()*4, sliderPos.y+this.gridSize()*3);
		this.context.lineTo(sliderPos.x+colour.a/255*this.gridSize()*4, sliderPos.y+this.gridSize()*4);
		this.context.stroke();
	}
}
