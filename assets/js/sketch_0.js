let myCanvas;
let nodes = [];
let amount = 8;
let radius = 15;
let colorNum;
let colorBack;
let colorNode;
let tx;
let ty;


function preload(){
}

function setup() {
    myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent("sketch_container");
    //document.body.style.cursor = 'none';

    for (var i = 0; i < amount; i++) {
        let node = new Node(random(radius, windowWidth-radius), random(radius, windowHeight-radius), radius);
        nodes.push(node);
    }

    colorNum = int(random(0, 6));

    if (colorNum == 0){
        colorBack = color(255, 100, 100);
        colorNode = color(100, 50, 255, 50);
    }else if (colorNum == 1) {
        colorBack = color(255, 255, 0);
        colorNode = color(255, 100, 0, 50);
    }else if (colorNum == 2) {
        colorBack = color(255, 80, 50);
        colorNode = color(255, 255, 0, 50);
    }else if (colorNum == 3) {
        colorBack = color(0, 255, 100);
        colorNode = color(200, 0, 140, 50);
    }else{
        colorBack = color(0, 0, 200);
        colorNode = color(0, 255, 200, 50);
    }

}

function draw(){
    background(colorBack);
    fill(colorNode);

    for(let node of nodes){
        strokeWeight(100);
        stroke(colorNode);
        line(mouseX, mouseY, node.x, node.y);
        line(tx, ty, node.x, node.y);
        noStroke();
        node.show();
        node.move();
        tx = node.x;
        ty = node.y;
    }

    //fill(160, 255, 100);
    ellipse(mouseX, mouseY, radius*2, radius*2);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



class Node{

    constructor(tempX, tempY, tempR){
        this.x = tempX;
        this.y = tempY;
        this.r = tempR;
    }

    show(){
        ellipse(this.x, this.y, this.r*2, this.r*2);
    }

    move(){
        this.x+= random(-3, 3);
        this.y+= random(-3, 3);
    }

}




