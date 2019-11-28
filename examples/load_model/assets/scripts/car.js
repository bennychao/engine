var Car = pc.createScript('car');

Car.attributes.add('offset', {
    type: 'number',
    default: 2
});

Car.attributes.add('texJsonAsset', {
    type: 'asset'
});

Car.attributes.add('speed', {
    type: 'number',
    default: 3
});


// initialize code called once per entity
Car.prototype.initialize = function() {
    var cameras = this.app.root.find(function(node) {
        return node.camera; // player
    });
    this.camera = cameras[0];
    this.entity.on("onCollisionEnter", this.onEnter);
    this.entity.on("onCollisionLeave", this.onLeave);
    
    
    this.entity.element.on("mousedown", this._onMouseDown, this);

    this.entity.element.on("mousemove", this._onMouseMove, this);
    this.entity.element.on("mouseup", this._onMouseUp, this);
    
    this.curAngle = 0;
    
    this.dragging = false;
    
    var json = this.texJsonAsset.resources;
    
    this.texs = new Array();
    
    var cur = this;
    json.forEach(function (node){
        
        var asset = cur.app.assets.find(node.tex);
        cur.texs.push({asset:asset, angle:node.angle});
    });
};

// update code called every frame
Car.prototype.update = function(dt) {
    var pos = this.camera.getPosition().clone();
    
    pos.y = this.entity.getPosition().y;
    
    this.entity.parent.lookAt(pos);
};

Car.prototype.onEnter = function(dt) {
    
    if (this.entity.sprite != undefined || this.entity.sprite != null)
        {
            this.entity.sprite.opacity = 0;
        }
};    

Car.prototype.onLeave = function(dt) {
        if (this.entity.sprite != undefined || this.entity.sprite != null)
        {
            this.entity.sprite.opacity = 1;
        }
    
};  

Car.prototype._onMouseDown = function (e) {
    this.dragging = true;
    this.camera.fire("onSteerStart", null);
};

Car.prototype._onMouseMove = function (e) {
    
    if (this.dragging)   
    {
        this.curAngle -= e.dx * this.offset + 360;
        this.curAngle %= 360;        
        //rotate the car
        //
        var asset = this.findTex(this.curAngle);
        var e = this.entity.children[0].element;
        e.textureAsset = asset;
    }

};

Car.prototype._onMouseUp = function (e) {
    this.dragging = false;
    this.camera.fire("onSteerStop", null);
    
};

Car.prototype.autoShow = function (e) {

    var car = this;
    var timesRun = 0;
    
    var interval = setInterval(function(){

        car.curAngle = 10;
        car.curAngle %= 360;  
        var asset = this.findTex(this.curAngle);
        var e = this.entity.children[0].element;
        e.textureAsset = asset;
        
        timesRun += 1;
        if(timesRun === 36){    

            clearInterval(interval);    

        }

        //do whatever here..

    }, car.speed);
};

Car.prototype.findTex = function (angle) {
    
    var ar = this.texs.find(function(elem){

        return elem.angle >= angle;

    });
    
    if (ar == undefined || ar == null)
        {
            return this.texs[0].asset;
        }
    
    return ar.asset;
};

// swap method called for script hot-reloading
// inherit your script state here
// Car.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/