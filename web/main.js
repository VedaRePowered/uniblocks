"use strict";

let canvasContext;
let socket;
let camera;
let player;
let world;
let input;
let vpSize;
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");
	canvasContext.imageSmoothingEnabled = false;

	socket = io(serverAddress);
	socket.on("connect", (playerId) => {
		camera = new Camera(64);
		input = new Input();
		player = new Player(playerId);
		world = new World();
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
}

function draw() {
	vpSize = {"x": innerWidth, "y": innerHeight};
	document.getElementById("mainCanvas").width = vpSize.x;
	document.getElementById("mainCanvas").height = vpSize.y;

	input.update();
	world.update();
	player.update(input);

	world.draw();
	player.draw();
}
