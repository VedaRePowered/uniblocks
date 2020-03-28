"use strict";

let canvasContext;
let socket;
let camera;
let player;
let multiplayers = {};
let world;
let interaction;
let input;
let vpSize = {"x": 0, "y": 0};
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");

	socket = io(serverAddress);
	socket.on("ready", (playerId, colour) => {
		camera = new Camera(64);
		input = new Input();
		interaction = new Interaction();
		world = new World();
		player = new Player(playerId, colour);
		world.update();

		const loading = document.getElementById("delete");
		if (loading) {
			loading.outerHTML = "";
		}
		setInterval(draw, 16);
	});
	socket.on("PlayerJoin", (id, colour) => {
		if (player.id !== id) {
			const p = new Player(id, colour);
			multiplayers[id] = p;
		}
	});
	socket.on("PlayerMove", (id, x, y) => {
		if (player.id !== id) {
			multiplayers[id].collider.x = x;
			multiplayers[id].collider.y = y;
		}
	});
	socket.on("PlayerLeave", id => {
		delete multiplayers[id];
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
	interaction.update();
	world.update();
	player.update(input);

	world.draw();
	for (const p of Object.values(multiplayers)) {
		p.draw();
	}
	player.draw();
	player.inventory.draw();
}

window.onload = init;