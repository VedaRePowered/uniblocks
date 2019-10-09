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

	socket = io("http://localhost:5000");
	socket.on("connect", (playerId)=>{
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
}

function draw() {
	vpSize = {"x": innerWidth, "y": innerHeight};
	document.getElementById("mainCanvas").width = vpSize.x;
	document.getElementById("mainCanvas").height = vpSize.y;

	world.update();
	player.input(input.held);
	player.update();

	world.draw();
	player.draw();
}
