"use strict";
/* jshint node: true */
const chokidar = require("chokidar");
const io = require ("socket.io")();

let clients = [];
io.on("connection", client => {
	let pos = clients.length;
	clients.push(client);
	client.on("disconnect", () => {
		clients.splice(pos, 1);
	});
});

const watcher = chokidar.watch("./web");
watcher.on("change", ()=>{
	console.log("Client reloading.");
	for (const client of clients) {
		client.emit("reload");
	}
});

io.listen(5001); // using port 5001 for client reloading
