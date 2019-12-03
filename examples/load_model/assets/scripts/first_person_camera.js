var FirstPersonCamera = pc.createScript('first_person_camera');

FirstPersonCamera.attributes.add('speed', {
    type: 'number',
    default: 0.1
});

FirstPersonCamera.attributes.add('steerFactor', {
    type: 'number',
    default: 0.1
});

FirstPersonCamera.attributes.add('ground', {
    type: 'entity',
    title: 'Ground',
    description: 'The Ground Entity'
});

FirstPersonCamera.prototype.initialize = function () {
    // Camera euler angle rotation around x and y axes
    var eulers = this.entity.getLocalEulerAngles();
    
    
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.force = new pc.Vec3();
    this.bSteering = false;
    this.bTargeting = false;
    
    this.startPos = new pc.Vec2();

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    var mouse = this.app.mouse;
    mouse.disableContextMenu();
    mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    
    mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    
    this.entity.on("onSteerStart", this.onSteerStart,this);
    this.entity.on("onSteerStop", this.onSteerStop,this);
    this.entity.on("onSteer", this.onSteer,this);
    
    var h =  this.ground.getPosition().y + 1.8;
    
    var pos =  this.entity.getPosition();
    pos.y = h;
    
    this.entity.setPosition(pos);
    
    this.bMouseDown = false;
      
    var size = this.ground.getLocalScale().clone();
        //check is in Box
    this.broundbox = new pc.BoundingBox(this.ground.getPosition(), size.scale(0.5));
            
    //find the obstacle
    this.loadObstacles();
    
    this.obstacle = null;
    
    this.InitCheckUIList();
    
    
    this.entity.on("faceTo", this.faceTo);
    
    this.checkSwithToCar();
    
    //un register the events
    this.entity.on("destroy", function(){
        mouse.off();
        //this.entity.off();
    });
};

FirstPersonCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);

    if (!this.bSteering && !this.bTargeting)
        this.checkMouseMove();

    var mat = this.entity.getWorldTransform();

    //(this.bSteering || this.bTargeting || this.bMouseDown) && 
    if (this.force.length()) {
        var pos = mat.transformPoint(this.force);

        
        if (this.checkObstacle(pos)){
            //console.log("in checkObstacle");
            //
            this.entity.fire("onDetectObstacle");
        }
        else{
            var cur = this.entity.position;
            pos = pos.sub(cur);
            this.entity.translate(pos.x, 0, pos.z);
        }
       
    }
    // // Update the camera's position
    // var keyboard = this.app.keyboard;
    // var forwards  = keyboard.isPressed(pc.KEY_UP)   || keyboard.isPressed(pc.KEY_W);
    // var backwards = keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S);
    // var left  = keyboard.isPressed(pc.KEY_LEFT)  || keyboard.isPressed(pc.KEY_A);
    // var right = keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D);

    // if (forwards) {
    //     this.entity.translateLocal(0, 0, -this.speed*dt);
    // } else if (backwards) {
    //     this.entity.translateLocal(0, 0, this.speed*dt);
    // }

    // if (left) {
    //     this.entity.translateLocal(-this.speed*dt, 0, 0);
    // } else if (right) {
    //     this.entity.translateLocal(this.speed*dt, 0, 0);
    // }

    this.fire("onUpdate");
};

FirstPersonCamera.prototype.checkMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    // calculate force based on pressed keys
    if (this.app.keyboard.isPressed(pc.KEY_LEFT) || this.app.keyboard.isPressed(pc.KEY_A)) {
        this.force.x = pc.math.lerp(this.force.x, -this.speed, 0.01);
    } 
    else if (this.app.keyboard.isPressed(pc.KEY_RIGHT) || this.app.keyboard.isPressed(pc.KEY_D)) {
        this.force.x = pc.math.lerp(this.force.x, this.speed, 0.01);
    }
    else
    {
        this.force.x = pc.math.lerp(this.force.x, 0, 0.1);
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP) || this.app.keyboard.isPressed(pc.KEY_W)) {
        this.force.z = pc.math.lerp(this.force.z, -this.speed, 0.01);
    } 
    else if (this.app.keyboard.isPressed(pc.KEY_DOWN) || this.app.keyboard.isPressed(pc.KEY_S)) {
        this.force.z = pc.math.lerp(this.force.z, this.speed, 0.01);
    }
    else
    {
        this.force.z = pc.math.lerp(this.force.z, 0, 0.1);
    }
};

