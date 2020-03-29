var Raycast = pc.createScript('raycast');

Raycast.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
Raycast.attributes.add('factor', {
    type: 'number',
    default: 10
});
// initialize code called once per entity
Raycast.prototype.initialize = function() {
    // More information about pc.ray: http://developer.playcanvas.com/en/api/pc.Ray.html
    this.ray = new pc.Ray();
    
    // Register the mouse down and touch start event so we know when the user has clicked
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    this.app.mouse.on(pc.EVENT_MOUSE, this.onMouseDown, this);
    
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
    }
    
    this.hitPosition = new pc.Vec3();
    
    this.bMouseDown = false;
    
    // More information about pc.BoundingBox: http://developer.playcanvas.com/en/api/pc.BoundingBox.html
    this.aabbShape = new pc.BoundingBox(this.entity.getPosition().clone(), this.entity.getLocalScale().clone().scale(0.5));
};


Raycast.prototype.doRayCast = function (screenPosition) {
    // Initialise the ray and work out the direction of the ray from the a screen position
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.farClip, this.ray.direction); 
    this.ray.origin.copy(this.cameraEntity.getPosition());
    this.ray.direction.sub(this.ray.origin).normalize();
    
    var result = this.aabbShape.intersectsRay(this.ray, this.hitPosition);        
    if (result) {
        //this.hitMarkerEntity.setPosition(this.hitPosition);
        bMouseDown = true;
    }  
};


Raycast.prototype.onMouseDown = function(event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) {
        this.doRayCast(event);
    }
};

Raycast.prototype.onMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    if (bMouseDown) {
        var x = this.entity.getLocalEulerAngles().y;
        x += factor * event.dx;
        this.entity.setLocalEulerAngles(0, x, 0);
    }
};

Raycast.prototype.onMouseUp = function (event) {
    // Update the current Euler angles, clamp the pitch.
    if (bMouseDown) {
        bMouseDown  = false;
    }
};



Raycast.prototype.onTouchStart = function (event) {
    // On perform the raycast logic if the user has one finger on the screen
    if (event.touches.length == 1) {
        this.doRayCast(event.touches[0]);
        
        // Android registers the first touch as a mouse event so it is possible for 
        // the touch event and mouse event to be triggered at the same time
        // Doing the following line will prevent the mouse down event from triggering
        event.event.preventDefault();
    }    
};