var Movement = pc.createScript('movement');

Movement.attributes.add('speed', {
    type: 'number',    
    default: 0.1,
    min: 0.05,
    max: 0.5,
    precision: 2,
    description: 'Controls the movement speed'
});

// initialize code called once per entity
Movement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    
};

// update code called every frame
Movement.prototype.update = function(dt) {
    // var forceX = 0;
    // var forceZ = 0;

    // calculate force based on pressed keys
    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.force.x = pc.math.lerp(this.force.x, -this.speed, 0.1);
    } 

    if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.force.x = pc.math.lerp(this.force.x, this.speed, 0.1);
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP)) {
        this.force.y = pc.math.lerp(this.force.y, this.speed, 0.1);
    } 

    if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
        this.force.y = pc.math.lerp(this.force.y, -this.speed, 0.1);
    }

    // if we have some non-zero force
    if (this.force.length()) {
        this.entity.forward
        // calculate force vector
        // var rX = Math.cos(-Math.PI * 0.25);
        // var rY = Math.sin(-Math.PI * 0.25);
        // this.force.set(this.force.x * rX - this.force.z * rY, 0, this.force.z * rX + this.force.x * rY);

        // // clamp force to the speed
        // if (this.force.length() > this.speed) {
        //     this.force.normalize().scale(this.speed);
        // }
    }
    //this.entity.find("test");
    // apply impulse to move the entity
    //this.entity.rigidbody.applyImpulse(this.force);
};
