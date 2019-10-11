"use strict";const reloadingSocket=io("http://localhost:5001");reloadingSocket.on("reload",()=>{location.reload()});
