// The mouse API can be found at http://developer.playcanvas.com/en/api/pc.Mouse.html
var DetectDoubleClick = pc.createScript('detectDoubleClick');

DetectDoubleClick.attributes.add("cameraEntity", {type: "entity", title: "CameraEntity"});
DetectDoubleClick.attributes.add("doubleClickSpeed", {type: "number", default: 0.5, title: "Double Click Speed", 
    description: "The maximum time (secs) allowed between clicks to register as a double click"});

// initialize code called once per entity
DetectDoubleClick.prototype.initialize = function() {
    // Set the timeSinceLastClick to be outside the time window for a double click so the user's first click
    // in the app won't be registered as double click
    this.timeSinceLastClick = this.doubleClickSpeed;  
};

// update code called every frame
DetectDoubleClick.prototype.update = function(dt) {
    // Always add time since last frame to timeSinceLastClick so we know when the user has 
    // clicked last
    
    this.timeSinceLastClick += dt;
    
    if (this.app.mouse.wasPressed(pc.MOUSEBUTTON_LEFT)) {
        // Check if user has previously clicked within the time window to be registered as a double click
        if (this.timeSinceLastClick < this.doubleClickSpeed) {
            // User has double clicked so let's perform an action
            this.onDoubleClick();
            
            // We should also set the timeSinceLastClick to be outside the time window so their third click
            // won't accidently be registered as a double click
            
            this.timeSinceLastClick = this.doubleClickSpeed;  
        }
        else {
            // Reset timeSinceLastClick if the click was done after the time allowed for a double
            // click to register
            this.timeSinceLastClick = 0;
        }
    }
};

DetectDoubleClick.prototype.onDoubleClick = function() {
    var cameraPanScript = this.cameraEntity.script.cameraPan;
    cameraPanScript.startPan();
};
