var FaceTo = pc.createScript('faceTo');

// initialize code called once per entity
FaceTo.prototype.initialize = function() {
    var cameras = this.app.root.find(function(node) {
        return node.camera; // player
    });
    this.camera = cameras[0];
    this.entity.on("onCollisionEnter", this.onEnter);
    this.entity.on("onCollisionLeave", this.onLeave);
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