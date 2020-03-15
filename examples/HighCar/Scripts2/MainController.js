function animate() {

    requestAnimationFrame(animate); // requestAnimationFrame可以看成setTimeout(animate, 17)

    TWEEN.update(); // 每隔一段时间，update方法会调用上面的onUpdate函数，这样让left变化，小球位置也变化

}    

//  animate();

var MainController = pc.createScript('mainController');

MainController.attributes.add('cameraEntity', {
    type: 'entity',
    title: 'Camera Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

MainController.attributes.add('carEntity', {
    type: 'entity',
    title: 'Car Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

MainController.attributes.add('innerEntity', {
    type: 'entity',
    title: 'inner Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

MainController.attributes.add('spaceEntity', {
    type: 'entity',
    title: 'Space Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});



// initialize code called once per entity
MainController.prototype.initialize = function() {
    
     animate();
    
    this.carController = this.app.root.findByName("CarModel");
    
    this.curDetailUIHeight = 200;
    this.initControlUIs();
    this.initFunctionsUIs();
    this.initDetailUIs();
    
    this.status = 1;
    
    //inti return button
    //
    this.returnButton = this.entity.findByName("ReturnButton");
    
    var cur = this;
    this.returnButton.on("click", function(bDl){
       
        cur.return();
        
    }, this);
    
    this.returnButton.enabled = false;
};

// update code called every frame
MainController.prototype.update = function(dt) {
    
};
  
MainController.prototype.return = function(dt) {
    switch(this.status){
        case 1: //show functions status
            this.hideFunctionsUIs();

            this.returnButton.enabled = false;
            break;
            
        case 2: //show inner status
            //this.hideFunctionsUIs();
            var orbitCamera = this.cameraEntity.script.orbitCamera;
            orbitCamera.resetAndLookAtEntity(12, this.carEntity);
            this.returnButton.enabled = false;
            orbitCamera.enabled = true;
            var firstCamera = this.cameraEntity.script.firstPersonCamera;
             firstCamera.enabled = false;
            firstCamera.hide();
            break;
    }
};


// init MainController
MainController.prototype.initControlUIs = function() {
    var cur = this;
    //init cars detail UI
    this.carDetailUI = this.entity.findByName("MainController");

    //set the uiItem's text
    var uiItems = this.carDetailUI.find(function (node) {
        return node.script && node.script.has('ui'); // player
    });
    
    this.uiItems = uiItems;
    
    this.buttons = this.carDetailUI.find(function (node){
        return node.script && node.script.has('imgButton'); // player
    });
    
    this.carDetailPosY = this.carDetailUI.getLocalPosition().y;

    var rect = calculateElementPos(this.carDetailUI.element);
    
    
    var newH = rect.z * 0.21;
    
    this.curDetailUIHeight = newH;
    
    var screenH = this.entity.screen.resolution.y;
    //left, bottom, right and top
    //set the Vec4 anchor 's top
    
    var an = this.carDetailUI.element.anchor;
    
    //an.w = an.y +  (newH / screenH); 
    
    var centerY = an.y + ((rect.w / screenH)/ 2);
    an.w = centerY +  (newH / screenH / 2);
    an.y = centerY -  (newH / screenH / 2);

    //this.carDetailUI.element.height = newH;
    //
    var menus = [{name:"场景"}, {name:"体验"}, {name:"参数"}, {name:"空间"}, {name:"内饰"}];

    var count = 0;

//         cur.entity.on("changeData", function(){
            
//         }, cur);



    setTimeout(function () {
         uiItems.forEach(function (node) {
            node.fire("changeData", menus[count++].name);
        });
    }, 500);

    //this.carDetailUI.enabled = false; 
    
    var cur = this;
    this.buttons.forEach(function (btn){
        
        btn.on("click", function(bDl){
           cur.onClickDetail(bDl);
        }, this);

    });  


    this.entity.removeChild(this.carDetailUI);
  
    this.entity.addChild(this.carDetailUI);  
};

MainController.prototype.initDetailUIs = function() {
    this.showDetailUI = this.entity.findByName("CarDetail");

    this.closeDetailButton = this.entity.findByName("closeDetailButton");

    this.closeUiItems = this.showDetailUI.find(function (node) {
        return node.script && node.script.has('ui'); // player
    });


    var cur = this;
    cur.showDetailUI.enabled = false;
    cur.closeUiItems.forEach(function(node){
        node.script.ui.hideUI();
    });
    
    this.closeDetailButton.on("click", function(bDl){
       
        //cur.return();
        cur.showDetailUI.enabled = false;
        cur.closeUiItems.forEach(function(node){
            node.script.ui.hideUI();
        });
    }, this);
    
    //this.returnButton.enabled = false;
};

MainController.prototype.showCurDetailUI = function() {
    //cur.return();
    this.showDetailUI.enabled = true;
    this.closeUiItems.forEach(function(node){
        node.script.ui.showUI();
    });
    //this.returnButton.enabled = false;
};

MainController.prototype.onClickDetail = function (btn){
    var orbitCamera = this.cameraEntity.script.orbitCamera;
    
           switch (btn.name){
           case "Item1":    
                //switch Scene
                //singleMainScene.loadScene(SubSceneId, null);
                //this.showVRframe();  
                this.carController.script.carController.hideBodyInfo();
                break;
           case "Item2": 
                // functions
                // show  detail 
                // this.showFeature2();
                this.carController.script.carController.hideBodyInfo();
                this.showFunctionsUIs();
                this.returnButton.enabled = true;
                break;
           case "Item3":
               // show detail data
                this.carController.script.carController.showBodyInfo();
                orbitCamera.resetAndLookAtEntity(12, this.carEntity);
                this.return();
                break;
                   
           case "Item4":
                // this.showFeature3();
                // show space
                this.carController.script.carController.hideBodyInfo();
                orbitCamera.resetAndLookAtEntity(3, this.spaceEntity);
                orbitCamera.yawAngleMax = orbitCamera.yaw + 10;
                orbitCamera.yawAngleMin = orbitCamera.yaw - 10;
                this.return();
                break;
                   
           case "Item5":  
                // this.showFeature2();
                this.return();
                this.carController.script.carController.hideBodyInfo();
                // show inner
                orbitCamera.resetAndLookAtEntity(1, this.innerEntity);
                this.status = 2;
                this.returnButton.enabled = true;
                //switch the camera mode
                var firstCamera = this.cameraEntity.script.firstPersonCamera;
                orbitCamera.enabled = false;
                firstCamera.enabled = true;
                firstCamera.show();
                //this.return();

                   
               break;               
       } 
};

MainController.prototype.showControlUIs = function() {
    var formY = 0 - this.curDetailUIHeight;
    var position = { y: formY };

    var pos = this.carDetailUI.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: this.carDetailPosY }, 300)
        .onStart(function () {

            cur.carDetailUI.enabled = true;
        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carDetailUI.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event

            cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

MainController.prototype.hideControlUIs = function() {
    var formY = this.carDetailPosY;// - this.curDetailUIHeight;
    var position = { y: formY };

    var pos = this.carDetailUI.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: - this.curDetailUIHeight }, 300)
        .onStart(function () {
            cur.hideDetailSubItemsUI();

        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carDetailUI.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ??
            cur.carDetailUI.enabled = false;
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

MainController.prototype.showDetailSubItemsUI = function (dt) {
    this.uiItems.forEach(function(node){
        node.script.ui.showUI();
    });
};


MainController.prototype.hideDetailSubItemsUI = function (dt) {
    this.uiItems.forEach(function(node){
        node.script.ui.hideUI();
    });
};



// init FunctionsController
MainController.prototype.initFunctionsUIs = function() {
    var cur = this;
    //init cars detail UI
    this.carFunctionsUI = this.entity.findByName("FunctionsController");

    //set the uiItem's text
    var uiItems = this.carFunctionsUI.find(function (node) {
        return node.script && node.script.has('ui'); // player
    });
    
    //this.uiItems = uiItems;
    
    this.functionsbuttons = this.carFunctionsUI.find(function (node){
        return node.script && node.script.has('imgButton'); // player
    });
    
    this.carFunctionsPosY = this.carFunctionsUI.getLocalPosition().y;

    var rect = calculateElementPos(this.carFunctionsUI.element);
    
    
    var newH = rect.z * 0.21;
    
    this.curFunctionsUIHeight = newH;
    
    var screenH = this.entity.screen.resolution.y;
    //left, bottom, right and top
    //set the Vec4 anchor 's top
    
    var an = this.carFunctionsUI.element.anchor;
    
    //an.w = an.y +  (newH / screenH); 
    
    var centerY = an.y + ((rect.w / screenH)/ 2);
    an.w = centerY +  (newH / screenH / 2);
    an.y = centerY -  (newH / screenH / 2);



    //this.carDetailUI.enabled = false; 
    
    var cur = this;
    this.functionsbuttons.forEach(function (btn){
        
        btn.on("click", function(bDl){
           cur.onClickFunctions(bDl);
        }, this);

    });  


    this.entity.removeChild(this.carFunctionsUI);
  
    this.entity.addChild(this.carFunctionsUI);  
    
    
    this.carFunctionsUI.enabled = false;
};

MainController.prototype.onClickFunctions = function (btn){
    var orbitCamera = this.cameraEntity.script.orbitCamera;
    
           switch (btn.name){
           case "Item1":    
               //switch color
               this.carController.script.carController.changeColor();
               break;
           case "Item2": 
                // functions
                // show  detail 
               // this.showFeature2();


               break;
           case "Item3":
               // show detail data
                
               break;
                   
           case "Item4":
                   
               break;
                   
           case "Item5":  
               // start the engine
               this.carController.script.carController.engine();
               break;               
       } 
};


MainController.prototype.showFunctionsUIs = function() {
    this.status = 1;
    var formY = 0 - this.curFunctionsUIHeight;
    var position = { y: formY };

    var pos = this.carFunctionsUI.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: this.carFunctionsPosY }, 300)
        .onStart(function () {

            cur.carFunctionsUI.enabled = true;
        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carFunctionsUI.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event

            //cur.showDetailSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

MainController.prototype.hideFunctionsUIs = function() {
    var formY = this.carFunctionsPosY;// - this.curDetailUIHeight;
    var position = { y: formY };

    var pos = this.carFunctionsUI.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: - this.curFunctionsUIHeight }, 300)
        .onStart(function () {
            //cur.hideDetailSubItemsUI();

        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carFunctionsUI.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ??
            cur.carFunctionsUI.enabled = false;
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};

// swap method called for script hot-reloading
// inherit your script state here
// MainController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/