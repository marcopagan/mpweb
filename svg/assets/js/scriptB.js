// VARIABLES
let options = {
    step: 24,
    userPause : false,
    showGrid : true,
    showLabel : true,
    showPermaRectos: true,
    snapToGrid : true,
    night : true,
    backgroundColor : getComputedStyle(document.body).getPropertyValue('--back'),
    gridColor : [170, 170, 170],
    validColor : [0, 200, 150],
    invalidColor : [255, 200, 0],
    permaColor: [255, 0, 255],
    fillOpacity : 50
}

let canvas;
let liveRectos = [];
let permaRectos = [];
let introRectos = [];
let count = 1;
let lasty;



function setup() {
    pixelDensity(displayDensity());
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("background");
    rectMode(CORNERS);
    let amount = int((width + height /2)*0.03);


    for(let i = 0; i < height-options.step; i+=options.step){
        lasty = i-(options.step/2);
    }
}



function draw(){
    background(options.backgroundColor);
    // Dots grid
    if (options.showGrid) {
        stroke(options.gridColor);
        strokeWeight(1.5);
        for(let i = 0; i < width-options.step; i+=options.step){
            for(let j = 0; j < height-options.step; j+=options.step){
                point(i+(options.step/2), j+(options.step/2));
            }
        }
    }

}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}










