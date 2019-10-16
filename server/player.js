"use strict";
/* jshint node: true */
module.exports = class Player {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.colour = "#" + Math.floor(Math.random()*Math.pow(2, 24)).toString(16).padStart(6, "0");
	}
	get pos() {
		return {"x": this.x, "y": this.y};
	}
	set pos(p) {
		this.x = p.x;
		this.y = p.y;
	}
};
