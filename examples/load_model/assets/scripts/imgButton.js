var ImgButton = pc.createScript('imgButton');

ImgButton.attributes.add('hoverColor', {
    type: 'rgba',
    title: 'hoverColor' 
});


ImgButton.attributes.add('clickColor', {
    type: 'rgba',
    title: 'clickColor'  
});

// initialize code called once per entity
ImgButton.prototype.initialize = function() {
    
    if (this.entity.element.type ==pc.ELEMENTTYPE_IMAGE){
        this.imageEl = this.entity.element;
    }
    else{
        this.imageEl = this.entity.children.find(function (node){
           return node.element && node.element.type ==  pc.ELEMENTTYPE_IMAGE;
        }).element;
    }
    
    if (this.imageEl){
        this.oldColor = this.imageEl.color.clone();
    }
    
    
    this.entity.element.on("mousedown", this._onMouseDown, this);    
    this.entity.element.on("mouseup", this._onMouseUp, this);
    
    
    this.entity.element.on("mouseenter", this._onMouseEnter, this);    
    this.entity.element.on("mouseleave", this._onMouseLeave, this);
};

// update code called every frame
ImgButton.prototype.update = function(dt) { 
    
};


ImgButton.prototype._onMouseDown = function (e) {
    this.curPos = new pc.Vec2(e.x, e.y);
    
    if (this.imageEl){
        this.imageEl.color = this.clickColor;

    }
};


ImgButton.prototype._onMouseUp = function (e) {
    var cur = new pc.Vec2(e.x, e.y);
    
    cur.sub(this.curPos);
    
    if (cur.lengthSq() < 0.01){
        //click
        this.entity.fire("click", this.entity);

    }
    
    if (this.imageEl){
        this.imageEl.color = this.oldColor;
    }
};

ImgButton.prototype._onMouseEnter = function (e) {
    
    if (this.imageEl){
        this.imageEl.color = this.hoverColor;
    }
};

ImgButton.prototype._onMouseLeave = function (e) {
    if (this.imageEl){
        this.imageEl.color = this.oldColor;
    }
};


// swap method called for script hot-reloading
// inherit your script state here
// ImgButton.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/