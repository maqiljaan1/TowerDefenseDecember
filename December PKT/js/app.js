//////// Stage Objects
document.body.style.padding = '0px';
document.body.style.margin = '0px';
document.body.style.backgroundColor = `rgba(${255},${55},${255},${1})`;
const can = document.querySelector('canvas');
can.width = window.innerWidth * 0.999;
can.height = window.innerHeight * 0.9920;
can.style.margin = '0px';
can.style.border = '1px solid black';

const bbox = can.getBoundingClientRect();
const c = can.getContext('2d');

const txt = document.querySelector('input');
txt.style.width = '50vw';

const num = document.getElementById('num');

///////// Constants that reduce computations
const deg30cos = Math.cos(Math.PI/6);
const deg30sin = Math.sin(Math.PI/6);
const hexRad = 50
const hexWidth = deg30cos*hexRad;
const hexHeight = deg30sin*hexRad;

//////// Settings
c.textAlign = 'center';
c.textBaseline = 'middle';

// Declaring request animation frame for the ability to pause things later
let wraf = null;

//////// Arrays
let maps = [
    [
        0,14,28,42,56,70,84,85,86,73,58,44,30,16,2,3,18,32,46,60,75,89,90,77,62,48,
        34,20,6,7,22,36,51,64,79,93,94,81,66,53,38,24,10,11,12,27,41,55,69,83,97
    ],
    [
        0,14,28,29,16,2,3,4,19,33,34,21,7,8,9,24,25,11,12,27,41,55,54,53,66,65,51,50,
        63,62,61,60,46,45,58,57,71,85,86,87,88,89,90,91,92,93,94,95,96,97
    ],
    [
        0,1,2,3,4,5,6,7,8,9,10,11,12,27,40,39,38,37,36,35,34,33,32,31,30,29,28,42,
        56,70,84,85,72,58,59,74,88,89,76,62,63,78,92,93,80,66,67,82,96,97
    ],
    [
        0,14,28,42,56,70,84,85,86,73,58,44,30,16,2,3,18,19,5,6,21,35,49,48,47,60,75,
        89,90,77,78,92,93,80,65,51,37,23,9,10,11,12,27,40,39,53,67,82,96,97
    ],
    [
        0,14,28,29,16,2,3,18,32,33,20,6,7,22,36,37,24,10,11,26,40,55,68,67,66,65,64,
        63,62,61,60,59,58,57,56,70,84,85,86,87,88, 89,90,91,92,93,94,95,96,97
    ],
    [
        97,0,1,16,29,43,56,70,84,85,86,87,88,89,76,61,60,59,45,31,18,4,5,6,7,
        8,9,10,11,26,40,54,67,66,52,37,36,35,49,63,64,79,93,94,95,96,97
    ]
];

const mapSelection = document.getElementById('map');
mapSelection.max = maps.length;
let selectedMap = mapSelection.value - 1;

let createdPath = [];

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
        this.speed = 5;
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
        this.alive = true;
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
        this.speed = num.value / 100;
        if(this.x == this.tx && this.y == this.ty){
            this.speed = this.originalSpeed;
            this.destinationReached = true;
            if(this.currentTarget<this.path.length-1){
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

class Tower{
    constructor(x,y,target){
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.target = target;
        this.range = 100;
    }

    draw(){
        c.beginPath();
        c.arc(this.x,this.y, this.radius,0,Math.PI*2);
        c.fillStyle = 'green';
        //c.fill();
        c.closePath();

        c.beginPath();
        c.arc(this.x,this.y,this.range,0,Math.PI*2);
        c.strokeStyle = 'red';
        //c.stroke();
        c.closePath();
    }
    attack(){

    }
    update(){
        this.draw();
    }
}

class Bullet{
    constructor(){

    }
    draw(){

    }
    update(){

    }
}

// this is a hexagon tile
class Tile{
    constructor(x,y,rad,id,isPath){
        this.x = x;
        this.y = y;
        this.rad = rad;
        this.id = id;
        this.isPath = isPath;
        this.area = this.rad * deg30cos; // it is more convenient to determin thing that get inside the hex using this
        this.penalty = 0;
        this.isTower = false;
    }
    draw(){
        c.beginPath();

        if(this.isPath){
            c.fillStyle = `rgba(${55},${55},${255},${1})`;
		    c.strokeStyle = `rgba(${255},${255},${255},${0.5})`;
        }else if(this.isTower && !this.isPath){
            c.fillStyle = `rgba(${255},${255},${55},${1})`;
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
        //c.stroke();
        c.closePath();
		
		c.beginPath();
		c.arc(this.x,this.y,this.area,0,2*Math.PI);
		//c.stroke();
		c.closePath();
        
        
        c.fillStyle = 'black';
        c.strokeStyle = 'black';
        //c.fillText(this.id,this.x,this.y);
        
    }
    checkColision(){
        /*
        if(!this.isPath){
            if((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y ) < this.area * this.area){
                this.isPath = true;
                createdPath.push(this.id);
            }
        }
        */
        if(!this.isTower){
            if((this.x - target.x) * (this.x - target.x) + (this.y - target.y) * (this.y - target.y ) < this.area * this.area){
                this.isTower = true;
                let t1 = new Tower(this.x,this.y,y);
                towers.push(t1);
            }
        }
    }
    update(){
        this.checkColision();
        this.draw();
    }
}


// create mode
let createMode = true;


// this loop creates the tiles
let tiles = [];
let towers = [];
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
        maps[selectedMap].forEach((e)=>{if(e==aTile.id){aTile.isPath = true}});
        tiles.push(aTile);
	}
}

// this is where I click
let target = {x:tiles[0].x,y:tiles[0].y};

let y = new Mover(tiles[0].x,tiles[0].y,maps[selectedMap]);

let mainLoop = ()=>{
    selectedMap = mapSelection.value;
    c.clearRect(0,0,can.width,can.height);
    txt.value = createdPath;
	tiles.forEach((e,i)=>{e.update();});
    y.update();
    towers.forEach((e)=>e.update());
    
    wraf = window.requestAnimationFrame(mainLoop);
};

mainLoop();

can.onclick = (e)=> {
    target.x = e.clientX -bbox.left;
    target.y = e.clientY -bbox.top;
};
