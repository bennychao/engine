//car'panel's anim and control function



var CarController = pc.createScript('carController');





// initialize code called once per entity
CarController.prototype.initialize = function () {

    this.initCarNavUIs();
    this.initCarDetailUIs();
    
    var target = getQueryVariable("car");
    if (target){

        this.showCarsDetail();
    }
    else{
        

        this.showCarsNav();
    }
    
    
    //check the system buttons' function
    //
    

};


CarController.prototype.initCarDetailUIs = function (dt) {
    //init cars detail UI
    this.carDetailUI = this.entity.findByName("CarDetailPanel");

    //set the uiItem's text
    var uiItems = this.carDetailUI.find(function (node) {
        return node.script && node.script.has('ui'); // player
    });
    
    
    this.buttons = this.carDetailUI.find(function (node){
        return node.script && node.script.has('imgButton'); // player
    });
    
    this.carDetailPosY = this.carDetailUI.getLocalPosition().y;

    var rect = calculateElementPos(this.carDetailUI.element);
    
    this.curDetailUIHeight = rect.w;  

    var itemWidth = 100;
    var itemsWidth = itemWidth * cars.length;

    setTimeout(function () {
        //wait for the children have init end
        var count = 1.1;
        uiItems.forEach(function (node) {
            node.fire("changeData", count + "w");
            count += 0.1;
        });
    }, 500);

    this.carDetailUI.enabled = false; 
    
    var cur = this;
    this.buttons.forEach(function (btn){
        
        btn.on("click", function(bDl){
           cur.onClickDetail(bDl);
        });

    });
};


CarController.prototype.onClickDetail = function (btn){
           switch (btn.name){
           case "Item1":
               //switch Scene
               singleMainScene.loadScene(838927, null);
               break;
           case "Item2":
               break;
           case "Item3":
               break;
           case "Item4":
               break;   
           case "Item5":
               break;               
       } 
};

CarController.prototype.initCarNavUIs = function (dt) {
    ////////////////// init the cars nav UI
    //
    this.carNavPanel = this.entity.findByName("CarNavPanel");


    var index = 0;
    //init the content
    //set the size of content
    var content = this.carNavPanel.findByName("Content");
    content.children.forEach(function (node) {
        node.findByName("title" + index).fire("changeData", cars[index].name);
        node.findByName("count" + index).fire("changeData", cars[index++].count);
    });

    this.carNavPosY = this.carNavPanel.getLocalPosition().y;

    //calculate the size
    var rect = calculateElementPos(this.carNavPanel.element);

    this.curNavUIHeight = rect.w;

    var itemWidth = 100;
    var itemsWidth = itemWidth * cars.length;

    //left scroll the content
    var rButton = this.carNavPanel.findByName("RButton");
    rButton.button.on("click", function (event) {
        var pos = content.getLocalPosition();

        pos.x += itemWidth;
        content.setLocalPosition(pos);

        lButton.button.active = true;
        if (pos.x + itemWidth >= itemsWidth) {
            rButton.button.active = false;
        }

    });

    //right scroll the content
    var lButton = this.carNavPanel.findByName("LButton");

    lButton.button.on("click", function (event) {
        var pos = content.getLocalPosition();
        pos.x -= itemWidth;
        content.setLocalPosition(pos);

        rButton.button.active = true;
        if (pos.x <= 0) {
            lButton.button.active = false;
        }
    });
    
    this.carNavPanel.enabled = false;
};

// update code called every frame
CarController.prototype.update = function (dt) {

};


CarController.prototype.showCarsDetail = function () {
    var formY = this.carDetailPosY - this.curDetailUIHeight;
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

            
        })
        .start();

};

CarController.prototype.hideCarsDetail = function () {
    var formY = this.carDetailPosY;// - this.curDetailUIHeight;
    var position = { y: formY };

    var pos = this.carDetailUI.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: this.carDetailPosY  - this.curDetailUIHeight }, 300)
        .onStart(function () {

            cur.carDetailUI.enabled = true;
        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carDetailUI.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ??
        })
        .start();
};


CarController.prototype.showCarsNav = function () {
    var formY = this.carNavPosY - this.curNavUIHeight;
    var position = { y: formY };

    var pos = this.carNavPanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: this.carNavPosY }, 300)
        .onStart(function () {

            cur.carNavPanel.enabled = true;
        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carNavPanel.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ??
        })
        .start();
};

CarController.prototype.hideCarsDetail = function () {
    var formY = this.carNavPosY;// - this.curUIHeight;
    var position = { y: formY };

    var pos = this.carNavPanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: this.carNavPosY - this.curNavUIHeight }, 300)
        .onStart(function () {

        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carNavPanel.setLocalPosition(pos);
        })
        .onStop(function () {
            cur.carNavPanel.enabled = false;
        })
        .start();
};



// swap method called for script hot-reloading
// inherit your script state here
// CarController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/