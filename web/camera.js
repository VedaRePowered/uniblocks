"use strict";

class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.zoom = 0;
	}
	toScreen(p) {
		return {"x": (p.x-this.x)*this.zoom+vpSize.x/2, "y": (p.y-this.y)*this.zoom+vpSize.y/2};
	}
	toWorld(p) {
		return {"x": (p.x-vpSize.x/2)/this.zoom+this.x, "y": (p.y-vpSize.y/2)/this.zoom+this.y};
	}
	get pos() {
		return {"x": p.x, "y": p.y};
	}
	get zoom() {
		return this.zoom;
	}
	set pos(p) {
		this.x = p.x;
		this.y = p.y;
	}
	set zoom(z) {
		this.zoom = z;
	}
}
