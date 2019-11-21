var Button = pc.createScript('button');

Button.attributes.add('hoverAsset', {
    type:'asset',
    assetType:'texture'
});

Button.attributes.add('activeAsset', {
    type:'asset',
    assetType:'texture'
});

Follow.attributes.add('onclickTarget', {
    type: 'entity',
    title: 'Target',
    description: 'The Entity to Handle On Click'
});

// initialize code called once per entity
Button.prototype.initialize = function() {
    // Get the original button texture
    this.originalTexture = this.entity.element.textureAsset;

    // Whether the element is currently hovered or not
    this.hovered = false;

    // mouse events
    this.entity.element.on('mouseenter', this.onEnter, this);
    this.entity.element.on('mousedown', this.onPress, this);
    this.entity.element.on('mouseup', this.onRelease, this);
    this.entity.element.on('mouseleave', this.onLeave, this);

    // touch events
    this.entity.element.on('touchstart', this.onPress, this);
    this.entity.element.on('touchend', this.onRelease, this);
};


// When the cursor enters the element assign the hovered texture
Button.prototype.onEnter = function (event) {
    this.hovered = true;
    event.element.textureAsset = this.hoverAsset;

    // set our cursor to a pointer
    document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
Button.prototype.onLeave = function (event) {
    this.hovered = false;
    event.element.textureAsset = this.originalTexture;

    // go back to default cursor
    document.body.style.cursor = 'default';
};

// When we press the element assign the active texture
Button.prototype.onPress = function (event) {
    event.element.textureAsset = this.activeAsset;
};

// When we release the element assign the original texture if
// we are not hovering or the hover texture if we are still hovering
Button.prototype.onRelease = function (event) {
    event.element.textureAsset = this.hovered ? this.hoverAsset : this.originalTexture;

    this.onclickTarget
};