FirstPersonCamera.prototype.onMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    //if (pc.Mouse.isPointerLocked()) {
    if (this.bMouseDown) {
        this.ex -= event.dy / 5;
        this.ex = pc.math.clamp(this.ex, -90, 90);
        this.ey -= event.dx / 5; 
    }
};

FirstPersonCamera.prototype.onMouseDown = function (event) {
    // When the mouse button is clicked try and capture the pointer
    if (!this.bSteering && !this.bTargeting && !this.bMouseDown && !this.checkClickInUI(new pc.Vec2(event.x, event.y))) {  // && !pc.Mouse.isPointerLocked()
        //this.app.mouse.enablePointerLock();
        this.bMouseDown = true;
        this.startPos = new pc.Vec2(event.x, event.y);
    }
};

FirstPersonCamera.prototype.onMouseUp = function (event) {
    // When the mouse button is clicked try and capture the pointer
    if (!this.bSteering && !this.bTargeting && this.bMouseDown) { // && !pc.Mouse.isPointerLocked()
        //this.app.mouse.disablePointerLock();        
        this.bMouseDown = false;
        
        var cur = new pc.Vec2(event.x, event.y);
        cur.sub(this.startPos);
        
        if (cur.lengthSq()< 0.01){
            //move to 
           var ret = this.checkRay(event);
            console.log("check Ray is " + ret);
            if (ret.bContain)
                {
                    this.moveTo(ret.pos);
                }
        }
    }
};

FirstPersonCamera.prototype.onSteerStart = function (curDir) {
    this.bSteering = true;
};

FirstPersonCamera.prototype.onSteerStop = function (curDir) {
    this.bSteering = false;
};

FirstPersonCamera.prototype.onSteer = function (curDir) {
    // Update the current Euler angles, clamp the pitch.
    // 
    // factor
    this.force = new pc.Vec3(curDir.x * this.speed / 50, 0, -curDir.y * this.speed / 50);
};

FirstPersonCamera.prototype.faceTo = function (target) {
    //this.bSteering = true;
    //target is a entity
    var dir = target.forward.clone();
    dir.scale(3);
    
    var pos = target.getPosition().clone();
    
    pos.add(dir);
    
    pos.y = this.entity.getPosition().y;
    
    this.entity.setPosition(pos);
    
    
    var f = this.entity.forward; 
    f.y = 0;
    //t.normalize(); 
    var angle = this.angleWithDir(f, new pc.Vec3(-dir.x, -dir.y, -dir.z));
    
    var cur = this;
    
    var position = { y: this.ey };    
    var tweenRotate = new TWEEN.Tween(position).to({ y: this.ey + angle }, 300)
        .onStart(function () {
        })
        .onUpdate(function () {
            cur.ey = position.y;
        })
        .onStop(function () {
        })
        .start();

    /*
        pos = target.getPosition();

        this.entity.lookAt(pos.x, pos.y, pos.z, pc.Vec3.UP.x, pc.Vec3.UP.y, pc.Vec3.UP.z);

        var eulers = this.entity.getLocalEulerAngles();   

        this.ex = eulers.x;
        this.ey = eulers.y;
    */
    //this.entity.rotate(0, 180, 0);
};


FirstPersonCamera.prototype.checkSwithToCar = function () {

    var target = getQueryVariable("car");
    if (target){
        //switch the camera pos to face to it
        
        var carTarget = this.app.root.findByName(target);
        

        this.faceTo(carTarget);
    }
};

