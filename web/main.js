"use strict";

let canvasContext;
let socket;
let camera;
let player;
let world;
let input;
let vpSize = {"x": 0, "y": 0};
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");

	socket = io(serverAddress);
	socket.on("connect", (playerId) => {
		camera = new Camera(64);
		input = new Input();
		world = new World();
		player = new Player(playerId);
		world.update();

		const loading = document.getElementById("delete");
		if (loading) {
			loading.outerHTML = "";
		}
		setInterval(draw, 16);
	});
	socket.on("WorldSetTile", (x, y, tileId) => {
		world.setTile(x, y, tileId);
	});
	document.getElementById("inputOverlayButton").focus();
}

function draw() {
	vpSize = {"x": innerWidth, "y": innerHeight};
	document.getElementById("mainCanvas").width = vpSize.x;
	document.getElementById("mainCanvas").height = vpSize.y;
	canvasContext.imageSmoothingEnabled = false;

	input.update();
	world.update();
	player.update(input);

	world.draw();
	player.draw();
}

window.onload = init;