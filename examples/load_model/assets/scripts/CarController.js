//car'panel's anim and control function



var CarController = pc.createScript('carController');





// initialize code called once per entity
CarController.prototype.initialize = function () {

    var cur = this;
    
    this.initCarNavUIs();
    this.initCarDetailUIs();
    this.InitShareUI();
    this.initTitle();
    this.initFeature();
    this.initSubscribe();
    
    var target = getQueryVariable("car");
    if (target){

        this.showCarsDetail();
    }
    else{
        setTimeout(() => {
            this.showCarsNav();
        }, 1000);
    }
    
    this.camera = this.app.root.findByName("camera");
    
    
    this.entity.on("showCarDetail", function(ob){
        
        cur.hideCarsNav();
        
        cur.showCarsDetail();
        
        var box = new pc.BoundingBox(ob.getPosition(), new pc.Vec3(ob.collision.halfExtents.x , ob.collision.halfExtents.y, ob.collision.halfExtents.z));
        
        var carItems = cur.app.root.find(function(c){
            return c.script && c.script.car;
        });
        
        var curCar = carItems.find(function (c){
           return box.containsPoint(c.getPosition());
        });
        
        if (curCar){
            curCar.script.car.showHint();
            //[TODO] auto show
        }
    }, this);
    
    this.entity.on("hideCarDetail", function(ob){
        
        cur.showCarsNav();
        
        cur.hideCarsDetail();
        
        var box = new pc.BoundingBox(ob.getPosition(), new pc.Vec3(ob.collision.halfExtents.x , ob.collision.halfExtents.y, ob.collision.halfExtents.z));
        
        var carItems = cur.app.root.find(function(c){
            return c.script && c.script.car;
        });
        
        var curCar = carItems.find(function (c){
           return box.containsPoint(c.getPosition());
        });
        
        if (curCar){
            curCar.script.car.hideHint();
        }
        
    }, this);
    
};


// update code called every frame
CarController.prototype.update = function (dt) {

};



// title function


CarController.prototype.initTitle = function (dt) {
    this.titleDetail = this.entity.findByName("TitleDetail");

    var cur = this;
    this.titleDetail.on("bindAssets", function(){
        cur.titleDetail.fire("changeData", "当前累计参与人次7202.4万");
    }, this);
};

CarController.prototype.initSubscribe = function (dt) {
    this.SubscribeButton = this.entity.findByName("SubscribeButton");

    var cur = this;
    this.SubscribeButton.on("click", function(){
        cur.showFeature();
    });

};

// feature functions
CarController.prototype.initFeature = function (dt) {
    this.featurePanel = this.entity.findByName("FeaturesPanel");

    var cur = this;

    this.featurePanel.on("bindAssets", function(){
        cur.featurePanel.script.ui.uiItem.posX = (cur.entity.screen.resolution.x - 600) / 2;
        cur.featurePanel.script.ui.uiItem.posY = cur.entity.screen.resolution.y / 4;
    });

    this.featurePanel.script.ui.bindVueSubData = {
        series:[
            {
                id: 'A',
                name: '博越'
            },
            {
                id: '1',
                name: '领界'
            },
            {
                id: '2',
                name: '宋Pro'
            }
        ],
        seriesSelected: '1',
        models:[
            {
                id: 'A',
                name: '2019款 1.6T 铂金版'
            },
            {
                id: '1',
                name: '2020款 2.0T 旗舰版'
            },
            {
                id: '2',
                name: '2020款 2.0T 钻石版'
            }
        ],
        modelsSelected: '1',
    };

    this.featurePanel.script.ui.bindJs = function(){
        //$('#sharer').append("<div class='social-share'></div>");
        // $.getScript('https://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/js/bootstrap-select.min.js',function(){
        // });
        $('.selectpicker').selectpicker({});
    };

    
    this.featurePanel.on("onCancel", function(){
        cur.hideFeature();
    });

    this.featurePanel.enabled = false;
};

