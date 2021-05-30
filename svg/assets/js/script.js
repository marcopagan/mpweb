// CONSTANTS
const boxes = document.getElementsByClassName('to_recto').length;
const svgns = "http://www.w3.org/2000/svg";
/*
->screencapture=478 X 850
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
    gridColor : null,
    validColor : null,
    invalidColor : null,
    permaColor: [0, 0, 255],
    fillOpacity : .2,
    waterfall: true,
    autoplay: true
}

let liveRectos = [];
let permaRectos = [];
let count = 1;
let lasty;
let m = {};
let mouseIsPressed = 0;
let lastKey;





// FUNCTIONS //

// RECTO LIFE //
function createRecto(){
    mouseIsPressed++;
    let recto = new Recto(false);
    recto.createSvg(m.x, m.y, 'liveRectos');
    recto.loadDivLimit('box'+count);
    if (options.showLabel) {
        recto.createLabel();
    }
    liveRectos.push(recto);
    options.userPause = false;
}


function moveRecto(){
    updateMouseXY();
    if(mouseIsPressed){
        let recto = liveRectos[liveRectos.length-1];
        recto.updatePoints(m.x, m.y);
        recto.setBoundary();
        recto.updateSVG();
        recto.checkValididy(permaRectos);
        if (options.showLabel) {
            recto.moveLabel();
        }
    }
}


function deleteRecto(){
    mouseIsPressed--;
    let recto = liveRectos[liveRectos.length-1];
    if (options.showLabel) {
        recto.deleteLabel();
    }
    liveRectos.splice(liveRectos.length-1, 1);
    // If recto is valid
    if (recto.validity) {
        recto.setDivPosition();
        pushToPermaRectos(recto);
        refreshPermaRectos();
        cleanPermaRectos();
        recto.dissolve();
        setTimeout(() => {
            recto.removeSvg();
        }, 1000);
        countBox();
    }else{
        recto.removeSvg();
    }

}





// PERMA RECTOS //
function refreshPermaRectos(){
    for(let precto of permaRectos){
        if (!precto.show) {
            color = 'rgb('+options.permaColor[0]+', '+options.permaColor[1]+', '+options.permaColor[2]+')';
            let svgRect = document.createElementNS(svgns, 'rect');
            svgRect.setAttributeNS(null, 'x', precto.boundary.startx);
            svgRect.setAttributeNS(null, 'y', precto.boundary.starty);
            svgRect.setAttributeNS(null, 'width', precto.pWdt);
            svgRect.setAttributeNS(null, 'height', precto.pHgt);
            svgRect.setAttributeNS(null, 'fill', color);
            svgRect.setAttributeNS(null, 'stroke', color);
            if (options.showPermaRectos) {
                svgRect.setAttributeNS(null, 'fill-opacity', options.fillOpacity);
                svgRect.setAttributeNS(null, 'stroke-opacity', '1');
            }else{
                setTimeout(() => {
                    svgRect.setAttributeNS(null, 'fill-opacity', '0');
                    svgRect.setAttributeNS(null, 'stroke-opacity', '0');
                }, 50);
                svgRect.setAttributeNS(null, 'fill-opacity', options.fillOpacity);
                svgRect.setAttributeNS(null, 'stroke-opacity', '1');
            }
            document.getElementById('permaRectos').appendChild(svgRect);
            precto.show = true;
            setTimeout(() => {
                svgRect.setAttributeNS(null, 'width', precto.boundary.width);
                svgRect.setAttributeNS(null, 'height', precto.boundary.height);
            }, 1000);
        }
    }
}


function cleanPermaRectos(){
    if (permaRectos.length > boxes) {
        permaRectos.splice(0, 1);
        document.getElementById('permaRectos').children[0].remove();
    }
}


function pushToPermaRectos(recto){
    let precto = {
        pWdt: recto.boundary.width,
        pHgt: recto.boundary.height,
        show: false,
        id: recto.target.id
    }
    recto.resizeContent();
    precto.boundary = recto.boundary;
    permaRectos.push(precto);
}





// AUTO //
function autoPlay(adjust, divID, presentation) {
    let recto = new Recto(true);
    recto.loadDivLimit(divID);
    recto.setAutoSteps();
    recto.setAutoPoints();
    recto.setAutoBoundry();
    recto.checkIntersections(permaRectos);
    if (recto.isIntersecting) {
        autoPlay(adjust, divID, presentation);
    }else{
        if (options.showLabel) {
            recto.createLabel();
        }
        recto.createSvg(recto.x1, recto.y1, 'liveRectos');
        recto.autoDraw(!presentation);
        liveRectos.push(recto);
        if (!adjust && !presentation) {
            countBox();
        }
    }
}


function initializeDivPosition(){
    count = 1;
    permaRectos = [];
    let x = options.step/2;
    let y = options.step/2;
    for(let i = 0; i < boxes; i++){
        setTimeout(() => {
            let recto = new Recto(true);
            recto.auto.topleft = 1;


            recto.x1 = x;
            if (document.getElementById('box'+count).getAttribute('option') == '1'){
                recto.y1 = lasty;
            }else{
                recto.y1 = y;
            }
            recto.x2 = recto.x1;
            recto.y2 = recto.y1;


            recto.loadDivLimit('box'+count);
            if (count == 2) {
                recto.auto.stepx = 12+1;
                recto.auto.stepy = 3+1;
            }else{
                recto.auto.stepx = int(recto.target.minx);
                recto.auto.stepy = int(recto.target.miny);
            }
            
            recto.setAutoBoundry();
            recto.checkIntersections(permaRectos);
            if (options.showLabel) {
                recto.createLabel();
            }
            recto.createSvg(recto.x1, recto.y1, 'liveRectos');
            recto.autoDraw(true);
            liveRectos.push(recto);
            countBox();
            y+=(options.step*(recto.auto.stepy+1));
            if (i == boxes-1) {
                count = 1;
                //liveRectos = [];
            }
        }, i*1000);
    }
}





// OPTIONS //
function triggerOptions() {
    if (document.getElementById("options").style.width != '0px') {
        document.getElementById("options").style.width = "0px";
        document.getElementById("foreground").style.marginRight = "0px";
    }else{
        document.getElementById("options").style.width = "180px";
        document.getElementById("foreground").style.marginRight = "180px";
    }
}


function loadOptions(){
    document.getElementById('op_night').checked = options.night;
    document.getElementById('op_snapToGrid').checked = options.snapToGrid;
    document.getElementById('op_showGrid').checked = options.showGrid;
    document.getElementById('op_showLabel').checked = options.showLabel;
    document.getElementById('op_showPermaRectos').checked = options.showPermaRectos;
    let root = document.querySelector(':root');
    root.style.setProperty('--gridstep', options.step+'px');
    root.style.setProperty('--textMedium', (options.step/1.2)+'px');
    document.body.onkeydown = keyPressed;
    drawGrid();
    switchNight(false);

    let amount = int((window.innerWidth + window.innerHeight /2)*0.03);
    if (options.waterfall) {
        for(let i = 0; i < amount; i++){
            setTimeout(() => {
                autoPlay(false, 'box'+count, true);
            }, i*50);
        }
        setTimeout(() => {
            initializeDivPosition();
        }, 1000);
    }else{
        initializeDivPosition();
    }

    if (options.autoplay) {
        setInterval(() => {
            if (options.userPause) {
                autoPlay(false, 'box'+count, false);
            }
        }, 3000);

        setInterval(() => {
            options.userPause = true;
        }, 15000);
    }
}


function switchNight(swichValue){
    if (swichValue) {
        options.night = !options.night;
    }
    let root = document.querySelector(':root');
    if (options.night) {
        root.style.setProperty('--back', '#000');
        root.style.setProperty('--accent', '#FFF');
        options.validColor = [0, 255, 255];
        options.invalidColor = [255, 100, 50];
        options.gridColor = [170, 170, 170];
        options.fillOpacity = .2;
    }else{
        root.style.setProperty('--back', '#FFF');
        root.style.setProperty('--accent', '#000');
        //options.validColor = [0, 0, 255];
        //options.invalidColor = [255, 0, 0];
        options.validColor = [0, 120, 255];
        options.invalidColor = [255, 100, 0];
        options.gridColor = [options.validColor[0], options.validColor[1], options.validColor[2]];
        options.fillOpacity = .08;
    }
    for(let circle of document.getElementById('grid').children){
        circle.setAttributeNS(null, 'fill', 'rgb('+options.gridColor[0]+', '+options.gridColor[1]+', '+options.gridColor[2]+')');
    }
    root.style.setProperty('--valid', 'rgb('+options.validColor[0]+', '+options.validColor[1]+', '+options.validColor[2]+')');
    root.style.setProperty('--invalid', 'rgb('+options.invalidColor[0]+', '+options.invalidColor[1]+', '+options.invalidColor[2]+')');
    options.backgroundColor = getComputedStyle(document.body).getPropertyValue('--back');

}


function switchPermaRectos(){
    options.showPermaRectos = !options.showPermaRectos;
    let permaRectosWrapper = document.getElementById('permaRectos');
    for (let precto of permaRectosWrapper.children){
        if (options.showPermaRectos) {
            precto.setAttributeNS(null, 'fill-opacity', options.fillOpacity);
            precto.setAttributeNS(null, 'stroke-opacity', '1');
        }else{
            precto.setAttributeNS(null, 'fill-opacity', '0');
            precto.setAttributeNS(null, 'stroke-opacity', '0');
        }
    }
}


function optionsCheckbox(selOption) {
    for (let option in options) {
        if (selOption == option) {
            if (selOption == 'night') {
                switchNight(true);
            }else if (selOption == 'showPermaRectos'){
                switchPermaRectos();
            }else if (selOption == 'showGrid'){
                options[option] = !options[option];
                drawGrid();
            }else{
                options[option] = !options[option];
            }
        }
    }
}





// OTHERS //
function updateMouseXY(){
    if (options.snapToGrid) {
        m.x = snap(event.clientX);
        m.y = snap(event.clientY);
    }else{
        m.x = event.clientX;
        m.y = event.clientY;
    }
}


function snap(value) {
        let cell = Math.round((value - (options.step/2)) / options.step);
        return cell * options.step + (options.step/2);
}


function countBox(){
    count++
    if (count > boxes) {
        count = 1;
    }
}


function int(num){
    return Math.trunc(num);
}


function abs(num){
    return Math.abs(num);
}


function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function isOutCanvas(recto){
    let wdt = window.innerWidth;
    let hgt = window.innerHeight;
    return (recto.boundary.startx < 0 || recto.boundary.starty < 0 || recto.boundary.endx > wdt || recto.boundary.endy > hgt) ? recto.id : false;
}


function drawGrid(){
    let wrapper = document.getElementById('grid');
    wrapper.innerHTML = '';
    let wdt = window.innerWidth;
    let hgt = window.innerHeight;

    if (options.showGrid) {
        for(let i = 0; i <= wdt-options.step; i+=options.step){
            for(let j = 0; j <= hgt-options.step; j+=options.step){
                let circle = document.createElementNS(svgns, 'circle');
                circle.setAttributeNS(null, 'cx', i+(options.step/2));
                circle.setAttributeNS(null, 'cy', j+(options.step/2));
                circle.setAttributeNS(null, 'r', 1);
                if (options.night) {
                    circle.setAttributeNS(null, 'fill', 'rgb('+options.gridColor[0]+', '+options.gridColor[1]+', '+options.gridColor[2]+')');
                }else{
                    circle.setAttributeNS(null, 'fill', 'var(--valid');
                }
                wrapper.appendChild(circle);
            }
        }
    }

    for(let i = 0; i < hgt-options.step; i+=options.step){
        lasty = i-(options.step/2);
    }
}


function windowResized(){
    drawGrid();
    for(let i = 0; i < permaRectos.length; i++){
        let precto = permaRectos[i];
        if(isOutCanvas(precto)){
            permaRectos.splice(i, 1);
            document.getElementById('permaRectos').children[i].remove();
            autoPlay(true, isOutCanvas(precto), false);
        }
        
    }
}


function keyPressed(e){
    //e.preventDefault();
    if (e.code == 'KeyM') {
        options.showGrid = !options.showGrid;
        document.getElementById("op_showGrid").checked = !document.getElementById("op_showGrid").checked;
        drawGrid();
    }else if (e.code == 'KeyN') {
        switchNight(true);
        document.getElementById("op_night").checked = !document.getElementById("op_night").checked;
    }else if (e.code == 'KeyA') {
        autoPlay(false, 'box'+count, false);
    }else if (e.code == 'KeyB') {
        options.snapToGrid = !options.snapToGrid;
        document.getElementById("op_snapToGrid").checked = !document.getElementById("op_snapToGrid").checked;
    }else if (e.code == 'KeyV') {
        document.getElementById("op_showPermaRectos").checked = !document.getElementById("op_showPermaRectos").checked;
        switchPermaRectos();
    }else if (e.code == 'KeyC') {
        options.showLabel = !options.showLabel;
        document.getElementById("op_showLabel").checked = !document.getElementById("op_showLabel").checked;
    }else if (e.code == 'KeyZ') {
        triggerOptions();
    }
}

















