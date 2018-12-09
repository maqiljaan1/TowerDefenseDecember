//////// Stage Objects
document.body.style.padding = '0px';
document.body.style.margin = '0px';
const can = document.querySelector('canvas');
can.width = window.innerWidth * 0.999;
can.height = window.innerHeight * 0.9920;
can.style.margin = '0px';
can.style.border = '1px solid black';

const bbox = can.getBoundingClientRect();
const c = can.getContext('2d');


///////// Constants that reduce computations
const deg30cos = Math.cos(Math.PI/6);
const deg30sin = Math.sin(Math.PI/6);
const hexRad = 50
const hexWidth = deg30cos*hexRad;
const hexHeight = deg30sin*hexRad;

//////// Settings
c.textAlign = 'center';

// Declaring request animation frame for the ability to pause things later
let wraf = null;

//////// Arrays
let aPath = [
    14,15,16,17,31,45,44,43,56,70,84,85,86,87,74,60,47,33,19,20,21,35,49,62,77,78,79,65,52,38,39,40,41
];

//////// Classes
class Mover{
    constructor(x,y,path){
        this.x = x;
        this.y = y;
        this.rad = 10;
        this.path = path;
        this.currentTarget = 1;
        this.tx = tiles[this.path[this.currentTarget]].x;
        this.ty = tiles[this.path[this.currentTarget]].y;
        this.speed = 2;
        this.originalSpeed = this.speed; // after moving from one point to another with acceleration speed starts to accumulate
        this.slope = 0;
        this.sx = 0;
        this.sy = 0;
        this.distance = 0;
        this.accel = 0.0;// zero for now
        this.destinationReached = false;
        this.maxSpeed = 15;
        this.path = path;
        this.hp = 1000;
    }
    draw(){
        c.beginPath();

        if(this.destinationReached){
            c.fillStyle = 'red';
        }else{
            c.fillStyle = 'green';
        }
        c.arc(this.x,this.y,this.rad,0,Math.PI*2);
        c.fill();
        c.stroke();
        c.closePath();
    }
    update(){
        this.destinationReached = false;
        if(this.x == this.tx && this.y == this.ty){
            this.speed = this.originalSpeed;
            this.destinationReached = true;
            if(this.currentTarget<this.path.length){
                this.currentTarget += 1;
            }
            
        }
        if(this.speed < this.maxSpeed) this.speed += this.accel;
        //this.slope = (this.ty - this.y) / (this.tx - this.x);
        this.tx = tiles[this.path[this.currentTarget]].x;
        this.ty = tiles[this.path[this.currentTarget]].y;

        this.distance = Math.sqrt((this.ty - this.y) * (this.ty - this.y) + (this.tx - this.x) * (this.tx - this.x));

        
        if(!isNaN(this.sy)){
            this.sx = Math.abs(this.speed * ((this.tx - this.x)/this.distance));
        }else{
            this.sx = 0;
        }

        if(!isNaN(this.sy)){
            this.sy = Math.abs(this.speed * ((this.ty - this.y)/this.distance));
        }else{
            this.sy = 0;
        }

        //c.fillText(`${this.distance}:${this.slope} ` ,10,10);
        //c.fillText(`${this.sx}:${this.sy} ` ,20,20);
        this.draw();

        if(this.x != this.tx){
            if(this.x < this.tx){
                if(this.x + this.sx <= this.tx){
                    this.x += this.sx;
                }else{
                    this.x = this.tx;
                }
            }else{
                if(this.x + this.sx >= this.tx){
                    this.x -= this.sx;
                }else{
                    this.x = this.tx;
                }
            }
        }

        if(this.y != this.ty){
            if(this.y < this.ty){
                if(this.y +this.sy <= this.ty){
                    this.y += this.sy;
                }else{
                    this.y = this.ty;
                }
            }else{
                if(this.y + this.sy >= this.ty){
                    this.y -= this.sy;
                }else{
                    this.y = this.ty;
                }
            }
        }
    }
}

class Level{
}

// this is a hexagon tile
class Tile{
    constructor(x,y,rad,id){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.id = id;
        this.isPath = false;
        this.area = this.rad * deg30cos; // it is more convenient to determin thing that get inside the hex using this
        this.penalty = 0;

    }
    draw(){
        
        c.beginPath();

        if(this.isPath){
            c.fillStyle = `rgba(${55},${55},${255},${1})`;
		    c.strokeStyle = `rgba(${255},${255},${255},${0.5})`;
        }else{
            c.fillStyle = `rgba(${255},${55},${255},${1})`;
		    c.strokeStyle = `rgba(${255},${255},${255},${0.5})`;
        }

        c.moveTo(this.x, this.y + this.rad);
        c.lineTo(this.x - deg30cos*this.rad, this.y + deg30sin*this.rad);
        c.lineTo(this.x - deg30cos*this.rad, this.y - deg30sin*this.rad);
        c.lineTo(this.x, this.y - this.rad);
        c.lineTo(this.x + deg30cos*this.rad, this.y - deg30sin*this.rad);
        c.lineTo(this.x + deg30cos*this.rad, this.y + deg30sin*this.rad);
        c.lineTo(this.x, this.y + this.rad);
		c.fill();
        c.stroke();
        c.closePath();
		
		c.beginPath();
		c.arc(this.x,this.y,this.area,0,2*Math.PI);
		c.stroke();
		c.closePath();
        
        
        c.fillStyle = 'black';
        c.strokeStyle = 'black';
        c.fillText(this.id,this.x,this.y);
        
    }
    checkColision(){
        if((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y ) < this.area * this.area){
            this.isPath = true;
        }
    }
    update(){
        this.checkColision();
        this.draw();
    }
}

// this loop creates the tiles
let tiles = [];
let hTileCount = 14;
let vTileCount = 7;

for(j = 0; j < vTileCount; j++){
    let offset = 0;
    
	if(j%2==0){
		offset = 1;
	}else{
		offset = 0;
	}
	
	for(i = 0; i < hTileCount; i++){
		let aTile = new Tile(hexWidth + offset*(hexWidth)+(2*i+1)*(hexWidth),2*hexRad+ 2*hexRad*j-j*hexHeight,hexRad,`${j*hTileCount+i}`);
		tiles.push(aTile);
	}
}


// this is where I click
let target = {x:tiles[hTileCount].x,y:tiles[hTileCount].y};

let y = new Mover(tiles[hTileCount].x,tiles[hTileCount].y,aPath);

let mainLoop = ()=>{
    c.clearRect(0,0,can.width,can.height);
	tiles.forEach((e,i)=>{e.update();});
    y.update();
    
    wraf = window.requestAnimationFrame(mainLoop);
};

mainLoop();

can.onclick = (e)=> {
    target.x = e.clientX -bbox.left;
    target.y = e.clientY -bbox.top;
};
