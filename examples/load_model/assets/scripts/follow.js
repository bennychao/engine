var Follow = pc.createScript('follow');

Follow.attributes.add('target', {
    type: 'entity',
    title: 'Target',
    description: 'The Entity to follow'
});

Follow.attributes.add('distance', {
    type: 'number',
    default: 4,
    title: 'Distance',
    description: 'How far from the Entity should the follower be'
});

// initialize code called once per entity
Follow.prototype.initialize = function() {
    this.vec = new pc.Vec3();
};

// update code called every frame
Follow.prototype.update = function(dt) {
    if (!this.target) return;

    // get the position of the target entity
    var pos = this.target.getPosition();

    // calculate the desired position for this entity
    pos.x += 0.75 * this.distance;
    pos.y += 1.0 * this.distance;
    pos.z += 0.75 * this.distance;

    // smoothly interpolate towards the target position
    this.vec.lerp(this.vec, pos, 0.1);

    // set the position for this entity
    this.entity.setPosition(this.vec); 

    var x = 0;
    var y = 0;
    var entity = this.entity;
    
    app.mouse.on('mouseup', function (event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) {
        x = event.x;
        y = event.y;

        //entity.setLocalEulerAngles(0, 0.2*x, 0);
        // Get the start and end points of a 3D ray fired from a screen click position
        var start = entity.camera.screenToWorld(x, y, entity.camera.nearClip);
        var end = entity.camera.screenToWorld(x, y, entity.camera.farClip);

        // Use the ray coordinates to perform a raycast
        app.systems.rigidbody.raycastFirst(start, end, function (result) {
            console.log("Entity " + result.entity.name + " was selected");
        });
    }
    });
};
