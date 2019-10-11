"use strict";let registeredCollisionObjects=[];class Collision{constructor(i,t){this.x=0,this.y=0,this.vx=0,this.vy=0,this.width=i,this.height=t,this.registeredId=registeredCollisionObjects.length,registeredCollisionObjects.push(this)}getPossibleCollisions(i,t){let s={},e=[],l=Math.min(1/Math.max(Math.abs(i),Math.abs(t),.001),1);for(let h=0;h<=1+l;h+=l){let l=this.x-this.width/2+i*h,o=this.y-this.height/2+t*h;for(let i=Math.floor(l);i<=Math.ceil(l+this.width);i++)for(let t=Math.floor(o);t<=Math.ceil(o+this.height);t++){let l=Math.ceil(i).toString()+":"+Math.ceil(t).toString();if(void 0===s[l]){s[l]=!0,"00000000000000000000000000000000"!==world.getTile(Math.ceil(i),Math.ceil(t))&&e.push({x:Math.ceil(i)-.5,y:Math.ceil(t)+.5,width:1,height:1})}}}for(const i of registeredCollisionObjects)i.registeredId!==this.registeredId&&e.push({x:i.x-i.width/2,y:i.y+i.height/2,width:i.width,height:i.height,dx:i.vx,dy:i.vy});return e}singleFaceCollide(i,t,s,e,l,h,o){let n=!1;if(t>e){let l=t,h=i;t=e,i=s,e=l,s=h,n=!0}if(l>h){let i=l;l=h,h=i}let r=this.width,c=(o-t)/(e-t);if(c<0||c>1)return!1;let y=i*(1-c)+s*c;return!(h<=y||l>=y+r)&&(n?1-c:c)}onePass(i){let t=this.x+this.vx*i,s=this.y+this.vy*i,e={collision:!1,newX:t},l={collision:!1,newY:s},h=this.width/2,o=this.height/2,n=this.getPossibleCollisions(this.vx*i,this.vy*i);for(const e of n)if(this.vy*i>0){let i=this.singleFaceCollide(this.x-h,this.y+o,t-h,s+o,e.x,e.x+e.width,e.y-e.height);"number"==typeof i&&(!l.collision||i<l.linear)&&(l={collision:!0,collider:e,linear:i,newY:e.y-e.height-o})}else if(this.vy*i<0){let i=this.singleFaceCollide(this.x-h,this.y-o,t-h,s-o,e.x,e.x+e.width,e.y);"number"==typeof i&&(!l.collision||i<l.linear)&&(l={collision:!0,collider:e,linear:i,newY:e.y+o})}for(const l of n)if(this.vx*i>0){let i=this.singleFaceCollide(this.y-o,this.x+h,s-o,t+h,l.y,l.y-l.height,l.x);"number"==typeof i&&(!e.collision||i<e.linear)&&(e={collision:!0,collider:l,linear:i,newX:l.x-h})}else if(this.vx*i<0){let i=this.singleFaceCollide(this.y-o,this.x-h,s-o,t-h,l.y,l.y-l.height,l.x+l.width);"number"==typeof i&&(!e.collision||i<e.linear)&&(e={collision:!0,collider:l,linear:i,newX:l.x+l.width+h})}return[e,l]}slide(i){let[t,s]=this.onePass(i);if(t.collision&&s.collision){let e=this.x,l=this.y,h=this.vx,o=this.vy;this.vy=0,this.y=s.newY,[t]=this.onePass(i),this.x=e,this.y=l,this.vx=h,this.vy=o,this.vx=0,this.x=t.newX,[,s]=this.onePass(i),this.x=e,this.y=l,this.vx=h,this.vy=o,!s.collision||t.collision&&s.linear>t.linear?(this.y=s.newY,this.x=t.newX,t.collision&&(this.vx=0)):(this.x=t.newX,this.y=s.newY,s.collision&&(this.vy=0))}else s.collision&&(!t.collision||s.linear<t.linear)?(this.vy=0,this.y=s.newY,[t]=this.onePass(i),this.x=t.newX,t.collision&&(this.vx=0)):t.collision?(this.vx=0,this.x=t.newX,[,s]=this.onePass(i),this.y=s.newY,s.collision&&(this.vy=0)):(this.x=t.newX,this.y=s.newY);return[t.collider,s.collider]}}
