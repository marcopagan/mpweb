let myCanvas;
let imgs = [];
let sad;

function preload(){
    sad = loadImage("https://marcopagan.com/assets/img/sad.png");
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent("sketch_404");
    ellipseMode(CORNER);
    for (let i = 0; i < 10; i++) {
        let emoji = new Emoji(random(0, windowWidth), random(.2, 3));
        imgs.push(emoji);
    }
}

function draw() {
    background(255, 255, 255);
    noFill();
    stroke(0);
    strokeWeight(5);
    for (let emoji of imgs){
        emoji.show();
        emoji.move();

    }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}





class Emoji{

    constructor(tempX, tempVel){
        this.x = tempX;
        this.vel = tempVel
        this.y = windowHeight;
    }

    show(){
        ellipse(this.x, this.y, 150, 150);
        image(sad, this.x, this.y, 150, 150);

    }

    move(){
        this.y-=this.vel;
    }
}