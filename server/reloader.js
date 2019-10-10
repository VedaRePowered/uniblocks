"use strict";
/* jshint node: true */
const chokidar = require("chokidar");
const io = require ("socket.io")();

let clients = {};
let counter = 0
io.on("connection", client => {
	const id = counter;
	counter += 1;
	//let pos = clients.length;
	clients[id] = client;
	client.on("disconnect", () => {
		delete(clients[id]);
	});
});

const watcher = chokidar.watch("./web");
watcher.on("change", ()=>{
	console.log("Client reloading.");
	for (const client of Object.values(clients)) {
		client.emit("reload");
	}
});

io.listen(5001); // using port 5001 for client reloading
