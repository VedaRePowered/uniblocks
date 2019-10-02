"use strict";

let canvasContext;
function init() {
	const canvas = document.getElementById("mainCanvas");
	canvasContext = canvas.getContext("2d");
}

function draw() {
	console.log("Frame");
}
