var Steer = pc.createScript('steer');
Steer.attributes.add('onSteerTarget', {
    type: 'entity',
    title: 'Target',
    description: 'The Entity to Handle On Click'
});


Steer.attributes.add("width", {type: "number", default: 200, description: 'Controls the movement speed'});
Steer.attributes.add("height", {type: "number", default: 200, description: 'Controls the movement speed'});

// initialize code called once per entity
Steer.prototype.initialize = function() {
    
    this.bSteering = false;
    var high = this.entity.parent.parent.screen.resolution.y - (this.height / 2);
    this.centerPos = new pc.Vec2(this.width / 2, high);
    this.curDir = new pc.Vec2(0,0);
    
    var mouse = this.app.mouse;
    mouse.disableContextMenu();
    //mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
    //mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
    mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this);

    this.entity.element.on("mousedown", this._onMouseDown, this);

    this.entity.element.on("mousemove", this._onMouseMove, this);
    this.entity.element.on("mouseup", this._onMouseUp, this);

    //this.entity.element.on("mouseleave", this._onMouseUp, this);

    this.targetLight = this.entity.findByName("target");   
    this.steerNode = this.entity.findByName("steer");
    
    //un register the events
    this.entity.on("destroy", function(){
        mouse.off();
        //this.entity.off();
    }, this);
};

// update code called every frame
Steer.prototype.update = function(dt) {
    if (this.bSteering && this.curDir.length() > 0)
    {
        this.onSteerTarget.fire("onSteer", this.curDir);

        var angle = this.angle(this.curDir);
        //rotate the highlight
        //var rm = new pc.Mat4().setFromAxisAngle(pc.Vec3.FORWARD, angle);

        var q = new pc.Quat();
        q.setFromAxisAngle(pc.Vec3.FORWARD, angle);
        
        //this.targetLight.rotateLocal(0, 0, angle);
        this.targetLight.setLocalRotation(q);

        this.steerNode.setLocalPosition(this.curDir.x, this.curDir.y, 0);
    }
    
};


Steer.prototype._onMouseDown = function (e) {

    this.bSteering = true;
    
    this.curDir = new pc.Vec2(e.x - this.centerPos.x, this.centerPos.y - e.y); //-y
    
    //.script.first_person_camera
    this.onSteerTarget.fire("onSteerStart");
    
    this.steerNode.setLocalPosition(this.curDir.x, this.curDir.y, 0);
};

Steer.prototype._onMouseMove = function (e) {

    //this.bSteering = true;
    
    if (this.bSteering)
    {
        this.curDir = new pc.Vec2(e.x - this.centerPos.x, this.centerPos.y - e.y); //-y
        
        if (this.curDir.length() > 75)
            {
                this.curDir.normalize();
                this.curDir.scale(75);
            }

        //this.onSteerTarget.fire("onSteerStart");

        this.steerNode.setLocalPosition(this.curDir.x, this.curDir.y, 0);
    }

};

Steer.prototype._onMouseUp = function (e) {

    this.bSteering = false;
    
    var q = new pc.Quat();
    q.setFromAxisAngle(pc.Vec3.BACK, 0);

    //this.targetLight.rotateLocal(0, 0, angle);
    this.targetLight.setLocalRotation(q);
    
    this.curDir = new pc.Vec2(0,0);
    this.onSteerTarget.fire("onSteerStop");
    
    this.steerNode.setLocalPosition(0, 0, 0);
};


Steer.prototype.angle = function (curDir) {
    var d = Math.acos(curDir.dot(pc.Vec2.UP) / curDir.length());
    var ret = d * 180 / Math.PI;
    if (curDir.x < 0)
        return 360 -ret;
    
    return ret;
    //pc.math.
};
// swap method called for script hot-reloading
// inherit your script state here
// Steer.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/