FirstPersonCamera.prototype.checkRay = function (event) {
    var start = this.entity.camera.screenToWorld(event.x, event.y, this.entity.camera.nearClip);
    var end = this.entity.camera.screenToWorld(event.x, event.y, this.entity.camera.farClip);

    
    var v1 = end.clone();
    var v2 = start.clone();
    
    v1.sub(start);
    
    v2.y = this.ground.getPosition().y;
    
    var v2toStart = v2.clone();
    v2toStart.sub(start);
    
    var a = this.angle(v1, v2toStart);
     
    var h = start.y - v2.y;
    
    var l = Math.tan(a) * h;
    
    var dir = v1.clone();

    dir.y = 0;
    
    dir.normalize(); 
    
    v2.add(dir.scale(l));
    
   
    return {
        bContain: this.broundbox.containsPoint(v2),
        pos: v2
    };
    
        // Use the ray coordinates to perform a raycast
    //this.app.systems.rigidbody.raycastFirst(start, end, function (result) {
    //    console.log("Entity " + result.entity.name + " was selected");
    //});
    
};

FirstPersonCamera.prototype.moveTo = function (target) {
    
    var cur = this;
    this.bTargeting = true;
    
    var t = target.clone();
    t.y = cur.entity.getPosition().y;        
    
    var curDis = t.clone();
    curDis.sub(cur.entity.getPosition());
    
    //face to the target
    var f = cur.entity.forward; 
    f.y = 0;
    //t.normalize(); 
    var angle = cur.angleWithDir(f, curDis);
    
    
    var position = { y: cur.ey };    
    var tweenRotate = new TWEEN.Tween(position).to({ y: cur.ey + angle }, 300)
        .onStart(function () {
        })
        .onUpdate(function () {
            cur.ey = position.y;
        })
        .onStop(function () {
        })
        .start();

    //reset the force
    cur.force.x = 0;
    cur.force.z = 0;
    
    //onDetectObstacle
    //
    this.entity.on("onDetectObstacle", function(){
       
        //stop moving
        cur.off("onUpdate");
        cur.bTargeting = false;
        cur.force.x = 0;
        cur.force.z = 0;
    });
    
    var onupdateFunc = function(){             
  
        var dis = t.clone();
        
        dis.sub(cur.entity.getPosition());
        
       //check if stop
        
        //var dis = t.distance(this.entity.getPosition());
        if (dis.lengthSq() < 0.5) // || cur.checkObstacle(this.entity.getPosition()))
            {
                cur.off("onUpdate");
                cur.bTargeting = false;
                cur.force.x = 0;
                cur.force.z = 0;
               // this.force.x = pc.math.lerp(this.force.x, 0, 0.1);
               // this.force.z = pc.math.lerp(this.force.z, 0, 0.1);
            }
        else
            {

                
                //t.normalize(); 

                //t.scale(cur.speed);
                
                //cur.force.x = t.x;
                //cur.force.z = t.z;
                
                //cur.entity.setPosition(newTarget);
                //
                //cur.ey = pc.math.lerp(cur.ey, cur.ey + angle, 0.1);
                
                
                cur.force.z = pc.math.lerp(cur.force.z, -cur.speed, 0.01);
                // cur.force.x = pc.math.lerp(cur.force.x, t.x, 0.1);
                // cur.force.z = pc.math.lerp(cur.force.z, t.z, 0.1);
            }

        
        //check if has a obstacles
        
    };
    
    this.on("onUpdate", onupdateFunc);
};

FirstPersonCamera.prototype.loadObstacles = function () {    
    
    this.obstacleList =new Array();
    var collisions = this.app.root.find(function(node) {
        return node.collision && !node.tags.has('ground'); // player
    });
    
    var cur = this;
    
    collisions.forEach(function (node){
        
        if (node.collision.type == "box"){
            var scale = node.getLocalScale();
            var box = new pc.BoundingBox(node.getPosition(), new pc.Vec3(node.collision.halfExtents.x * scale.x, node.collision.halfExtents.y * scale.y, node.collision.halfExtents.z * scale.z));
            cur.obstacleList.push({bounding:box, node:node});
        }
        else  if (node.collision.type == "sphere"){
            
            var sphere = new pc.BoundingSphere(node.getPosition(), node.collision.halfExtents.x);
            cur.obstacleList.push({bounding:sphere, node:node});
        }
    
    }); 
};


