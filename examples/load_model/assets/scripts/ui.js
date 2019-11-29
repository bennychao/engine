var Ui = pc.createScript('ui');




Ui.attributes.add('css', {type: 'asset', assetType:'css', title: 'CSS Asset'});
Ui.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

Ui.attributes.add('class', {
    type: 'string',
    title: 'class',
    default: "ui"
});

Ui.attributes.add('target', {
    type: 'entity',
    title: 'Target',
    description: 'The Entity to lookat'
});

Ui.attributes.add('ifBind', {
    type: 'boolean',
    title: 'ifBind',
    default: false
});

Ui.attributes.add('ifSupportZ', {
    type: 'boolean',
    title: 'ifSupportZ',
    default: false
});

Ui.attributes.add('nearZ', {
    type: 'number',
    title: 'maxZ',
    default: 0
});

Ui.attributes.add('farZ', {
    type: 'number',
    title: 'maxZ',
    default: 10
});


Ui.prototype.initialize = function () {
    // create STYLE element
    var style = document.createElement('style');

    // append to head
    document.head.appendChild(style);
    style.innerHTML = this.css.resource || '';
    
    
    
    // Add the HTML
    this.div = document.createElement('div');
    this.div.classList.add(this.class + '_container');
    this.div.setAttribute('id', 'uiItem_' + this.entity.name);
     
    if (this.entity.element)        
    {
        this.div.setAttribute('v-bind:style', "{ top: posY + 'px', left: posX + 'px', transform: 'scale(' + posZ+ ')', width : width + 'px', height:height + 'px'}");
    }
    else 
    {
        this.div.setAttribute('v-bind:style', "{ top: posY + 'px', left: posX + 'px', transform: 'scale(' + posZ+ ')'}");
    }
    
    this.div.innerHTML = this.html.resource || '';
    
    // append to body
    // can be appended somewhere else
    // it is recommended to have some container element
    // to prevent iOS problems of overfloating elements off the screen
    document.body.appendChild(this.div);
    
    this.counter = 0;
    
    this.bindEvents();
    
    var uis = this.app.root.find(function(node) {
        return node.tags.has('mainUI'); // player
    });
    this.mainUI = uis[0];
    
    
    var node = this.app.root.children[0].findByName("camera");
    this.camera =  node.script.first_person_camera;
    
    this.cameraNode = node;
    
    this.uiItem =new Vue({
        el: '#uiItem_' + this.entity.name,
        data: {
            count: 80,
            posX: 80,
            posY: 100,
            posZ: 1,
            width: 100,
            height: 60
        }
      });
    
    this.updateUIPos();
};

Ui.prototype.update = function(dt) {
        this.updateUIPos();
    if (this.ifBind)
    {
        var pos = this.entity.getPosition();
        var coord = this.cameraNode.camera.worldToScreen(pos);
         
        this.uiItem.posX = coord.x;
        //this.uiItem.posY = this.mainUI.screen.resolution.y - coord.y;
        this.uiItem.posY = coord.y;
        
        if (this.ifSupportZ)
        {
            this.uiItem.posZ = Math.max (0, this.farZ - coord.z) / this.farZ;
        }

    }

};

Ui.prototype.updateUIPos = function() {
    if (this.entity.element) 
    {
        var ret =this.calculateElementPos(this.entity.element);
        
        this.uiItem.posX = ret.x;
        this.uiItem.posY = ret.y;
        
        this.uiItem.height = ret.w;
        this.uiItem.width = ret.z;
    }
};

Ui.prototype.bindEvents = function() {
    var self = this;
    // example
    //
    // get button element by class
    var button = this.div.querySelector('.button');
    var counter = this.div.querySelector('.counter');
    // if found
    if (button) {
        // add event listener on `click`
        button.addEventListener('click', function() {
            ++self.counter;
            if (counter)
                counter.textContent = self.counter;
            
            console.log('button clicked');
            
            this.camera.faceTo(target);

            // try to find object and change its material diffuse color
            // just for fun purposes
            var obj = pc.app.root.findByName('chamferbox');
            if (obj && obj.model && obj.model.model) {
                var material = obj.model.model.meshInstances[0].material;
                if (material) {
                    material.diffuse.set(Math.random(), Math.random(), Math.random());
                    material.update();
                }
            }
        }, false);
    }

    if (counter)
        counter.textContent = self.counter;
    
    //try to VUE bind(in my loader)
};


Ui.prototype.calculateElementPos = function(el) {
    if (el.entity.parent.screen){
        //anchor(x,y,z,w) = left, bottom, right and top , (0,0) left/bottom
        var ret = new pc.Vec4(el.anchor.x * el.entity.parent.screen.resolution.x,
                              
                              (1 - el.anchor.w) * el.entity.parent.screen.resolution.y,
                             
                              (el.anchor.z - el.anchor.x) * el.entity.parent.screen.resolution.x,  //width
                              (el.anchor.w - el.anchor.y) * el.entity.parent.screen.resolution.y);    //height
        return ret;
    }
    else if (el.entity.parent.element)
    {
        var retParent = this.calculateElementPos(el.entity.parent.element);
        
        var ret = new pc.Vec4(el.anchor.x * retParent.z + retParent.x,  
                              (1 - el.anchor.w) * retParent.w + retParent.y,
                              (el.anchor.z - el.anchor.x) * retParent.z,
                              (el.anchor.w - el.anchor.y) * retParent.w
                             );
        

        
        return ret;
    }
};