CarController.prototype.showFeature = function () {
    var cur = this;
    this.featurePanel.enabled = true;
    
    this.camera.script.first_person_camera.noClickArea.push(
        new pc.Vec4(0, 0, this.entity.screen.resolution.x,  this.entity.screen.resolution.y));

    this.featurePanel.script.ui.showUI();

    var position = {y : 0};
    var tweenA = new TWEEN.Tween(position).to({ y: 100 }, 300)
    .onStart(function () {

    })
    .onUpdate(function () {
        // pos.y = position.y;

        // cur.carNavPanel.setLocalPosition(pos);
    })
    .onStop(function () {
    })
    .start();
};

CarController.prototype.hideFeature = function () {

    this.camera.script.first_person_camera.noClickArea.pop();
    this.featurePanel.enabled = false;

    this.featurePanel.script.ui.hideUI();
};

// init feature2 
CarController.prototype.initFeature2 = function (dt) {
    this.featurePanel2 = this.entity.findByName("FeaturesPanel2");

    var cur = this;

    this.featurePanel2.on("bindAssets", function(){
        cur.featurePanel.script.ui.uiItem.posX = (cur.entity.screen.resolution.x - 600) / 2;
        cur.featurePanel.script.ui.uiItem.posY = cur.entity.screen.resolution.y / 4;
    });

    this.featurePanel2.script.ui.bindVueSubData = {
        series:[
            {
                id: 'A',
                name: '博越'
            },
            {
                id: '1',
                name: '领界'
            },
            {
                id: '2',
                name: '宋Pro'
            }
        ],
        seriesSelected: '1',
        models:[
            {
                id: 'A',
                name: '2019款 1.6T 铂金版'
            },
            {
                id: '1',
                name: '2020款 2.0T 旗舰版'
            },
            {
                id: '2',
                name: '2020款 2.0T 钻石版'
            }
        ],
        modelsSelected: '1',
    };

    this.featurePanel2.script.ui.bindJs = function(){
        //$('#sharer').append("<div class='social-share'></div>");
        // $.getScript('https://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/js/bootstrap-select.min.js',function(){
        // });
        $('.selectpicker').selectpicker({});
    };

    
    this.featurePanel2.on("onCancel", function(){
        cur.hideFeature2();
    });

    this.featurePanel2.enabled = false;
};

CarController.prototype.showFeature2 = function () {
    var cur = this;
    this.featurePanel.enabled = true;
    
    this.camera.script.first_person_camera.noClickArea.push(
        new pc.Vec4(0, 0, this.entity.screen.resolution.x,  this.entity.screen.resolution.y));

    this.featurePanel2.script.ui.showUI();

    var position = {y : 0};
    var tweenA = new TWEEN.Tween(position).to({ y: 100 }, 300)
    .onStart(function () {

    })
    .onUpdate(function () {
        // pos.y = position.y;

        // cur.carNavPanel.setLocalPosition(pos);
    })
    .onStop(function () {
    })
    .start();
};

CarController.prototype.hideFeature2 = function () {

    this.camera.script.first_person_camera.noClickArea.pop();
    this.featurePanel2.enabled = false;

    this.featurePanel2.script.ui.hideUI();
};


