var CameraPan = pc.createScript('cameraPan');

CameraPan.attributes.add("boxEntity", {type: "entity", title: "Box Entity"});
CameraPan.attributes.add("duration", {type: "number", default: 2, title: "Duration"});

// initialize code called once per entity
CameraPan.prototype.initialize = function() {
    // Get the camera in a state where it can start a camera pan
    this.time = this.duration + 1;

    this.startPosition = this.entity.getPosition().clone();
    this.targetPosition = this.entity.getPosition().clone();
};

// update code called every frame
CameraPan.prototype.update = function(dt) {
    this.time += dt;
    
    // Interpolate to the new camera position based on time passed since startPan was called
    var percent = this.time / this.duration;
    percent = pc.math.clamp(percent, 0, 1);
    
    var position = this.entity.getPosition();
    position.lerp(this.startPosition, this.targetPosition, percent);
    this.entity.setPosition(position);
    
    // Always look at the box
    this.entity.lookAt(this.boxEntity.getPosition());
};                                                                                                          

CameraPan.prototype.startPan = function() {
    // Check if the previous pan has finished
    if (this.time > this.duration) {
        this.time = 0;
        
        // Set the start and end positions for the pan
        this.startPosition.copy(this.entity.getPosition());
        this.targetPosition.copy(this.entity.getPosition());
        
        if (this.startPosition.z < 0) {
            this.targetPosition.z = 4;
        }
        else {
            this.targetPosition.z = -4;
        }
    }
};