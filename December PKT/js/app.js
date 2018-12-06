const can = document.querySelector('canvas');
can.width = 1580;
can.height = 600;
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
        this.speed = 0.5;
        this.originalSpeed = 1; // after moving from one point to another with acceleration speed starts to accumulate
        this.slope = 0;
        this.sx = 0;
        this.sy = 0;
        this.distance = 0;
        this.accel = 0.05;
        this.destinationReached = false;
        this.maxSpeed = 1;
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

class Tile{
    constructor(){
        
    }
}

// Declaring request animation frame for the ability to pause things later
let wraf = null;

// this is where I click
let target = {x:can.width/2,y:can.height/2};

let x = new Mover(150,150);
let y = new Mover(250,250);

let mainLoop = ()=>{
    c.clearRect(0,0,can.width,can.height);
    x.update();
    y.update();
    wraf = window.requestAnimationFrame(mainLoop);
};

mainLoop();


can.onclick = (e)=> {
    target.x = e.clientX -bbox.left;
    target.y = e.clientY -bbox.top;
};