// init feature3
CarController.prototype.initFeature3 = function (dt) {
    this.featurePanel3 = this.entity.findByName("FeaturesPanel3");

    var cur = this;

    this.featurePanel3.on("bindAssets", function(){
        cur.featurePanel.script.ui.uiItem.posX = (cur.entity.screen.resolution.x - 600) / 2;
        cur.featurePanel.script.ui.uiItem.posY = cur.entity.screen.resolution.y / 4;
    });

    this.featurePanel3.script.ui.bindVueSubData = {
        series:[
            {
                id: 'A',
                name: '博越'
            },
            {
                id: '1',
                name: '领界'
            },
            {
                id: '2',
                name: '宋Pro'
            }
        ],
        seriesSelected: '1',
        models:[
            {
                id: 'A',
                name: '2019款 1.6T 铂金版'
            },
            {
                id: '1',
                name: '2020款 2.0T 旗舰版'
            },
            {
                id: '2',
                name: '2020款 2.0T 钻石版'
            }
        ],
        modelsSelected: '1',
        isSeen: { 'btn-warning': true },
        noSeen: { 'btn-warning': false },

        isSocial: { 'btn-warning': true },
        noSocial: { 'btn-warning': false },

        is30: { 'btn-warning': true },
        is60: { 'btn-warning': false },
        isOther: { 'btn-warning': false },

        income1: { 'btn-warning': true },
        income2: { 'btn-warning': false },
        income3: { 'btn-warning': false },
    };

    this.featurePanel3.script.ui.bindJs = function(){
        //$('#sharer').append("<div class='social-share'></div>");
        // $.getScript('https://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/js/bootstrap-select.min.js',function(){
        // });
        $('.selectpicker').selectpicker({});
    };

    
    this.featurePanel3.on("onCancel", function(){
        cur.hideFeature3();
    });

    this.featurePanel3.on("onClick", function(event){
        switch (event.target.id) {
            case "incomebtn1":
                this.subdata.income1 = { 'btn-warning': true };
                this.subdata.income2 = { 'btn-warning': false };
                this.subdata.income3 = { 'btn-warning': false };
                break;
            case "incomebtn2":
                this.subdata.income1 = { 'btn-warning': false };
                this.subdata.income2 = { 'btn-warning': true };
                this.subdata.income3 = { 'btn-warning': false };
                break;

            case "incomebtn3":
                this.subdata.income1 = { 'btn-warning': false };
                this.subdata.income2 = { 'btn-warning': false };
                this.subdata.income3 = { 'btn-warning': true };
                break;
            case "datebtn1":
                this.subdata.is30 = { 'btn-warning': true };
                this.subdata.is60 = { 'btn-warning': false };
                this.subdata.isOther = { 'btn-warning': false };
                break;
            case "datebtn2":
                this.subdata.is30 = { 'btn-warning': false };
                this.subdata.is60 = { 'btn-warning': true };
                this.subdata.isOther = { 'btn-warning': false };
                break;
            case "datebtn3":
                this.subdata.is30 = { 'btn-warning': false };
                this.subdata.is60 = { 'btn-warning': false };
                this.subdata.isOther = { 'btn-warning': true };
                break;
            case "socialbtn1":
                this.subdata.isSocial = { 'btn-warning': true };
                this.subdata.noSocial = { 'btn-warning': false };
                break;
            case "socialbtn2":
                this.subdata.isSocial = { 'btn-warning': false };
                this.subdata.noSocial = { 'btn-warning': true };
                break;
            case "seenbtn1":
                this.subdata.isSeen = { 'btn-warning': true };
                this.subdata.noSeen = { 'btn-warning': false };
                break;
            case "seenbtn2":
                this.subdata.isSeen = { 'btn-warning': false };
                this.subdata.noSeen = { 'btn-warning': true };
                break;
        }
    });

    this.featurePanel3.enabled = false;
};

CarController.prototype.showFeature3 = function () {
    var cur = this;
    this.featurePanel3.enabled = true;
    
    this.camera.script.first_person_camera.noClickArea.push(
        new pc.Vec4(0, 0, this.entity.screen.resolution.x,  this.entity.screen.resolution.y));

    this.featurePanel3.script.ui.showUI();

    var position = {y : 0};
    var tweenA = new TWEEN.Tween(position).to({ y: 100 }, 300)
    .onStart(function () {

    })
    .onUpdate(function () {
        // pos.y = position.y;

        // cur.carNavPanel.setLocalPosition(pos);
    })
    .onStop(function () {
    })
    .start();
};

CarController.prototype.hideFeature3 = function () {

    this.camera.script.first_person_camera.noClickArea.pop();
    this.featurePanel3.enabled = false;

    this.featurePanel3.script.ui.hideUI();
};


//detail functions

