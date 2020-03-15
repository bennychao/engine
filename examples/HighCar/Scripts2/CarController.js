
var CarController = pc.createScript('carController');

CarController.attributes.add('leftDoor', {
    type: 'entity',
    title: 'leftDoor Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});


CarController.attributes.add('rightDoor', {
    type: 'entity',
    title: 'rightDoor Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

CarController.attributes.add('leftDoorBtn', {
    type: 'entity',
    title: 'leftDoorBtn Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

CarController.attributes.add('rightDoorBtn', {
    type: 'entity',
    title: 'rightDoorBtn Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

CarController.attributes.add('topWinBtn', {
    type: 'entity',
    title: 'TopWinBtn Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

CarController.attributes.add('bodyInfo', {
    type: 'entity',
    title: 'BodyInfo Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

// initialize code called once per entity
CarController.prototype.initialize = function() {
    
    this.mainController = this.app.root.findByName("MainScreen");
    
    this.carBodies = this.entity.findByTag("body");
    
    this.carWheels = this.entity.findByTag("wheel");
    
   
    var cur = this;
    this.hint001 = this.bodyInfo.findByName("hint001");
    this.hint002 = this.bodyInfo.findByName("hint002");
    
    setTimeout(function () {
        cur.hint001.script.ui.changeData("专属19吋皇冠型铝合金轮毂");
        cur.hint001.script.ui.hideUI();
        
        cur.hint002.script.ui.changeData("专属立体网状格栅");
        cur.hint002.script.ui.hideUI();
         cur.bodyInfo.enabled = false;
    }, 100);
    
    this.leftDoorOpened = false;
    this.rightDoorOpened = false;
    //this.entity.script

    this.leftDoorBtn.findByName("Image").on("click", function(bDl){
        if (cur.leftDoorOpened)
            cur.closeLeftDoor();
        else
            cur.openLeftDoor();

        cur.leftDoorOpened = !cur.leftDoorOpened;        
    }, this);

    this.rightDoorBtn.findByName("Image").on("click", function(bDl){
        if (cur.rightDoorOpened)
            cur.closeRightDoor();
        else
            cur.openRightDoor();

        cur.rightDoorOpened = !cur.rightDoorOpened;        
    }, this);
    
    this.topWinBtn.findByName("Image").on("click", function(bDl){
        cur.mainController.script.mainController.showCurDetailUI();
    }, this);
    
    this.colorIndex = 0;
    
    this.bStart = false;
    
    this.InitEngine();
};

CarController.prototype.showBodyInfo = function() {
    this.bodyInfo.enabled = true;
    this.hint001.script.ui.showUI();
    this.hint002.script.ui.showUI();
};

CarController.prototype.hideBodyInfo = function() {
    this.bodyInfo.enabled = false;
     this.hint001.script.ui.showUI();
        this.hint002.script.ui.showUI();
};

CarController.prototype.changeColor = function() {
    var colors=new Array(new pc.Color(0.6, 0.1, 0.1), new pc.Color(0.0, 0.368, 0.6), new pc.Color(0.31, 0.31, 0.23));
    
    var cur = ++this.colorIndex % 3;
    this.carBodies.forEach(function(node){
        var material = node.model.model.meshInstances[0].material;
        if (material) {
            material.diffuse.set(colors[cur].r, colors[cur].g, colors[cur].b);
            material.update();
        }
    });
};

CarController.prototype.InitEngine = function() {
    //this.bodyInfo.enabled = false;
    //this.bStart = !this.bStart;
    
    
//     this.engineTween = new TWEEN.Tween(position).to({ y: 30 }, 300)
//         .onStart(function () {

//         })
//         .onUpdate(function () {
//             cur.rotateWheel(position.y);
//         })
//         .onStop(function () {
//             cur.rotateWheel(position.y);
//         })
//         .start();

};

CarController.prototype.startEngine = function() {
    var cur = this;
    
    if (cur.engineTween !== null && cur.engineTween !== undefined)
        cur.engineTween.stop();

    var position = { y: 0 };
    this.engineTween = new TWEEN.Tween(position).to({ y: 30 }, 300)
    .onStart(function () {

    })
    .onUpdate(function () {
        cur.rotateWheel(position.y);
    })
    .onStop(function () {
        cur.rotateWheel(position.y);
    })
    .start();
    
    setTimeout(() => {
        if (cur.bStart){
            cur.startEngine();
        }
    }, 301);
};

CarController.prototype.engine = function() {
    //this.bodyInfo.enabled = false;
    this.bStart = !this.bStart;
    
    if (this.bStart){
        this.startEngine();
    }
    else{
        this.engineTween.stop();
    }
};

CarController.prototype.rotateWheel = function(a) {
    this.carWheels.forEach(function(node){
        node.setLocalEulerAngles(a, 0, 0);
    });
};


CarController.prototype.openLeftDoor = function() {
    var position = { y: 0 };
    var cur = this;
    this.entity.sound.play('OpenSlot');
    var tweenA = new TWEEN.Tween(position).to({ y: 30 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            //cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            //cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

CarController.prototype.closeLeftDoor = function() {
    var position = { y: 30 };
    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: 0 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            //cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            //cur.showDetailSubItemsUI();
            cur.entity.sound.play('CloseSlot');
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

CarController.prototype.openRightDoor = function() {
    var position = { y: 0 };
    var cur = this;
    this.entity.sound.play('OpenSlot');
    var tweenA = new TWEEN.Tween(position).to({ y: 30 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            //cur.leftDoor.setLocalEulerAngles(0, position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            //cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

CarController.prototype.closeRightDoor = function() {
    var position = { y: 30 };
    var cur = this;
    
    var tweenA = new TWEEN.Tween(position).to({ y: 0 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            //cur.leftDoor.setLocalEulerAngles(0, position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            //cur.showDetailSubItemsUI();
            cur.entity.sound.play('CloseSlot');
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

CarController.prototype.openDoor = function() {
    var position = { y: 0 };
    var cur = this;
    this.entity.sound.play('OpenSlot');
    var tweenA = new TWEEN.Tween(position).to({ y: 30 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            //cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

CarController.prototype.closeDoor = function() {
    var position = { y: 30 };
    var cur = this;

    var tweenA = new TWEEN.Tween(position).to({ y: 0 }, 300)
        .onStart(function () {
            
        })
        .onUpdate(function () {
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event
            cur.leftDoor.setLocalEulerAngles(0, -position.y, 0);
            cur.rightDoor.setLocalEulerAngles(0, position.y, 0);
            cur.entity.sound.play('CloseSlot');
            //cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};


// update code called every frame
CarController.prototype.update = function(dt) {
    
};