FirstPersonCamera.prototype.checkObstacle = function (vec) {
    
    var cur = this;
    var obs = this.obstacleList.find(function(ob) {
        
        //trigger will not stop move
        if (ob.node.tags.has('trigger'))
        {
            return false;
        }
        
        return ob.bounding.containsPoint(vec);
    });
    
    
    if (obs && cur.obstacle != obs.node)
    {
        if (cur.obstacle){
            cur.obstacle.fire("onCollisionLeave");
        }

        obs.node.fire("onCollisionEnter");
        cur.obstacle = obs.node;
    }
    return obs != null && obs != undefined;
};


FirstPersonCamera.prototype.angle = function (v1, v2) {
    
    var d = Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
            
    //var ret = d * 180 / Math.PI;
    //ret = d;
    
    return d;
};


FirstPersonCamera.prototype.angleWithDir = function (v1, v2) {
    
    if (v1.length() <=0.001)
        return 0;
    
    if (v2.length() <=0.001)
        return 0;
    
    var d = Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
            
    var ret = d * 180 / Math.PI;
    //ret = d;
    //
    var dir = new pc.Vec3().cross(v1, v2);
    
    if (dir.dot(pc.Vec3.UP) < 0){
        return -ret;
    }
    
    return ret;
};


//for check click in UI Items
FirstPersonCamera.prototype.InitCheckUIList = function (pos) {
    
    this.uiItemsList = new Array();
    
    var uis = this.app.root.find(function(node) {
        return node.tags.has('mainUI'); // player
    });
    this.mainUI = uis[0];
    
    this.inputs = this.mainUI.children.filter(function(node) {
        return node.element && node.element.useInput; // player
    });
    
    
    //return false;   
};

FirstPersonCamera.prototype.checkClickInUI = function (pos) {   
    
    var cur = this;
    var node = this.inputs.find(function (node){
       
        var rect = cur.calculateElementPos(node.element);
        
        return pos.x > rect.x && pos.y > rect.y && (rect.x + rect.z) > pos.x && (rect.y + rect.w) > pos.y;
    });
    
    return node !== null && node !== undefined;
};

FirstPersonCamera.prototype.calculateElementPos = function(el) {
    if (el.entity.parent.screen){
        var w = (el.anchor.z - el.anchor.x) * el.entity.parent.screen.resolution.x;
        if (w <= 0)
        {
            w = el.width;
        }
        
        var h = (el.anchor.w - el.anchor.y) * el.entity.parent.screen.resolution.y;
        if (h <= 0)
        {
            h = el.height;
        }
        
        //anchor(x,y,z,w) = left, bottom, right and top , (0,0) left/bottom
        var ret = new pc.Vec4(el.anchor.x * el.entity.parent.screen.resolution.x,
                              
                              (1 - el.anchor.w) * el.entity.parent.screen.resolution.y,
                             
                              w ,  //width
                              h);    //height
        return ret;
    }
    else if (el.entity.parent.element)
    {
        var retParent = this.calculateElementPos(el.entity.parent.element);
        
        var w = (el.anchor.z - el.anchor.x)* retParent.z;
        if (w <= 0)
        {
            w = el.width;
        }
        
        var h = (el.anchor.w - el.anchor.y) * retParent.w;
        if (h <= 0)
        {
            h = el.height;
        }
        
        
        var ret = new pc.Vec4(el.anchor.x * retParent.z + retParent.x,  
                              (1 - el.anchor.w) * retParent.w + retParent.y,
                              w ,
                              h
                             );
        

        
        return ret;
    }
};

