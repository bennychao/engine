var FirstPersonCamera = pc.createScript('first_person_camera')

FirstPersonCamera.attributes.add('speed', {
    type: 'number',
    default: 10
});

FirstPersonCamera.prototype.initialize = function () {
    // Camera euler angle rotation around x and y axes
    var eulers = this.entity.getLocalEulerAngles()
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.force = new pc.Vec3();

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    var mouse = this.app.mouse;
    mouse.disableContextMenu();
    mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};

FirstPersonCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);

    // calculate force based on pressed keys
    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.force.x = pc.math.lerp(this.force.x, -this.speed, 0.1);
    } 

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.force.x = pc.math.lerp(this.force.x, this.speed, 0.1);
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP)) {
        this.force.z = pc.math.lerp(this.force.z, this.speed, 0.1);
    } 

    if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
        this.force.z = pc.math.lerp(this.force.z, -this.speed, 0.1);
    }

    var mat = this.entity.getWorldTransform();

    if (this.force.length()) {
        var pos = mat.transformPoint(this.force);
        var cur = this.entity.position;
        pos = pos.sub(cur);
        this.entity.translate(pos.x, 0, pos.z);
    }
    // // Update the camera's position
    // var keyboard = this.app.keyboard;
    // var forwards  = keyboard.isPressed(pc.KEY_UP)   || keyboard.isPressed(pc.KEY_W);
    // var backwards = keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S);
    // var left  = keyboard.isPressed(pc.KEY_LEFT)  || keyboard.isPressed(pc.KEY_A);
    // var right = keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D);

    // if (forwards) {
    //     this.entity.translateLocal(0, 0, -this.speed*dt);
    // } else if (backwards) {
    //     this.entity.translateLocal(0, 0, this.speed*dt);
    // }

    // if (left) {
    //     this.entity.translateLocal(-this.speed*dt, 0, 0);
    // } else if (right) {
    //     this.entity.translateLocal(this.speed*dt, 0, 0);
    // }


};

FirstPersonCamera.prototype.onMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    if (pc.Mouse.isPointerLocked()) {
        this.ex -= event.dy / 5;
        this.ex = pc.math.clamp(this.ex, -90, 90);
        this.ey -= event.dx / 5;
    }
};

FirstPersonCamera.prototype.onMouseDown = function (event) {
    // When the mouse button is clicked try and capture the pointer
    if (!pc.Mouse.isPointerLocked()) {
        this.app.mouse.enablePointerLock();
    }
};
