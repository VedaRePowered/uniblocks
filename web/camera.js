"use strict";

class Camera {
	constructor(zoom) {
		this.x = 0;
		this.y = 0;
		this.zoom = zoom;
	}
	toScreen(x, y) {
		return {"x": (x-this.x)*this.zoom+vpSize.x/2, "y": (y-this.y)*this.zoom+vpSize.y/2};
	}
	toWorld(x, y) {
		return {"x": (x-vpSize.x/2)/this.zoom+this.x, "y": (y-vpSize.y/2)/this.zoom+this.y};
	}
	get pos() {
		return {"x": p.x, "y": p.y};
	}
	set pos(p) {
		this.x = p.x;
		this.y = p.y;
	}
}
