"use strict";

let canvasContext;
let socket;
let tile;
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");
	socket = io("http://localhost:5000");
	setTimeout(function() {
		socket.emit("WorldGetTile", "0f15dd4e-1076-4677-9011-82dedb4225f7", (success, data) => {
			if (!success) {
				console.log("Error:" + toString(data));
			} else {
				tile = new Tile("0f15dd4e-1076-4677-9011-82dedb4225f7", data.name, data.graphic, data.code);
			}
			})
	}, 3000);
}

function draw() {
	console.log("Frame");
	tile.draw(10, 10);
}
