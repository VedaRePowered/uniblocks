"use strict";
const httpPort = 5000;

const Player = require("./player.js");
const uuid = require("uuid/v4");
const PNG = require("pngjs").PNG;

const express = require("express");
const socket = require("socket.io");
const http = require("http")
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("web", {"extensions": ["html", "png"]}));
app.use("world", express.static("world", {"extensions": ["json", "png"]}))

const players = [];
const world = {}; // world is devided into 256x256 regions
function getRegion(x, y) {
	if (typeof(world[Math.floor(x/256)]) !== "undefined") {
		world[Math.floor(x/256)] = {};
	}
	if (typeof(world[Math.floor(x/256)][Math.floor(x/256)]) !== "undefined") {
		world[Math.floor(x/256)][Math.floor(x/256)] = Buffer.alloc(65536);
	}
	return world[Math.floor(x/256)][Math.floor(x/256)];
}
const tiles = [];
io.on("connection", function(client) {
	const playerId = uuid();
	players[playerId] = new Player();
	console.log("Recieved socket.io connection. ID=" + String(playerId));
	client.on("WorldGetTile", (tileId, sendResp) => {
		sendResp(true, {"name": "Dirt", "graphic": Buffer.alloc(256*3), "code": ""});
	});
	client.on("WorldGetRegion", (x, y, sendResp) => {
		if (typeof(sendResp) == "function") {
			sendResp(getRegion(x, y));
		}
	});
	client.on("WorldNewTile", (graphic, name, code, sendResp) => {
		const newTileId = tiles.length;
		tiles[newTileId] = new Tile(graphic, name, code);
		if (typeof(sendResp) == "function") {
			sendResp(newTileId);
		}
	});
	client.on("WorldSetTile", (x, y, tileId) => {
		getRegion(x, y)[(x&255)|((y&255)<<8)] = tileId;
	});
	client.on("disconnect", () => {
		players[playerId] = undefined;
		console.log("Player disconnected. ID=" + String(playerId));
	});
});

console.log("Starting http server on port " + String(httpPort) + ", and starting socket.io");
server.listen(httpPort);
