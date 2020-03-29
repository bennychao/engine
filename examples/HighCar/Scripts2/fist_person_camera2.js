var FirstPersonCamera = pc.createScript('firstPersonCamera');

FirstPersonCamera.attributes.add('speed', {
    type: 'number',
    default: 10
});

FirstPersonCamera.attributes.add('car1Entity', {type: 'entity', title: 'Car1 Entity'});
FirstPersonCamera.attributes.add('car2Entity', {type: 'entity', title: 'Car2 Entity'});

FirstPersonCamera.prototype.initialize = function () {
    // Camera euler angle rotation around x and y axes
    var eulers = this.entity.getLocalEulerAngles();
    this.ex = 0;//eulers.x;
    this.ey = 180;//eulers.y;
    
    this.ray = new pc.Ray();

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    var mouse = this.app.mouse;
    mouse.disableContextMenu();
    mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    this.aabbShape1 = new pc.BoundingBox(this.car1Entity.getPosition().clone(), this.car1Entity.getLocalScale().clone().scale(0.5));
    this.aabbShape2 = new pc.BoundingBox(this.car2Entity.getPosition().clone(), this.car2Entity.getLocalScale().clone().scale(0.5));
};
FirstPersonCamera.prototype.show = function (){
    var mouse = this.app.mouse;
    mouse.disableContextMenu();
    mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};
FirstPersonCamera.prototype.hide = function (){
    var mouse = this.app.mouse;
    mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};
FirstPersonCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);

    // Update the camera's position
    var keyboard = this.app.keyboard;
    var forwards  = keyboard.isPressed(pc.KEY_UP)   || keyboard.isPressed(pc.KEY_W);
    var backwards = keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S);
    var left  = keyboard.isPressed(pc.KEY_LEFT)  || keyboard.isPressed(pc.KEY_A);
    var right = keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D);

    if (forwards) {
        this.entity.translateLocal(0, 0, -this.speed*dt);
    } else if (backwards) {
        this.entity.translateLocal(0, 0, this.speed*dt);
    }

    if (left) {
        this.entity.translateLocal(-this.speed*dt, 0, 0);
    } else if (right) {
        this.entity.translateLocal(this.speed*dt, 0, 0);
    }
};

FirstPersonCamera.prototype.onMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    if (pc.Mouse.isPointerLocked()) {
        this.ex -= event.dy / 5;
        this.ex = pc.math.clamp(this.ex, -90, 90);
        this.ey -= event.dx / 5;
    } 
};

FirstPersonCamera.prototype.isInReturnBtn = function (event) {
    return (event.x < 100 && event.y < 100);
 
};

FirstPersonCamera.prototype.doRayCast1 = function (screenPosition) {
    // Initialise the ray and work out the direction of the ray from the a screen position
    this.entity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.entity.camera.farClip, this.ray.direction); 
    this.ray.origin.copy(this.entity.getPosition());
    this.ray.direction.sub(this.ray.origin).normalize();
    
    var result = this.aabbShape1.intersectsRay(this.ray, this.hitPosition);  
    return result;
};

FirstPersonCamera.prototype.doRayCast2 = function (screenPosition) {
    // Initialise the ray and work out the direction of the ray from the a screen position
    this.entity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.entity.camera.farClip, this.ray.direction); 
    this.ray.origin.copy(this.entity.getPosition());
    this.ray.direction.sub(this.ray.origin).normalize();
    
    var result = this.doRayCast2.intersectsRay(this.ray, this.hitPosition);  
    return result;
};


FirstPersonCamera.prototype.onMouseDown = function (event) {
    // When the mouse button is clicked try and capture the pointer
    if (!pc.Mouse.isPointerLocked() && !this.doRayCast1(new pc.Vec2(event.x, event.y)) && !this.doRayCast2(new pc.Vec2(event.x, event.y))) {
        this.app.mouse.enablePointerLock();
    }
    
    
};
