document.body.style.padding = '0px';
document.body.style.margin = '0px';
const can = document.querySelector('canvas');
can.width = window.innerWidth * 0.999;
can.height = window.innerHeight * 0.9920;
can.style.margin = '0px';

can.style.border = '1px solid black';

const bbox = can.getBoundingClientRect();

const c = can.getContext('2d');


class Mover{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.rad = 10;
        this.tx = 0;
        this.ty = 0;
        this.speed = 5;
        this.originalSpeed = this.speed; // after moving from one point to another with acceleration speed starts to accumulate
        this.slope = 0;
        this.sx = 0;
        this.sy = 0;
        this.distance = 0;
        this.accel = 0.05;
        this.destinationReached = false;
        this.maxSpeed = 15;
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
        //c.stroke();
        c.closePath();
    }
    update(){
        this.destinationReached = false;
        if(this.x == this.tx && this.y == this.ty){
            this.speed = this.originalSpeed;
            this.destinationReached = true;
        }
        if(this.speed < this.maxSpeed) this.speed += this.accel;
        //this.slope = (this.ty - this.y) / (this.tx - this.x);
        this.tx = target.x;
        this.ty = target.y;

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


// this is a hexagon tile
class Tile{
    constructor(x,y,rad,id){
        this.x = x;
        this.y = y;
        this.rad = rad;
		this.id = id;
    }
    draw(){
		c.fillStyle = `rgba(${36},${36},${255},${1})`;
		c.strokeStyle = `rgba(${255},${255},${25},${1})`;
        c.beginPath();
		
        c.moveTo(this.x, this.y + this.rad);
        c.lineTo(this.x - Math.cos(Math.PI/6)*this.rad, this.y + Math.sin(Math.PI/6)*this.rad);
        c.lineTo(this.x - Math.cos(Math.PI/6)*this.rad, this.y - Math.sin(Math.PI/6)*this.rad);
        c.lineTo(this.x, this.y - this.rad);
        c.lineTo(this.x + Math.cos(Math.PI/6)*this.rad, this.y - Math.sin(Math.PI/6)*this.rad);
        c.lineTo(this.x + Math.cos(Math.PI/6)*this.rad, this.y + Math.sin(Math.PI/6)*this.rad);
        c.lineTo(this.x, this.y + this.rad);
		c.fill();
        c.stroke();
        c.closePath();
		
		c.beginPath();
		c.arc(this.x,this.y,this.rad*Math.cos(Math.PI/6),0,2*Math.PI);
		c.stroke();
		c.closePath();
		
		c.fillText(this.id,this.x,this.y);
    }
    update(){
        this.draw();
    }
}

// Declaring request animation frame for the ability to pause things later
let wraf = null;

// this is where I click
let target = {x:can.width/2,y:can.height/2};

let y = new Mover(250,250);

let z = [];

// this is one bad naming convention
const hexRad = 30

c.textAlign = 'center';

for(j = 0; j < 15; j++){
	let offset = 0;
	if(j%2==0){
		offset = 1;
	}else{
		offset = 0;
	}
	
	for(i = 0; i < 26; i++){
		let z1 = new Tile(offset*(Math.cos(Math.PI/6)*hexRad)+(2*i+1)*(Math.cos(Math.PI/6)*hexRad),2*hexRad*j-j*Math.sin(Math.PI/6)*hexRad,hexRad,`${j}:${i}`);
		z.push(z1);
	}
}

let mainLoop = ()=>{
    c.clearRect(0,0,can.width,can.height);
	z.forEach((e,i)=>{e.update();});
    y.update();
    
    wraf = window.requestAnimationFrame(mainLoop);
};

mainLoop();


can.onclick = (e)=> {
    target.x = e.clientX -bbox.left;
    target.y = e.clientY -bbox.top;
};
