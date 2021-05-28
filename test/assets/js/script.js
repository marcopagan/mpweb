// CONSTANTS
const boxes = document.getElementsByClassName('to_recto').length;
/*
->screencapture=478 X 850
glitch all'inizio della raffica
*/

// VARIABLES
let options = {
    step: 24,
    userPause : false,
    showGrid : false,
    showLabel : true,
    showPermaRectos: false,
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
    rectoSetup();
    rectMode(CORNERS);
    let amount = int((width + height /2)*0.03);

    if (true) {
        for(let i = 0; i < amount; i++){
            setTimeout(() => {
                introPlay('box'+count);
            }, i*50);
        }
        setTimeout(() => {
            initializeDivPosition();
        }, 1000);
        setTimeout(() => {
            introRectos = [];
        }, 5000);
    }else{
        initializeDivPosition();
    }

    if (false) {
        setInterval(() => {
            if (options.userPause) {
                autoPlay(false, 'box'+count, false);
            }
        }, 3000);

        setInterval(() => {
            options.userPause = true;
        }, 15000);
    }

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

    // Draw live rectos
    strokeWeight(3);
    if (mouseIsPressed) {
        let recto = liveRectos[liveRectos.length-1];
        recto.updateLastPoint(mouseX, mouseY);
        recto.setBoundary();
        recto.checkValididy(permaRectos);
        if (options.showLabel) {
            recto.moveLabel();
        }
        //recto.drawVertex(15);
    }


    // Draw permanent rectos
    for(let i = 0; i < permaRectos.length; i++){
        let precto = permaRectos[i];
        if (options.showPermaRectos) {
            stroke(options.permaColor);
            fill(options.permaColor[0], options.permaColor[1], options.permaColor[2], options.fillOpacity);
        }else{
            stroke(options.permaColor[0], options.permaColor[1], options.permaColor[2], (255/60)*(90-precto.dissolveFactor));
            fill(options.permaColor[0], options.permaColor[1], options.permaColor[2], (options.fillOpacity/90)*(90-precto.dissolveFactor));
            if (precto.dissolveFactor != 'none' && precto.dissolveFactor < 90) {
                precto.dissolveFactor++;
            }
        }
        precto.draw();
    }


    // Draw live rectos
    for(let i = 0; i < liveRectos.length; i++){
        let recto = liveRectos[i];
        if (recto.isDissolving) {
            recto.dissolve();
        }else{
            recto.checkValididy(permaRectos);
        }
        recto.draw();
        if (recto.dissolveFactor >= 100) {
            if (!mouseIsPressed) {
                liveRectos.splice(i, 1);
            }
        }
    }

    // Draw intro rectos
    for(let i = 0; i < introRectos.length; i++){
        let recto = introRectos[i];
        if (recto.isDissolving) {
            recto.dissolve();
        }else{
            recto.checkValididy(permaRectos);
        }
        recto.draw();
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    for(let i = 0; i < permaRectos.length; i++){
        let precto = permaRectos[i];
        if (precto.isOutCanvas()) {
            permaRectos.splice(i, 1);
            autoPlay(true, precto.isOutCanvas(), false);
        }
    }
}



function mousePressed(){
    let recto = new Recto(0, true);
    recto.setPoints(mouseX, mouseY, mouseX, mouseY);
    recto.loadDivLimit('box'+count);
    if (options.showLabel) {
        recto.createLabel();
    }
    liveRectos.push(recto);
    options.userPause = false;
}



function mouseReleased(){
    let recto = liveRectos[liveRectos.length-1];
    if (options.showLabel) {
        recto.deleteLabel();
    }
    // If recto is valid
    if (recto.validity) {
        recto.isDissolving = true;
        recto.setDivPosition();
        permaRectos.push(recto);
        recto.resizeContent();
        cleanPermaRectos();
        countBox();

    // If recto is not valid
    }else{
        liveRectos.splice(liveRectos.length-1, 1)
    }

}



function autoPlay(adjust, divID, presentation) {
    let time = int(random(50, 150));
    let bottomright = int(random(0, 2));
    let recto = new Recto(time, bottomright);
    recto.loadDivLimit(divID);
    recto.setAutoSteps();
    recto.setAutoPoints();
    recto.setAutoBoundry();
    recto.checkIntersections(permaRectos);
    if (recto.isIntersecting) {
        autoPlay(adjust, divID, presentation);
    }else{
        recto.createLabel();
        recto.autoDraw(!presentation);
        liveRectos.push(recto);
        if (!presentation) {
            permaRectos.push(recto);
            cleanPermaRectos();
        }
        if (!adjust && !presentation) {
            countBox();
        }
    }
}



function snap(value) {
    if (options.snapToGrid) {
        let cell = Math.round((value - (options.step/2)) / options.step);
        return cell * options.step + (options.step/2);
    }else{
        return value;
    }
}



function countBox(){
    count++
    if (count > boxes) {
        count = 1;
    }
}



function cleanPermaRectos(){
    //if (permaRectos.length > 1) {
    if (permaRectos.length > boxes) {
        permaRectos.splice(0, 1);
    }
}



function keyPressed(){
    if (key == 'm') {
        options.showGrid = !options.showGrid;
        document.getElementById("op_showGrid").checked = !document.getElementById("op_showGrid").checked;
    }else if (key == 'n') {
        switchNight();
        document.getElementById("op_night").checked = !document.getElementById("op_night").checked;
    }else if (key == 'a') {
        autoPlay(false, 'box'+count, false);
    }else if (key == 'b') {
        options.snapToGrid = !options.snapToGrid;
        document.getElementById("op_snapToGrid").checked = !document.getElementById("op_snapToGrid").checked;
    }else if (key == 'v') {
        options.showPermaRectos = !options.showPermaRectos;
        document.getElementById("op_showPermaRectos").checked = !document.getElementById("op_showPermaRectos").checked;
    }else if (key == 'c') {
        options.showLabel = !options.showLabel;
        document.getElementById("op_showLabel").checked = !document.getElementById("op_showLabel").checked;
    }else if (key == 'z') {
        triggerOptions();
    }

}



function switchNight(){
    options.night = !options.night;
    let root = document.querySelector(':root');
    if (options.night) {
        root.style.setProperty('--back', '#000');
        root.style.setProperty('--accent', '#FFF');
        options.validColor = [0, 200, 150];
        options.invalidColor = [255, 200, 0];
        options.gridColor = [170, 170, 170];
        options.fillOpacity = 50;
    }else{
        root.style.setProperty('--back', '#FFF');
        root.style.setProperty('--accent', '#000');
        //options.validColor = [0, 0, 255];
        //options.invalidColor = [255, 0, 0];
        options.validColor = [0, 120, 255];
        options.invalidColor = [255, 100, 0];
        options.gridColor = [options.validColor[0], options.validColor[1], options.validColor[2]];
        options.fillOpacity = 10;
    }
    options.backgroundColor = getComputedStyle(document.body).getPropertyValue('--back');
    updateColors();

}



function updateColors(){
    let root = document.querySelector(':root');
    root.style.setProperty('--valid', 'rgb('+options.validColor[0]+', '+options.validColor[1]+', '+options.validColor[2]+')');
    root.style.setProperty('--invalid', 'rgb('+options.invalidColor[0]+', '+options.invalidColor[1]+', '+options.invalidColor[2]+')');
    if (options.night) {
        gridColor = [170, 170, 170];
    }else{
        gridColor = [options.validColor[0], options.validColor[1], options.validColor[2]];
    }

}



function rectoSetup(){
    let root = document.querySelector(':root');
    root.style.setProperty('--gridstep', options.step+'px');
    root.style.setProperty('--textMedium', (options.step/1.2)+'px');
}



function initializeDivPosition(){
    count = 1;
    permaRectos = [];
    let x = options.step/2;
    let y = options.step/2;
    for(let i = 0; i < boxes; i++){
        setTimeout(() => {
            let r = new Recto(30, true);
            r.x1 = x;
            if (document.getElementById('box'+count).getAttribute('option') == '1'){
                r.y1 = lasty;
            }else{
                r.y1 = y;
            }
            
            r.loadDivLimit('box'+count);
            if (count == 2) {
                r.stepx = 12+1;
                r.stepy = 4+1;
            }else{
                r.stepx = int(r.target.minx)+1;
                r.stepy = int(r.target.miny)+1;
            }
            r.x2 = r.x1;
            r.y2 = r.y1;
            r.createLabel();
            r.autoDraw(true);
            liveRectos.push(r);
            permaRectos.push(r);
            //resizePermaRectos();
            countBox();
            y+=(options.step*r.stepy);
            if (i == boxes-1) {
                count = 1;
                //liveRectos = [];
            }

        }, i*1000);
    }
}



function triggerOptions() {
    if (document.getElementById("options").style.width != '0px') {
        document.getElementById("options").style.width = "0px";
        document.getElementById("foreground").style.marginRight = "0px";
    }else{
        document.getElementById("options").style.width = "180px";
        document.getElementById("foreground").style.marginRight = "180px";
    }
}



function closeOptions() {
  document.getElementById("options").style.width = "0px";
  document.getElementById("foreground").style.marginRight = "0px";
}




function optionsCheckbox(selOption) {
    for (let option in options) {
        if (selOption == option) {
            if (selOption == 'night') {
                switchNight();
            }else{
                options[option] = !options[option];
            }
        }
    }
}



function introPlay(divID) {
    let time = int(random(50, 150));
    let bottomright = int(random(0, 2));
    let recto = new Recto(time, bottomright);
    recto.loadDivLimit(divID);
    recto.setAutoSteps();
    recto.setAutoPoints();
    recto.setAutoBoundry();
    recto.createLabel();
    recto.autoDraw(false);
    introRectos.push(recto);
}














