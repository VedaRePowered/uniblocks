"use strict";

let canvasContext;
let socket;
let camera;
let player;
let world;
let vpSize;
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");
	canvasContext.imageSmoothingEnabled = false;

	socket = io("http://localhost:5000");
	socket.on("connect", (playerId)=>{
		camera = new Camera(64);
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
	world.draw();
	player.draw();
}
