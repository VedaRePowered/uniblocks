"use strict";
const httpPort = 5000;

const express = require("express")();
const http = require("http").createServer(express);
const io = require("socket.io")(http);

express.get("/", (req, res) => {
	res.send("Hello, World");
});

io.on("connection");

console.log("Starting http server on port " + String(httpPort) + ", and starting socket.io");
http.listen(httpPort);
