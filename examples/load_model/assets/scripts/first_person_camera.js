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
    
};

FirstPersonCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);

    if (!this.bSteering && !this.bTargeting)
        this.checkMouseMove();

    var mat = this.entity.getWorldTransform();

    if (this.force.length()) {
        var pos = mat.transformPoint(this.force);
        var cur = this.entity.position;
        pos = pos.sub(cur);
        this.entity.translate(pos.x, 0, pos.z);
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
    if (this.app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.force.x = pc.math.lerp(this.force.x, -this.speed, 0.01);
    } 
    else if (this.app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.force.x = pc.math.lerp(this.force.x, this.speed, 0.01);
    }
    else
    {
        this.force.x = pc.math.lerp(this.force.x, 0, 0.1);
    }

    if (this.app.keyboard.isPressed(pc.KEY_UP)) {
        this.force.z = pc.math.lerp(this.force.z, -this.speed, 0.01);
    } 
    else if (this.app.keyboard.isPressed(pc.KEY_DOWN)) {
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
    if (!this.bSteering && !this.bTargeting && !this.bMouseDown) {  // && !pc.Mouse.isPointerLocked()
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
                    //this.moveTo(ret.pos);
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
    var dir = this.target.forward.clone();
    dir.scale(1);
    
    var pos = this.target.getPosition();
    
    pos.add(dir);
    
    pos.y = this.entity.getPosition().y;
    
    this.entity.setPosition(pos);
    
    pos = this.target.getPosition();
    
    this.entity.lookAt(pos);
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
    
    var onupdateFunc = function(){     
        
        var t = target.clone();
        t.y = cur.entity.getPosition().y;
        t.sub(cur.entity.getPosition());
        
       //check if stop
        
        //var dis = t.distance(this.entity.getPosition());
        if (t.lengthSq() < 0.5 || cur.checkObstacle())
            {
                cur.off("onUpdate");
                this.bTargeting = false;
                this.force.x = 0;
                this.force.z = 0;
               // this.force.x = pc.math.lerp(this.force.x, 0, 0.1);
               // this.force.z = pc.math.lerp(this.force.z, 0, 0.1);
            }
        else
            {
                t.normalize(); 

                t.scale(cur.speed);

                this.force.x = pc.math.lerp(this.force.x, t.x, 0.1);
                this.force.z = pc.math.lerp(this.force.z, t.z, 0.1);
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
    
    collisions.forEach(function (node){
        
        if (node.collision.type == "box"){
            
            var box = new pc.BoundingBox(node.getPosition(), node.collision.halfExtents);
            this.obstacleList.push(box);
        }
        else  if (node.collision.type == "sphere"){
            
            var sphere = new pc.BoundingSphere(node.getPosition(), node.collision.halfExtents.x);
            this.obstacleList.push(sphere);
        }
    
    }); 
};


FirstPersonCamera.prototype.checkObstacle = function (vec) {
    var obs = this.obstacleList.filter(function(ob) {
        return ob.containsPoint(vec);
    });
    return obs.size() > 0;
};


FirstPersonCamera.prototype.angle = function (v1, v2) {
    
    var d = Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
            
    //var ret = d * 180 / Math.PI;
    //ret = d;
    
    return d;
};