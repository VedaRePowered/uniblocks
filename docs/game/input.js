"use strict";class Input{constructor(){this.held=new Array(256);for(let e=0;e<256;e++)this.held[e]=!1;window.addEventListener("keydown",e=>{e.defaultPrevented||(this.held[e.which]=!0,e.preventDefault())},!0),window.addEventListener("keyup",e=>{e.defaultPrevented||(this.held[e.which]=!1,e.preventDefault())},!0)}}
