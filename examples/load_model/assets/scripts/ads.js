var Ads = pc.createScript('ads');

Ads.attributes.add('materialAsset', {
    type: 'asset'
});

Ads.attributes.add('speed', {
    type: 'vec2'
});

 Ads.tmp = new pc.Vec2();

// initialize code called once per entity
Ads.prototype.initialize = function() {
        // get the material that we will animate
    if (this.materialAsset) {
        this.material = this.materialAsset.resource;
    } 
};

// update code called every frame
Ads.prototype.update = function(dt) {
    var tmp = Ads.tmp;
    
    // Calculate how much to offset the texture
    // Speed * dt
    tmp.set(this.speed.x, this.speed.y);
    tmp.scale(dt);

    // Update the diffuse and normal map offset values
    this.material.diffuseMapOffset = this.material.diffuseMapOffset.add(tmp);
    this.material.normalMapOffset.add(tmp);
    this.material.update();
};

// swap method called for script hot-reloading
// inherit your script state here
// Ads.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/