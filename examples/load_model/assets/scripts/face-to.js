var FaceTo = pc.createScript('faceTo');

FaceTo.attributes.add('drawOrder', {
    type: 'number',
    title: 'drawOrder',
    default: 1
});

// initialize code called once per entity
FaceTo.prototype.initialize = function() {
    var cur = this;
    var cameras = this.app.root.find(function(node) {
        return node.camera; // player
    });

    var subs = this.entity.find(function(node){
        return node.element;
    });

    // subs.forEach(element => {
    //     element.drawOrder = cur.drawOrder;
    // });

    this.camera = cameras[0];
    this.entity.on("onCollisionEnter", this.onEnter, this);
    this.entity.on("onCollisionLeave", this.onLeave, this);

    var curE = this.entity;
    var root = cur.entity.parent;

    if (this.drawOrder >=10){
        
        this.drawOrder = 2;
        setTimeout(function(){
            root.removeChild(curE);
            curE.enabled = false;
            curE = curE.clone();
            root.addChild(curE); 
             curE.enabled = true;
        }, 500);
    }
};

// update code called every frame
FaceTo.prototype.update = function(dt) {
    var pos = this.camera.getPosition().clone();
    
    pos.y = this.entity.getPosition().y;
    
    this.entity.lookAt(pos);
};

FaceTo.prototype.onEnter = function(dt) {
    
    if (this.entity.sprite != undefined || this.entity.sprite != null)
        {
            this.entity.sprite.opacity = 0;
        }
};    

FaceTo.prototype.onLeave = function(dt) {
        if (this.entity.sprite != undefined || this.entity.sprite != null)
        {
            this.entity.sprite.opacity = 1;
        }
    
};    

// swap method called for script hot-reloading
// inherit your script state here
// FaceTo.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/