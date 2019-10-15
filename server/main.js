"use strict";
/* jshint node: true */
const devMode = typeof(process.argv[0]) !== "undefined" && process.argv[0] === "--dev";
const httpPort = 5000;

const Player = require("./player.js");
const PNG = require("pngjs").PNG;
const fs = require("fs");

const express = require("express");
const socket = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("web", {"extensions": ["html", "png"]}));
app.use("world", express.static("world", {"extensions": ["json", "png"]}));

const players = [];
const world = {}; // world is devided into 256x256 regions
function ruid() { // random unique identifier
	return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, inch=>{return Math.floor(Math.random()*16).toString(16);});
}
function ruidToBuf(ruid, buf, start) {
	for (let i = 0; i < 16; i++) {
		buf[start+i] = parseInt(ruid.substr(i*2, 2), 16);
	}
}
function getRegion(x, y) {
	if (typeof(world[Math.floor(x/256)]) === "undefined") {
		world[Math.floor(x/256)] = {};
	}
	if (typeof(world[Math.floor(x/256)][Math.floor(y/256)]) === "undefined") {
		world[Math.floor(x/256)][Math.floor(y/256)] = Buffer.alloc(65536*16);
	}
	return world[Math.floor(x/256)][Math.floor(y/256)];
}
const tiles = [];
io.on("connection", function(client) {
	const playerId = ruid();
	players[playerId] = new Player();
	console.log("Recieved socket.io connection. ID=" + String(playerId));
	client.on("WorldGetTile", (tileId, sendResp) => {
		console.log("gettile: " + String(tileId));
		fs.readFile("./world/tile/" + String(tileId) + ".png", (err, pngData) => {
			if (err) {
				console.log(err);
				sendResp(false, err);
			} else {
				fs.readFile("./world/tile/" + String(tileId) + ".json", (err, jsonData) => {
					if (err) {
						console.log(err);
						sendResp(false, err);
					} else {
						const info = JSON.parse(jsonData);
						console.log("s");
						sendResp(true, {"name": info.name, "description": info.description, "graphic": "data:image/png;base64," + pngData.toString("base64"), "code": info.code});
					}
				})
			}
		});
	});
	client.on("WorldGetRegion", (x, y, sendResp) => {
		console.log("regionsent:", x, y);
		if (typeof(sendResp) === "function") {
			sendResp(getRegion(x*256, y*256));
		}
	});
	client.on("WorldNewTile", (graphic, name, description, code, sendResp) => {
		const newTileId = ruid();
		fs.writeFile("./world/tile/" + String(newTileId) + ".json", JSON.stringify({"name": name, "description": description, "code": code}));
		const img = new PNG({
			"width": 16,
			"height": 16,
			"filterType": -1
		});
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				const r = (graphic.palette[graphic.grid[x+y*16]] & 0xff000000) >>> 24;
				const g = (graphic.palette[graphic.grid[x+y*16]] & 0x00ff0000) >>> 16;
				const b = (graphic.palette[graphic.grid[x+y*16]] & 0x0000ff00) >>> 8;
				const a = graphic.palette[graphic.grid[x+y*16]] & 0x000000ff;
				console.log(r, g, b, a)
				img.data[x*4+y*64] = r;
				img.data[x*4+y*64+1] = g;
				img.data[x*4+y*64+2] = b;
				img.data[x*4+y*64+3] = a;
			}
		}
		img.pack().pipe(fs.createWriteStream("./world/tile/" + String(newTileId) + ".png"));

		if (typeof(sendResp) === "function") {
			sendResp(newTileId);
		}
	});
	client.on("WorldSetTile", (x, y, tileId) => {
		ruidToBuf(tileId, getRegion(x, y), ((x&255)+((y&255)*256))*16);
		io.sockets.emit("WorldSetTile", x, y, tileId);
		console.log(tileId, x, y);
	});
	client.on("disconnect", () => {
		players[playerId] = undefined;
		console.log("Player disconnected. ID=" + String(playerId));
	});
});

console.log("Starting http server on port " + String(httpPort) + ", and starting socket.io");
server.listen(httpPort);
