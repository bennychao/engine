
//common function
var calculateElementPos = function(el) {
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
        var retParent = calculateElementPos(el.entity.parent.element);
        if (!retParent)   {
            var ret = new pc.Vec4();
            return ret;
        }

            
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
        
        var offsetX = 0;
        
        if (el.entity.tags.has("followable")){
            offsetX = el.entity.getLocalPosition().x;
        }
        
        var ret = new pc.Vec4(el.anchor.x * retParent.z + retParent.x + offsetX,  
                              (1 - el.anchor.w) * retParent.w + retParent.y,
                              w ,
                              h
                             );
        

        
        return ret;
    }
};

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

Ui.attributes.add('uiParent', {
    type: 'entity',
    title: 'uiParent',
    description: 'The Entity to uiParent'
});


Ui.attributes.add('ifBind', {
    type: 'boolean',
    title: 'ifBind',
    default: false
});

Ui.attributes.add('ifAutoBindAsset', {
    type: 'boolean',
    title: 'ifAutoBindAsset',
    default: true
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

Ui.attributes.add('styles', { 
    type: 'string',
    array:true,
    title: 'styles'
});

Ui.prototype.initialize = function (){
    var cur = this;
    
    this.entity.on("bind", this.bindAssets, this);
    this.entity.on("changeData", this.changeData, this);
    

    this.entity.on("destroy", function(e){
        //document.body.appendChild(this.div);
        if (cur.div) 
        {
            var self = document.getElementById('uiItem_' + e.name);

            if (this.uiParent){
                //$('#uiItem_' + this.uiParent.name).remove(self);
                $('#uiItem_' + e.name).remove();
            }
            else{
                document.body.removeChild(self);
            }

            //cur.div.remove();
        }
    }, this);

    if (this.ifAutoBindAsset){
        
        if (this.uiParent && this.uiParent.script.ui && !this.uiParent.script.ui.isBinded)
            this.uiParent.on("bindAssets", function (){
                cur.bindAssets();
            });
        else
            this.bindAssets();
    }
    

};


Ui.prototype.bindAssets = function () {
    var cur = this;
    // create STYLE element
    var style = document.createElement('style');

    // append to head
    document.head.appendChild(style);
    style.innerHTML = this.css.resource || '';
    
    if (this.styles){
        this.styles.forEach(function (path){
            var fileref=document.createElement("link");
            fileref.rel="stylesheet"; 
            fileref.type="text/css"; 
            fileref.href=path; 
            
            document.head.appendChild(fileref);
        });
    }
    
    // Add the HTML
    this.div = document.createElement('div');
    this.div.classList.add(this.class + '_container');
    this.div.setAttribute('id', 'uiItem_' + this.entity.name);
     this.div.setAttribute('v-show', "show");
    if (this.entity.element)        
    {
        this.div.setAttribute('v-bind:style', "{ top: posY + 'px', left: posX + 'px', transform: 'scale(' + posZ+ ')', width : width + 'px', height:height + 'px'}");
    }
    else 
    {
        this.div.setAttribute('v-bind:style', "{ top: posY + 'px', left: posX + 'px', transform: 'scale(' + posZ+ ')'}");
    }
    
    if (this.html)
        this.div.innerHTML = this.html.resource || '';
    
    
    // append to body
    // can be appended somewhere else
    // it is recommended to have some container element
    // to prevent iOS problems of overfloating elements off the screen
    // 
    if (this.uiParent){
        //this.uiParent.script.ui.div.appendChild(this.div);
        //this.uiParent.script.ui.div.appendChild("<div>testet1233123</div>");
        //document.body.appendChild(this.div);
        //must find the div first
        $('#uiItem_' + this.uiParent.name).append(this.div);
    }
    else
        document.body.appendChild(this.div);
    
    this.counter = 0;
    
    this.bindEvents();
    
    var uis = this.app.root.find(function(node) {
        return node.tags.has('mainUI'); // player
    });
    this.mainUI = uis[0];
    
    
    var node = this.app.root.children[0].findByName("Camera");
    //this.camera =  node.script.first_person_camera;
    
    this.cameraNode = node;

    //this.bindVueSubData = null;

    var bindVueSubData  = this.bindVueSubData;

    this.uiItem =new Vue({
        el: '#uiItem_' + this.entity.name,
        data: {
            show: true,
            count: 80,
            posX: 80,
            posY: 100,
            posZ: 1,
            width: 100,
            height: 60,
            string: "1.1w",

            subdata: bindVueSubData

        },
         methods: {
            OnOk: function (event) {
                cur.entity.fire("onOk");
            },
            OnCancel: function (event) {
                cur.entity.fire("onCancel");
            },
            OnClick: function (event) {
                cur.entity.fire("onClick", event);
            },
         }
      });
    
    this.updateUIPos();

    if (this.bindJs){
        this.bindJs();
    }
    
    this.entity.fire("bindAssets");

    this.isBinded = true;
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
            if (coord.z > 0)
                this.uiItem.posZ = Math.max (0, this.farZ - coord.z) * 3 / this.farZ;
            else
                this.uiItem.posZ = 0;
        }

    }

};

Ui.prototype.updateUIPos = function() {
    if (this.entity.element && this.uiItem !== undefined) 
    {
        var ret =calculateElementPos(this.entity.element);
        
        if (this.uiParent){
            var retParent =calculateElementPos(this.uiParent.element);
            
            this.uiItem.posX = ret.x - retParent.x;
            this.uiItem.posY = ret.y - retParent.y;

            this.uiItem.height = ret.w;
            this.uiItem.width = ret.z;
        }
        else{
            var pivotX = (this.entity.element.pivot.x * (ret.z));
            var curX = this.entity.getLocalPosition().x;

            var pivotY = (this.entity.element.pivot.y * (ret.w));
            var curY = this.entity.getLocalPosition().y;

            this.uiItem.posX = ret.x + (curX - pivotX);
            this.uiItem.posY = ret.y+ (curY - pivotY);

            this.uiItem.height = ret.w;
            this.uiItem.width = ret.z;           
        }

    }
};

Ui.prototype.showUI =function(){
    if (this.uiItem)
        this.uiItem.show = true;
};

Ui.prototype.hideUI =function(){
    if (this.uiItem)
        this.uiItem.show = false;
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
            
            //this.camera.faceTo(target);

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

Ui.prototype.changeData = function(data) {
    this.uiItem.string = data;
};

