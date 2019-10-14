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
	}
	render() {
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;
		this.element.width = this.width;
		this.element.height = this.height;
		this.context.fillStyle = "#c9d4db";
		this.context.fillRect(0, 0, this.width, this.height);

		for (let y = 0; y < 16; y++) {
			for (let x = 0; x < 16; x++) {
				
			}
		}
	}
}