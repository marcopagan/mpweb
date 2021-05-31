class Recto {
    constructor(automatic) {
        this.x1;
        this.y1;
        this.x2;
        this.y2;
        this.rect;
        this.label;
        this.color;
        this.validity = false;
        this.isIntersecting = false;
        this.target = {
            id: '',
            minx: 0,
            miny: 0
        };
        this.boundary = {
            startx: 0,
            endx :0,
            starty: 0,
            endy: 0,
            width: 0,
            height: 0
        };
        if (automatic) {
            this.auto = {
                stepx: 0,
                stepy: 0,
                time: int(random(50, 150)),
                topleft: int(random(0, 1))
            };
        };
    }



    /* LABEL */
    createLabel(){
        const foreground = document.getElementById('foreground');
        this.label = document.createElement('span');
        this.label.classList.add('to_label');
        this.label.innerHTML = '0x0';
        this.label.style.top = (this.y1 - 20) + 'px';
        this.label.style.left = this.x1 + 'px';
        this.label.style.top = (this.y1 - 20) + 'px';
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





    /* SVG */
    createSvg(x, y, domID){
        this.x1 = x;
        this.y1 = y;
        this.rect = document.createElementNS(svgns, 'rect');
        this.rect.setAttributeNS(null, 'x', x);
        this.rect.setAttributeNS(null, 'y', y);
        //this.rect.setAttributeNS(null, 'rx', '5');
        //this.rect.setAttributeNS(null, 'ry', '5');
        this.rect.setAttributeNS(null, 'fill-opacity', options.fillOpacity);
        this.rect.setAttributeNS(null, 'stroke-opacity', '1');
        document.getElementById(domID).appendChild(this.rect);
    }

    removeSvg(){
        this.rect.remove();
    }





    /* COORDINATES */
    setPoints(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    updatePoints(x, y){
        this.x2 = x;
        this.y2 = y;
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

    resizeContent(){
        let box = document.getElementById(this.target.id);
        let wdt = snap(box.children[0].offsetWidth)+options.step/2;
        let hgt = snap(box.children[0].offsetHeight)-options.step/2;
        if (!options.snapToGrid) {
            wdt = box.children[0].offsetWidth;
            hgt = box.children[0].offsetHeight;
        }
            this.boundary.width = wdt;
            this.boundary.height = hgt;
            this.boundary.endx = this.boundary.startx + wdt;
            this.boundary.endy = this.boundary.starty + hgt;
            if (this.boundary.startx == this.x1) {this.x2 = this.boundary.endx;}
            else{this.x1 = this.boundary.endx;}
            if (this.boundary.starty == this.y1) {this.y2 = this.boundary.endy;}
            else{this.y1 = this.boundary.endy;}
    }





    /* ASPECT */
    updateColor(){
        if (this.validity) {
            this.color = 'rgb('+options.validColor[0]+', '+options.validColor[1]+', '+options.validColor[2]+')';
        }else{
            this.color = 'rgb('+options.invalidColor[0]+', '+options.invalidColor[1]+', '+options.invalidColor[2]+')';
        }
        this.rect.setAttributeNS(null, 'fill', this.color);
        this.rect.setAttributeNS(null, 'stroke', this.color);
    }

    updateSVG(){
        this.rect.setAttributeNS(null, 'x', this.boundary.startx);
        this.rect.setAttributeNS(null, 'y', this.boundary.starty);
        if (this.boundary.width == 0) {
            this.rect.setAttributeNS(null, 'width', '1');
        }else{
            this.rect.setAttributeNS(null, 'width', this.boundary.width);
        }
        if (this.boundary.height == 0) {
            this.rect.setAttributeNS(null, 'height', '1');
        }else{
            this.rect.setAttributeNS(null, 'height', this.boundary.height);
        }
    }

    dissolve(){
        this.rect.setAttribute('fill-opacity', '0');
        this.rect.setAttribute('stroke-opacity', '0');
    }





    /* VALIDITY (LIMITS AND INTERSECTIONS) */
    loadDivLimit(id){
        const elemnt = document.getElementById(id);
        this.target = {
            id: id,
            minx: elemnt.getAttribute('min-x'),
            miny: elemnt.getAttribute('min-y')
        };
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
        if (list.length == boxes) {startIndex=1}
        this.isIntersecting = false;
        for(let i = startIndex; i < list.length; i++){
            let otherRecto = list[i];
            let nRect = this.intersect(otherRecto);
            if (nRect) {
                this.isIntersecting = true;
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
        this.updateColor();
        this.boundary.pWdt = this.boundary.width;
        this.boundary.pHgt = this.boundary.height;
    }





    /* POSITIONING */
    setDivPosition(){
        const elemnt = document.getElementById(this.target.id);
        elemnt.style.top = this.boundary.starty+'px';
        elemnt.style.left = this.boundary.startx+'px';
        elemnt.style.width = this.boundary.width + 'px';
        elemnt.style.height = this.boundary.height + 'px';
    }





    /* AUTO */
    setAutoSteps(){
        this.auto.stepx = int(random(int(this.target.minx), int(this.target.minx)*2));
        this.auto.stepy = int(random(int(this.target.miny), int(this.target.miny)*2));
    }

    setAutoPoints(){
        let wdt = window.innerWidth;
        let hgt = window.innerHeight;
        if (this.auto.topleft) {
            this.x1 = int(random(0, wdt-(options.step*this.auto.stepx)));
            this.y1 = int(random(0, hgt-(options.step*this.auto.stepy)));
        }else{
            this.x1 = int(random(options.step*this.auto.stepx, wdt-options.step));
            this.y1 = int(random(options.step*this.auto.stepy, hgt-options.step));
        }
        if (options.snapToGrid) {
            this.x1 = snap(this.x1);
            this.y1 = snap(this.y1);
        }
        this.x2 = this.x1;
        this.y2 = this.y1;
    }

    setAutoBoundry(){
        this.boundary.width = options.step*(this.auto.stepx);
        this.boundary.height = options.step*(this.auto.stepy);
        if (this.auto.topleft) {
            this.boundary.startx = this.x1;
            this.boundary.starty = this.y1;
            this.boundary.endx = this.x1 + this.boundary.width;
            this.boundary.endy = this.y1 + this.boundary.height;
        }else{
            this.boundary.startx = this.x1 - this.boundary.width;
            this.boundary.starty = this.y1 - this.boundary.height;
            this.boundary.endx = this.x1;
            this.boundary.endy = this.y1;
        }
    }

    autoUpdateSVG(){
        if (this.auto.topleft) {
            this.rect.setAttributeNS(null, 'x', this.x1);
            this.rect.setAttributeNS(null, 'y', this.y1);
        }else{
            this.rect.setAttributeNS(null, 'x', this.x2);
            this.rect.setAttributeNS(null, 'y', this.y2);
        }
        this.rect.setAttributeNS(null, 'width', abs(this.x1 - this.x2));
        this.rect.setAttributeNS(null, 'height', abs(this.y1 - this.y2));
    }

    autoCheckValididy(){
        let wdt = abs(this.x1 - this.x2);
        let hgt = abs(this.y1 - this.y2);
        if (wdt > options.step*(this.target.minx-1) && hgt > options.step*(this.target.miny-1)) {
            this.validity = true;
        }else{
            this.validity = false;
        }
        this.updateColor();
    }

    autoMoveLabel(){
        if (this.validity) {
            this.label.style.color = 'rgb('+options.validColor[0]+', '+options.validColor[1]+', '+options.validColor[2]+')';
        }else{
            this.label.style.color = 'rgb('+options.invalidColor[0]+', '+options.invalidColor[1]+', '+options.invalidColor[2]+')';
        }
        let wdt = abs(this.x1 - this.x2);
        let hgt = abs(this.y1 - this.y2);
        this.label.innerHTML = int(wdt/options.step)+'x'+int(hgt/options.step);
        if (this.auto.topleft) {
            this.label.style.top = (this.y1 - 20) + 'px';
            this.label.style.left = this.x1 + 'px';
        }else{
            this.label.style.top = (this.y2 - 20) + 'px';
            this.label.style.left = this.x2 + 'px';
        }
    }

    autoDraw(placeDiv){
        let refreshStep;
        if (this.auto.stepx >= this.auto.stepy) {
            refreshStep = this.auto.stepx;
        }else{
            refreshStep = this.auto.stepy;
        }


        for (let i = 1; i < this.auto.stepx+1; i++){
            setTimeout(() => {
                if (this.auto.topleft) {
                    this.x2 = this.x1+(options.step*i);
                }else{
                    this.x2 = this.x1-(options.step*i);
                }
            }, this.auto.time*i);
        }

        for (let i = 1; i < this.auto.stepy+1; i++){
            setTimeout(() => {
                if (this.topleft) {
                    this.y2 = this.y1+(options.step*i);
                }else{
                    this.y2 = this.y1-(options.step*i);
                }
            }, this.auto.time*i);
        }

        for (let i = 1; i < refreshStep+1; i++){
            setTimeout(() => {
                if (options.showLabel) {this.moveLabel()}
                this.autoCheckValididy();
                this.autoUpdateSVG();
                this.autoMoveLabel();
                if (i == refreshStep-1) {

                    if (placeDiv) {
                        this.setDivPosition();
                        setTimeout(() => {
                            pushToPermaRectos(this);
                            refreshPermaRectos();
                            cleanPermaRectos();
                        }, this.auto.time);
                    }

                    this.dissolve();
                    setTimeout(() => {
                        this.removeSvg();
                    }, 1000);
                    if (options.showLabel) {this.deleteLabel()}
                    liveRectos.splice(liveRectos.length-1, 1);


                }
            }, this.auto.time*i);

        }
        
    }





}