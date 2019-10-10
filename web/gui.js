class Ui {
	constructor() {
		this.elements = [];
	}
	addElement(element) {
		element.parent = this;
		element.id = this.elements.length;
		this.elements.push(element);
		return element.id;
	}
	draw() {
		for (const element of this.elements) {
			element.draw();
		}
	}
}

class Button {
	constructor(x, y, w, h, icon, callback) {
		this.imageTag = new Image();
		this.imageTag.src = icon;
		this.x = x; this.y = y;
		this.width = w; this.height = h;
		this.callback = callback;
		this.pressed = false;
		this.hovered = false
		this.parent;
		this.id;

		document.addEventListener("mousedown", e => {
			if (e.clientX >= this.x && e.clientY >= this.y && e.clientX <= this.x+this.width && e.clientY <= this.y+this.height) {
				this.pressed = true;
			}
		});
		document.addEventListener("mousemove", e => {
			this.hovered = e.clientX >= this.x && e.clientY >= this.y && e.clientX <= this.x+this.width && e.clientY <= this.y+this.height;
		});
		document.addEventListener("mouseup", e => {
			if (this.pressed && e.clientX >= this.x && e.clientY >= this.y && e.clientX <= this.x+this.width && e.clientY <= this.y+this.height) {
				this.callback();
			}
			this.pressed = false;
		});
	}
	draw() {
		canvasContext.drawImage(this.imageTag, this.x, this.y, this.width, this.height);
	}
}

class Dragable {
	constructor(x, y, w, h, icon, callback) {
		this.imageTag = new Image();
		this.imageTag.src = icon;
		this.x = x; this.y = y;
		this.width = w; this.height = h;
		this.callback = callback;
		this.draging = false;
		this.offsetX = 0;
		this.offsetY = 0;
		this.parent;
		this.id;

		document.addEventListener("mousedown", e => {
			if (e.clientX >= this.x && e.clientY >= this.y && e.clientX <= this.x+this.width && e.clientY <= this.y+this.height) {
				this.offsetX = this.x - e.clientX;
				this.offsetY = this.y - e.clientY;
				this.draging = true;
			}
		});
		document.addEventListener("mousemove", e => {
			if (this.draging) {
				this.x = e.clientX + this.offsetX;
				this.y = e.clientY + this.offsetY;
			}
		});
		document.addEventListener("mouseup", e => {
			if (this.draging) {
				this.callback(this.x, this.y);
			}
			this.draging = false;
		});
	}
	draw() {
		canvasContext.drawImage(this.imageTag, this.x, this.y, this.width, this.height);
	}
}
