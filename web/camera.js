"use strict";

class Camera {
	constructor(zoom) {
		this.x = 0;
		this.y = 0;
		this.zoom = zoom;
	}
	toScreen(x, y) {
		return {"x": (x-this.x)*this.zoom+vpSize.x/2, "y": vpSize.y/2-(y-this.y)*this.zoom};
	}
	toWorld(x, y) {
		return {"x": (x-vpSize.x/2)/this.zoom+this.x, "y": (vpSize.y/2*3-y)/this.zoom+this.y};
	}
	scroll(tx, ty, speed) {
		this.x = (this.x+tx*speed)/(1+speed);
		this.y = (this.y+ty*speed)/(1+speed);
	}
}
