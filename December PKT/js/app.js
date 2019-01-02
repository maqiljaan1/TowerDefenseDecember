// Canvas Set Up
const can = document.querySelector('canvas'); 
can.width = document.body.clientWidth; 	// This combo appears to be better 
can.height = window.innerHeight;		// than what we used before
const c = can.getContext('2d');

// Key Set Up
let keys = {};
let mcoor = {x:0,y:0};
window.onkeydown = (e)=>{ keys[`${e.keyCode}`] = 1};
window.onkeyup = (e) => { keys[`${e.keyCode}`] = 0};
window.onmousemove = (e) => { mcoor.x = e.clientX; mcoor.y = e.clientY};

// Settings
const gTileSize = 25;
c.textBaseline = 'middle';
c.textAlign = 'center';

// Classes Declarations

// aTile is isometric in nature
class aTile{
	constructor(x,y,row,col,height){
		this.x = x;
		this.y = y;
		this.size = gTileSize;
		this.row = row;
		this.col = col;
		this.top = {x:this.x,y:this.y};
		this.right = {x:this.x + this.size,y:this.y + (this.size/2)};
		this.bottom = {x:this.x,y:this.y + this.size};
		this.left = {x:this.x - this.size,y:this.y + (this.size/2)};
		this.height = height;
		this.fillStyle1 = `rgb(${255*this.height/10},${255*this.height/10},${255*this.height/10})`;
		this.fillStyle2 = `rgb(${255*this.height/50},${255*this.height/50},${255*this.height/50})`;
	}
	render1(){
		c.fillStyle = this.fillStyle1;
		c.beginPath();
		c.moveTo(this.top.x,this.top.y + this.height);
		c.lineTo(this.right.x, this.right.y + this.height);
		c.lineTo(this.bottom.x, this.bottom.y + this.height);
		c.lineTo(this.left.x,this.left.y + this.height);
		c.lineTo(this.top.x,this.top.y + this.height);
		c.fillStyle = this.fillStyle1;
		c.fill();
		c.closePath();
	}
	
	shadow(){		
		c.fillStyle = this.fillStyle2;
		c.beginPath();
		c.moveTo(this.top.x,this.top.y + this.height);
		c.lineTo(this.right.x,this.right.y + this.height);
		c.lineTo(this.right.x,this.right.y + this.size);
		c.lineTo(this.bottom.x, this.bottom.y + this.size);
		c.lineTo(this.left.x, this.left.y + this.size);
		c.lineTo(this.left.x, this.left.y + this.height);
		c.lineTo(this.top.x,this.top.y + this.height);
		c.fill();
		c.closePath();
	}
	update(){
		this.shadow();
		this.render1();
		
	}
}

// Instantiation

let tiles = [];

let screenMaxTiles = can.width/gTileSize/2;

let tileSize = {row:screenMaxTiles,col:screenMaxTiles};

// I would like to create a dynamic tiling system wherein if the tile no longer fits
// the screen it would move to the next lineHeight

let curRow = 0;
//let ax;
//let ay;

for(i = 0; i < tileSize.col; i++){
	for(ii = 0 ; ii < tileSize.row; ii++){
		let ax = can.width/2 + i*gTileSize - ii*gTileSize;
		let ay = can.height/2 - tileSize.row*gTileSize/2 + gTileSize*0.5 * ii + gTileSize*i*0.5;
		let t = new aTile(ax,ay,ii,i, Math.random()*10);
		tiles.push(t);
	}
}

// Loop
let globalTime = performance.now();

let wraf = null;

let mainLoop = ()=>{
	wraf = window.requestAnimationFrame(mainLoop);
	c.clearRect(0,0,can.width,can.height);
	globalTime = performance.now();
	
	c.fillText(`${mcoor.x}`,10,10);
	c.fillText(`${mcoor.y}`,10,20);
	tiles.forEach(e=> e.update());
};

mainLoop();