//init the  car detail UI
CarController.prototype.initCarDetailUIs = function (dt) {
    var cur = this;
    //init cars detail UI
    this.carDetailUI = this.entity.findByName("CarDetailPanel");

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

    this.carDetailUI.element.height = newH;

    var count = 1.1;
    uiItems.forEach(function (node) {
        cur.entity.on("changeData", function(){
            node.fire("changeData", count + "w");
            count += 0.1;
        }, cur);

    });

    // setTimeout(function () {
    //     //wait for the children have init end
    //     var count = 1.1;
    //     uiItems.forEach(function (node) {
    //         node.fire("changeData", count + "w");
    //         count += 0.1;
    //     });
    // }, 500);

    this.carDetailUI.enabled = false; 
    
    var cur = this;
    this.buttons.forEach(function (btn){
        
        btn.on("click", function(bDl){
           cur.onClickDetail(bDl);
        });

    });


    this.entity.removeChild(this.carDetailUI);

    this.entity.addChild(this.carDetailUI);
};


CarController.prototype.onClickDetail = function (btn){
           switch (btn.name){
           case "Item1":
               //switch Scene
               singleMainScene.loadScene(SubSceneId, null);
               break;
           case "Item2": 

                   
               break;
           case "Item3":
                //change color
                this.showChangeColorUI();
               break;
                   
           case "Item4":
               break;
                   
           case "Item5":
               break;               
       } 
};





///show car's detail
CarController.prototype.showCarsDetail = function () {
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

CarController.prototype.hideCarsDetail = function () {
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



CarController.prototype.showDetailSubItemsUI = function (dt) {
    this.uiItems.forEach(function(node){
        node.script.ui.showUI();
    });
};


CarController.prototype.hideDetailSubItemsUI = function (dt) {
    this.uiItems.forEach(function(node){
        node.script.ui.hideUI();
    });
};

//nav functions 

CarController.prototype.initCarNavUIs = function (dt) {
    ////////////////// init the cars nav UI
    //
    this.carNavPanel = this.entity.findByName("CarNavPanel");

    var cur = this;
    var index = 0;
    //init the content
    //set the size of content
    var content = this.carNavPanel.findByName("Content");
    // content.children.forEach(function (node) {
    //     node.findByName("title" + index).fire("changeData", cars[index].series);
    //     node.findByName("count" + index).fire("changeData", cars[index++].count);
    // });

    var template = content.children[0];
    var newItem = template;
    var count = 0;
    var itemW = 1 / (cars.length);

    cars.forEach(function(c){

        //if (newItem === null)
        {
            newItem = template.clone();

            
            content.addChild(newItem);
        }
        
        var titleNode = newItem.findByName("title0");
        titleNode.name = "title" + count;
        
        titleNode.on("bindAssets", function(){
            titleNode.fire("changeData", c.series);
        });

        var countNode = newItem.findByName("count0");
        countNode.name = "count" + count;
        
        countNode.on("bindAssets", function(){
            countNode.fire("changeData", c.count);
        });
        
        //left, bottom, right and top
        newItem.element.anchor.x = count * itemW;
        newItem.element.anchor.z = (count + 1) * itemW;
        
        
        var btn = newItem.findByName("Button");
        btn.on("click", function(){
           //console.log("click a car " + c.name);
           //move to the car
            var carNode = cur.app.root.findByName(c.name);
            cur.camera.fire("faceTo", carNode);
            
            //trigger by detect collision
            //show hint
            // carNode.fire("faceTo");
            
            // cur.hideCarsNav();
            // cur.showCarsDetail();
        });
        
        //next item
        count++;
        
        newItem = null;
    });
    
    template.enabled = false;

    this.carNavPosY = this.carNavPanel.getLocalPosition().y;

    //calculate the size
    var rect = calculateElementPos(this.carNavPanel.element);

    var newH = rect.z * 0.181; //
    
    var screenH = this.entity.screen.resolution.y;
    //left, bottom, right and top
    //set the Vec4 anchor 's top
    
    var an = this.carNavPanel.element.anchor;
    
    var centerY = an.y + ((rect.w / screenH)/ 2);
    an.w = centerY +  (newH / screenH / 2);
    an.y = centerY -  (newH / screenH / 2);

    //an.w = an.y +  (newH / screenH / 2);

    this.carNavPanel.element.height = newH;

    //calculate the items' width
    //this.curNavUIHeight = rect.w;
    this.curNavUIHeight = newH;

    var itemWidth =  this.curNavUIHeight * 1; //TODO ratio
    var itemsWidth = itemWidth * cars.length;
    
    content.element.width = itemsWidth;

    //left scroll the content
    var rButton = this.carNavPanel.findByName("RButton");
    rButton.button.on("click", function (event) {
        var pos = content.getLocalPosition();
        var position = { y: pos.x };
        
        pos.x += itemWidth;
        //set the active status
        lButton.button.active = true;
        if (Math.abs(pos.x) >= 0 && Math.abs(pos.x) < itemWidth) {
            rButton.button.active = false;
        }
        
        if (cur.tweenA)
            cur.tweenA.stop();
        
        cur.tweenA = new TWEEN.Tween(position).to({ y: pos.x }, 300)
        .onStart(function () {
        })
        .onUpdate(function () {
            pos.x = position.y;
            content.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event

            
        })
        .start();

    });

    //right scroll the content
    var lButton = this.carNavPanel.findByName("LButton");

    lButton.button.on("click", function (event) {
        var pos = content.getLocalPosition();
        var position = { y: pos.x };
        
        pos.x -= itemWidth;
        content.setLocalPosition(pos);

        rButton.button.active = true;
        if (itemsWidth + pos.x <= rect.z) {
            lButton.button.active = false;
        }
        
        if (cur.tweenA)
            cur.tweenA.stop();
        
        cur.tweenA = new TWEEN.Tween(position).to({ y: pos.x }, 300)
        .onStart(function () {
        })
        .onUpdate(function () {
            pos.x = position.y;
            content.setLocalPosition(pos);
        })
        .onStop(function () {
            //to show the html UI ?? register the click event

            
        })
        .start();
    });
    
    this.carNavPanel.enabled = false;

    //this.entity

    //to re layout
    //var c = this.carNavPanel.clone();
    this.entity.removeChild(this.carNavPanel);

    this.entity.addChild(this.carNavPanel);
};


CarController.prototype.showCarsNav = function () {
    var formY = - this.curNavUIHeight;
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
            cur.showNavSubItemsUI();
        })
        .start();

        setTimeout(() => {
            tweenA.stop();
        }, 301);
};


