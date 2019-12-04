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
    
    this.entity.element.on("mouseleave", this._onMouseUp, this);
    
    this.curAngle = 0;
    
    this.dragging = false;
    
    var json = this.texJsonAsset.resources;
    
    this.texs = new Array();
    

    
    var cur = this;
    
    var carName = cur.entity.parent.name;
    
    json.forEach(function (node){
        
        var asset = cur.app.assets.find(node.tex);
        cur.texs.push({asset:asset, angle:node.angle});
    });
    
    var carConfig = cars.find(function (c){
        return c.name == carName; //cur.entity.parent.name;
    });
    
    
    //set the Car image and logo
    var img = this.app.root.findByName(carName + "_image"); //for car's image id
    
    if (img){
        singleMainScene.getAsset(carConfig.image, "texture", function(asset){
            var material = new pc.StandardMaterial();
            material.diffuseMap = asset.resource;
            //material.diffuse = new pc.Color(1,1,0);
            material.update();  

            img.model.model.meshInstances[0].material = material;
        });
    
    }

    var logo = this.entity.findByName(carName + "_logo"); //for car's image id
    
    if (logo){
        singleMainScene.getAsset(carConfig.logo, "texture", function(asset){
            var material = new pc.StandardMaterial();
            material.diffuseMap = asset.resource;
            //material.diffuse = new pc.Color(1,1,0);
            material.update();  

            logo.model.model.meshInstances[0].material = material;
        });
    
    }
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
    
    this.curPos = new pc.Vec2(e.x, e.y);
};

Car.prototype._onMouseMove = function (e) {
    
    if (this.dragging)   
    {
        this.curAngle -= e.dx * this.offset;
        this.curAngle  += 360;
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
    
    var cur = new pc.Vec2(e.x, e.y);
    
    cur.sub(this.curPos);
    
    if (cur.lengthSq() < 0.01){
        //click
        //this.entity.fire("click", this.entity);
        
        this.autoShow();
        this.showHint();
    }
};

Car.prototype.autoShow = function () {

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

Car.prototype.showHint = function (e) {

    this.entity.findByName("hint1").script.ui.enabled = true;
    this.entity.findByName("hint1").script.ui.uiItem.string = "Test 001 1.1W !!";
    
    this.entity.findByName("hint2").script.ui.enabled = true;
    this.entity.findByName("hint2").script.ui.uiItem.string = "Test 001 1.1W !!";
    
    
    var cur = this;
    setTimeout(function () {
        cur.hideHint();
    }, 3000);
};

Car.prototype.hideHint = function (e) {

    this.entity.findByName("hint1").script.ui.enabled = false;
    this.entity.findByName("hint2").script.ui.enabled = false;
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