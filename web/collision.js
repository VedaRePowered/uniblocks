let registeredCollisionObjects = {};
class Collision {
	constructor(width, height) {
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.width = width;
		this.height = height;
		this.registeredId = registeredCollisionObjects.length;

		registeredCollisionObjects.push(this);
	}

	getPossibleCollisions(world, dx, dy) {
		let possibleCollisionsReversed = {};
		let possibleCollisions = [];
		let step = Math.min(1/Math.max(Math.abs(dx), Math.abs(dy), 0.001), 1);
		for (let i = 0; i <= 1+step; i+=step) {
			let tx = this.x-this.width/2+dx*i;
			let ty = this.y-this.height/2+dy*i;
			for (let ix = Math.floor(tx); ix <= Math.ceil(tx+this.width); ix++) {
				for (let iy = Math.floor(ty); iy <= Math.ceil(ty+this.height); iy++) {
					let code = Math.ceil(ix).toString() + ":" + Math.ceil(iy).toString();
					if (typeof(possibleCollisionsReversed[code]) !== "undefined") {
						possibleCollisionsReversed[code] = true;
						let tid = world.getTile(Math.ceil(ix), Math.ceil(iy));
						if (tid !== "00000000000000000000000000000000") {
							possibleCollisions.push({"x": Math.ceil(ix), "y": Math.ceil(iy), "width": 1, "height": 1});
						}
					}
				}
			}
		}
		for (const [ignore, co] in Object.entries(registeredCollisionObjects)) {
			if (co.registeredId !== this.registeredId) {
				possibleCollisions.push({"x": co.x-co.width/2, "y": co.y+co.height/2, "width": co.width, "height": co.height, "dx": co.vx, "dy": co.vy}); // drag velocity
			}
		}
		return possibleCollisions;
	}

	singleFaceCollide(px1, py1, px2, py2, lx1, lx2, ly) { // x and y could be swapped and it would still work
		let swapped = false;
		// sort
		if (py1 > py2) {
			let ty = py1, tx = px1;
			py1 = py2; px1 = px2;
			py2 = ty; px2 = tx;
			swapped = true;
		}
		if (lx1 > lx2) {
			let tx = lx1;
			lx1 = lx2;
			lx2 = tx;
		}

		let pxl = this.width;
		// collide line moving from (px1, py1 to px1+pxl, py1) to (px2, py2 to px2+pxl, py2) with line (lx1, ly, lx2, ly)
		let nLy = (ly-py1)/(py2-py1); // new line y (interpl for intersecting y)
		if (nLy < 0 || nLy > 1) {
			return false;
		}
		let lPx = px1*(1-nLy) + px2*nLy; // new px (px for intersecting y)
		if (lx2 <= lPx || lx1 >= lPx + pxl) { // collide
			return false;
		}
		return swapped ? (1-nLy) : nLy; // how far until hit
	}

	onePass(world, delta) {
		let gx = this.x+this.vx*delta, gy = this.y+this.vy*delta; // goal
		let hitX = {"collision": false, "newX": gx}, hitY = {"collision": false, "newY": gy};
		let hEdge = this.width/2, vEdge = this.height/2;

		let blocks = this.getPossibleCollisions(world, this.vx*delta, this.vy*delta);
		// vertical collision
		for (const [ignore, b] in Object.entries(blocks)) {
			if (this.vy*delta > 0) {
				let colliding = this.singleFaceCollide(this.x-hEdge, this.y+vEdge, gx-hEdge, gy+vEdge, b.x, b.x+b.width, b.y-b.height);
				if (colliding && (!hitY.collision || colliding < hitY.linear)) {
					hitY = {"collision": true, "collider": b, "linear": colliding, "newY": b.y-b.height-vEdge};
				}
			} else if (this.vy*delta < 0) {
				let colliding = this.singleFaceCollide(this.x-hEdge, this.y-vEdge, gx-hEdge, gy-vEdge, b.x, b.x+b.width, b.y);
				if (colliding && (!hitY.collision || colliding < hitY.linear)) {
					hitY = {"collision": true, "collider": b, "linear": colliding, "newY": b.y+vEdge};
				}
			}
		}
		// horizontal collision
		for (const [ignore, b] in Object.entries(blocks)) {
			if (this.vx*delta > 0) {
				let colliding = this.singleFaceCollide(this.y-vEdge, this.x+hEdge, gy-vEdge, gx+hEdge, b.y, b.y-b.height, b.x);
				if (colliding && (!hitX.collision || colliding < hitX.linear)) {
					hitX = {"collision": true, "collider": b, "linear": colliding, "newX": b.x-hEdge};
				}
			} else if (this.vx*delta < 0) {
				let colliding = this.singleFaceCollide(this.y-vEdge, this.x-hEdge, gy-vEdge, gx-hEdge, b.y, b.y-b.height, b.x+b.width);
				if (colliding && (!hitX.collision || colliding < hitX.linear)) {
					hitX = {"collision": true, "collider": b, "linear": colliding, "newX": b.x+b.width+hEdge};
				}
			}
		}

		return [hitX, hitY];
	}

	slide(world, delta) {
		let [hitX, hitY] = this.onePass(world, delta);
		if (hitX.collision && hitY.collision) {
			let ox = this.x, oy = this.y, ovx = this.vx, ovy = this.vy;
			{
				this.vy = 0;
				this.y = hitY.newY;
				[hitX, ignore] = this.onePass(world, delta);
			}
			this.x = ox; this.y = oy; this.vx = ovx; this.vy = ovy;
			{
				this.vx = 0;
				this.x = hitX.newX;
				[ignore, hitY] = this.onePass(world, delta);
			}
			this.x = ox; this.y = oy; this.vx = ovx; this.vy = ovy;
			if (!hitY.collision || (hitX.collision && hitY.linear > hitX.linear)) {
				this.y = hitY.newY;
				this.x = hitX.newX;
				if (hitX.collision) {
					this.vx = 0;
				}
			} else {
				this.x = hitX.newX;
				this.y = hitY.newY;
				if (hitY.collision) {
					this.vy = 0;
				}
			}
		} else if (hitY.collision && (!hitX.collision || hitY.linear < hitX.linear)) {
			this.vy = 0;
			this.y = hitY.newY;
			let [hitX, ignore] = this.onePass(world, delta);
			this.x = hitX.newX;
			if (hitX.collision) {
				this.vx = 0;
			}
		} else if (hitX.collision) {
			this.vx = 0;
			this.x = hitX.newX;
			let [ignore, hitY] = this.onePass(world, delta);
			this.y = hitY.newY;
			if (hitY.collision) {
				this.vy = 0;
			}
		} else { // path clear
			this.x = hitX.newX; this.y = hitY.newY;
		}
		return [hitX.collider, hitY.collider];
	}
}
