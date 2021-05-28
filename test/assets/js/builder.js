class Recto {
    constructor(time, bottomright) {
        this.stepx;
        this.stepy;
        this.time = time;
        this.bottomright = bottomright;
        this.x1;
        this.y1;
        this.x2;
        this.y2;
        this.validity = false;
        this.target = {
            id: '',
            minx: 0,
            miny: 0
        };
        this.isDissolving = false;
        this.dissolveFactor = 0;
        this.label = null;
        this.boundary = {
            startx: 0,
            endx :0,
            starty: 0,
            endy: 0,
            width: 0,
            height: 0
        }
        this.isIntersecting = false;
    }



    intersect(rectoB) {
        let x1 = rectoB.boundary.startx;
        let y1 = rectoB.boundary.starty;
        let x2 = rectoB.boundary.endx;
        let y2 = rectoB.boundary.endy;
        if (this.boundary.startx > x1) {x1 = this.boundary.startx;}
        if (this.boundary.starty > y1) {y1 = this.boundary.starty;}
        if (this.boundary.endx < x2) {x2 = this.boundary.endx;}
        if (this.boundary.endy < y2) {y2 = this.boundary.endy;}
        return (x2 <= x1 || y2 <= y1) ? false : { x1: x1, y1: y1, x2: x2, y2: y2 };
    }



    checkIntersections(list){
        let startIndex = 0;
        if (list.length == boxes) {startIndex=1;}
        this.isIntersecting = false;
        for(let i = startIndex; i < list.length; i++){
            let otherRecto = list[i];
            let nRect = this.intersect(otherRecto);
            if (nRect) {
                this.isIntersecting = true;
                //fill(255, 0, 0);
                //rect(nRect.x1, nRect.y1, nRect.x2, nRect.y2);
            }
        }
    }



    checkValididy(list){
        if (this.boundary.width != this.boundary.pWdt || this.boundary.height != this.boundary.pHgt) {
            this.checkIntersections(list);
            //if (this.boundary.width > options.step*(this.target.minx-1) && this.boundary.height > options.step*(this.target.miny-1)) {
            if (this.boundary.width > options.step*(this.target.minx-1) && this.boundary.height > options.step*(this.target.miny-1) && !this.isIntersecting) {
                this.validity = true;
            }else{
                this.validity = false;
            }
        }
        this.updateValidityColor();
        this.boundary.pWdt = this.boundary.width;
        this.boundary.pHgt = this.boundary.height;
    }



    loadDivLimit(id){
        const elemnt = document.getElementById(id);
        this.target = {
            id: id,
            minx: elemnt.getAttribute('min-x'),
            miny: elemnt.getAttribute('min-y')
        };
    }



    setBoundary(){
        if (this.x1 <= this.x2) {
            this.boundary.startx = this.x1;
            this.boundary.endx = this.x2;
        }else{
            this.boundary.startx = this.x2;
            this.boundary.endx = this.x1;
        }
        if (this.y1 <= this.y2) {
            this.boundary.starty = this.y1;
            this.boundary.endy = this.y2;
        }else{
            this.boundary.starty = this.y2;
            this.boundary.endy = this.y1;
        }
        this.boundary.width = int(abs(this.boundary.endx - this.boundary.startx));
        this.boundary.height = int(abs(this.boundary.endy - this.boundary.starty));
    }



    setDivPosition(){
        const elemnt = document.getElementById(this.target.id);
        elemnt.style.top = this.boundary.starty+'px';
        elemnt.style.left = this.boundary.startx+'px';
        elemnt.style.width = this.boundary.width + 'px';
        elemnt.style.height = this.boundary.height + 'px';
    }



    setPoints(x1, y1, x2, y2){
        this.x1 = snap(x1);
        this.y1 = snap(y1);
        this.x2 = snap(x2);
        this.y2 = snap(y2);
    }



    setAutoPoints(){
        if (this.bottomright) {
            this.x1 = snap(int(random(0, width-(options.step*this.stepx))));
            this.y1 = snap(int(random(0, height-(options.step*this.stepy))));
        }else{
            this.x1 = snap(int(random(options.step*this.stepx, width-options.step)));
            this.y1 = snap(int(random(options.step*this.stepy, height-options.step)));
        }
        this.x2 = this.x1;
        this.y2 = this.y1;
    }



    setAutoSteps(){
        this.stepx = int(random(int(this.target.minx)+1, int(this.target.minx)*2));
        this.stepy = int(random(int(this.target.miny)+1, int(this.target.miny)*2));
    }



    setAutoBoundry(){
        this.boundary.width = options.step*(this.stepx-1);
        this.boundary.height = options.step*(this.stepy-1);
        if (!this.bottomright) {
            this.boundary.startx = this.x1 - this.boundary.width;
            this.boundary.starty = this.y1 - this.boundary.height;
            this.boundary.endx = this.x1;
            this.boundary.endy = this.y1;
        }else{
            this.boundary.startx = this.x1;
            this.boundary.starty = this.y1;
            this.boundary.endx = this.x1 + this.boundary.width;
            this.boundary.endy = this.y1 + this.boundary.height;
        }
        //console.log('Start X: '+this.boundary.startx+'\nStart Y: '+this.boundary.starty+'\nEnd X: '+this.boundary.endx+'\nEnd Y: '+this.boundary.endy+'\nStep X: '+this.stepx+'\nStep Y: '+this.stepy);
    }



    resizeContent(){
        let box = document.getElementById(this.target.id);
        let wdt = snap(box.children[0].offsetWidth)+options.step/2;
        let hgt = snap(box.children[0].offsetHeight)-options.step/2;
        if (!options.snapToGrid) {
            wdt = box.children[0].offsetWidth;
            hgt = box.children[0].offsetHeight;
        }
        setTimeout(() => {
            this.boundary.width = wdt;
            this.boundary.height = hgt;
            this.boundary.endx = this.boundary.startx + wdt;
            this.boundary.endy = this.boundary.starty + hgt;
            if (this.boundary.startx == this.x1) {this.x2 = this.boundary.endx;}
            else{this.x1 = this.boundary.endx;}
            if (this.boundary.starty == this.y1) {this.y2 = this.boundary.endy;}
            else{this.y1 = this.boundary.endy;}
        }, 1200);
    }



    updateLastPoint(x, y){
        this.x2 = snap(x);
        this.y2 = snap(y);
    }



    updateValidityColor(){
        if (this.validity) {
            fill(options.validColor[0], options.validColor[1], options.validColor[2], options.fillOpacity);
            stroke(options.validColor);
        }else{
            fill(options.invalidColor[0], options.invalidColor[1], options.invalidColor[2], options.fillOpacity);
            stroke(options.invalidColor);
        }
    }



    dissolve(){
        stroke(options.validColor[0], options.validColor[1], options.validColor[2], (255/60)*(60-this.dissolveFactor));
        fill(options.validColor[0], options.validColor[1], options.validColor[2], (options.fillOpacity/60)*(60-this.dissolveFactor));
        if (this.dissolveFactor != 'none') {
            this.dissolveFactor++;
        }
    }



    draw(){
        rect(this.x1, this.y1, this.x2, this.y2);
    }



    autoDraw(placeDiv){
        let refreshStep;
        if (this.stepx >= this.stepy) {
            refreshStep = this.stepx;
        }else{
            refreshStep = this.stepy;
        }

        for (let i = 1; i < this.stepx; i++){
            setTimeout(() => {
                if (this.bottomright) {
                    this.x2 = this.x1+(options.step*i);
                }else{
                    this.x2 = this.x1-(options.step*i);
                }
            }, this.time*i);
        }

        for (let i = 1; i < this.stepy; i++){
            setTimeout(() => {
                if (this.bottomright) {
                    this.y2 = this.y1+(options.step*i);
                }else{
                    this.y2 = this.y1-(options.step*i);
                }
            }, this.time*i);
        }

        for (let i = 1; i < refreshStep; i++){
            setTimeout(() => {
                this.setBoundary();
                this.moveLabel();
                //this.checkValididy();
                this.draw();
                if (i == refreshStep-1) {
                    this.deleteLabel();
                    if (placeDiv) {
                        this.setDivPosition();
                        this.resizeContent();
                    }
                    this.isDissolving = true;
                }
            }, this.time*i);

        }
    }



    createLabel(){
        const foreground = document.getElementById('foreground');
        this.label = document.createElement('span');
        this.label.classList.add('to_label');
        this.label.innerHTML = '0x0';
        this.label.style.top = (this.y1 - 20) + 'px';
        this.label.style.left = this.x1 + 'px';
        this.label.style.top = (this.y1 - 20) + 'px';
        this.label.setAttribute("label-id", int(random(0, 100)));
        foreground.appendChild(this.label);
    }



    moveLabel(){
        if (this.validity) {
            this.label.style.color = 'rgb('+options.validColor[0]+', '+options.validColor[1]+', '+options.validColor[2]+')';
        }else{
            this.label.style.color = 'rgb('+options.invalidColor[0]+', '+options.invalidColor[1]+', '+options.invalidColor[2]+')';
        }
        this.label.innerHTML = int(this.boundary.width/options.step)+'x'+int(this.boundary.height/options.step);
        this.label.style.top = (this.boundary.starty - 20) + 'px';
        this.label.style.left = this.boundary.startx + 'px';
    }



    deleteLabel(){
        this.label.remove();
    }


    isOutCanvas(){
        return (this.boundary.startx < 0 || this.boundary.starty < 0 || this.boundary.endx > width || this.boundary.endy > height) ? this.target.id : false;
    }



    drawVertex(radius){
        //let cx = int(this.boundary.startx+(this.boundary.width/2));
        //let cy = int(this.boundary.starty+(this.boundary.height/2));
        //ellipse(cx, cy, radius, radius);
        let v = {x1:this.x1, y1:this.y1, x2:this.x2, y2:this.y1, x3:this.x2, y3:this.y2, x4:this.x1, y4:this.y2};
        ellipse(v.x1, v.y1, radius);
        ellipse(v.x2, v.y2, radius);
        ellipse(v.x3, v.y3, radius);
        ellipse(v.x4, v.y4, radius);
    }















}