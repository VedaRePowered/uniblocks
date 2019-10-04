"use strict";

let canvasContext;
let socket;
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");
	socket = io("http://localhost:5000");
}

function draw() {
	console.log("Frame");
}
