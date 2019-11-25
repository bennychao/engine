var Halo = pc.createScript('halo');

Halo.attributes.add('speed', {
    type: 'number',
    default: 0.01
});

// initialize code called once per entity
Halo.prototype.initialize = function() {
    this.scale = 0.3;
    this.opacity = 1;
};

// update code called every frame
Halo.prototype.update = function(dt) {
    this.scale = pc.math.lerp(this.scale, 1.1, this.speed);
    
    if (this.scale > 1)
        this.scale = 0.3;
    
    this.entity.setLocalScale(this.scale, this.scale, 1);
    
    //this.opacity = pc.math.lerp(this.opacity, 0, this.opacity);
    
    this.entity.element.opacity = 1 - this.scale;
    
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Halo.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/