CarController.prototype.hideCarsNav = function () {
    var formY = this.carNavPosY;// - this.curUIHeight;
    var position = { y: formY };

    var pos = this.carNavPanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: - this.curNavUIHeight }, 300)
        .onStart(function () {
            cur.hideNavSubItemsUI();
        })
        .onUpdate(function () {
            pos.y = position.y;
            cur.carNavPanel.setLocalPosition(pos);
        })
        .onStop(function () {
            cur.carNavPanel.enabled = false;
        })
        .start();

    setTimeout(() => {
        tweenA.stop();
    }, 301);

};

CarController.prototype.showNavSubItemsUI = function () {
    if (!this.navSubItemsUI)
        this.navSubItemsUI = this.carNavPanel.find(function(node){
            return node.script && node.script.ui;
        });

    this.navSubItemsUI.forEach(function(node){
         node.script.ui.showUI();
    });
};


CarController.prototype.hideNavSubItemsUI = function () {
    if (!this.navSubItemsUI)
        this.navSubItemsUI = this.carNavPanel.find(function(node){
            return node.script && node.script.ui;
        });

    this.navSubItemsUI.forEach(function(node){
        node.script.ui.hideUI();
    });
};




// change color panel
CarController.prototype.showChangeColorUI = function () {
    
    var colorPanel = this.entity.findByName("ChangeColorPanel");
    colorPanel.enabled = true;
    var rect = calculateElementPos(colorPanel.element);
    
    var formY = - rect.w;// - this.curUIHeight;
    var position = { y: formY };

    var pos = colorPanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: 0 }, 300)
        .onStart(function () {
            colorPanel.enabled = true;
            //register button click
            cur.enableHandleChangeColor();
        })
        .onUpdate(function () {
            pos.y = position.y;
            colorPanel.setLocalPosition(pos);
        })
        .onStop(function () {

        })
        .start();
};


CarController.prototype.hideChangeColorUI = function () {
    
    var colorPanel = this.entity.findByName("ChangeColorPanel");
    
    var rect = calculateElementPos(colorPanel.element);
    
    var formY = 0;// - this.curUIHeight;
    var position = { y: formY };

    var pos = colorPanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: - rect.w }, 300)
        .onStart(function () {
           //colorPanel.off();
           cur.disableHandleChangeColor();
        })
        .onUpdate(function () {
            pos.y = position.y;
            colorPanel.setLocalPosition(pos);
        })
        .onStop(function () {
            colorPanel.enabled = false;
        })
        .start();

    setTimeout(() => {
        tweenA.stop();
    }, 301);
};

CarController.prototype.enableHandleChangeColor = function () {
    
    var colorPanel = this.entity.findByName("ChangeColorPanel");
    
    this.buttons = colorPanel.find(function (node){
        return node.script && node.script.has('imgButton'); // player
    });
    
    var cur = this;
    this.buttons.forEach(function (btn){
        
        btn.on("click", function(bDl){
            //do nothing
            cur.hideChangeColorUI();
        });

    });
};


CarController.prototype.disableHandleChangeColor = function () {
    
    var colorPanel = this.entity.findByName("ChangeColorPanel");
    
    this.buttons = colorPanel.find(function (node){
        return node.script && node.script.has('imgButton'); // player
    });
    
    var cur = this;
    this.buttons.forEach(function (btn){
        
        btn.off();

    });
};

// control Share Panel

CarController.prototype.InitShareUI = function () {
    var sharePanel = this.entity.findByName("SharePanel");

    sharePanel.script.ui.bindJs = function(){
        //$('#sharer').append("<div class='social-share'></div>");
        $.getScript('https://cdn.bootcss.com/social-share.js/1.0.16/js/social-share.min.js',function(){
            //alert('done');
            var $config = {
                title: '234',
                description: '123',
                sites: ['qzone', 'qq', 'weibo', 'wechat'],
                wechatQrcodeTitle: '微信扫一扫：分享', // 微信二维码提示文字
                wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'
            };
            socialShare('.social-share', $config);
        });

    };
};

CarController.prototype.showShareUI = function () {
    
    var sharePanel = this.entity.findByName("SharePanel");
    
    var rect = calculateElementPos(sharePanel.element);
    
    var formY = - rect.w;// - this.curUIHeight;
    var position = { y: formY };

    var pos = sharePanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: 0 }, 300)
        .onStart(function () {

            sharePanel.script.ui.showUI();
            sharePanel.enabled = true;
            //register button click
            //enableHandleChangeColor();
            sharePanel.on("onCancel", function(){
                
               // do nothing
               cur.hideShareUI();
            });
        })
        .onUpdate(function () {
            pos.y = position.y;
            sharePanel.setLocalPosition(pos);
        })
        .onStop(function () {
            
        })
        .start();
};

CarController.prototype.hideShareUI = function () {
    
    var sharePanel = this.entity.findByName("SharePanel");
    
    var rect = calculateElementPos(sharePanel.element);
    
    var formY = 0;// - this.curUIHeight;
    var position = { y: formY };

    var pos = sharePanel.getLocalPosition();

    var cur = this;
    var tweenA = new TWEEN.Tween(position).to({ y: - rect.w }, 300)
        .onStart(function () {
            //sharePanel.enabled = true;
            //register button click
            //enableHandleChangeColor();
        })
        .onUpdate(function () {
            pos.y = position.y;
            sharePanel.setLocalPosition(pos);
        })
        .onStop(function () {
            sharePanel.enabled = false;

            sharePanel.script.ui.hideUI();
        })
        .start();

    //TODO workaround for onStop
    setTimeout(() => {
        tweenA.stop();
    }, 301);
};
// swap method called for script hot-reloading
// inherit your script state here
// CarController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/