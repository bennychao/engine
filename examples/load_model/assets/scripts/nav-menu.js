var NavMenu = pc.createScript('navmenu');

NavMenu.attributes.add("item", {type: "entity", title: "base item"});
NavMenu.attributes.add("configFile", { type: 'string'});
NavMenu.attributes.add("target", {type: "entity", title: "event handler"});

// initialize code called once per entity
NavMenu.prototype.initialize = function() {

    // Get the camera in a state where it can start a camera pan
    pc.http.get("./assets/configs/" + this.configFile, function (err, response) {
        this.initList(response);
    });
};

// update code called every frame
NavMenu.prototype.update = function(dt) {

};                                                                                                          

NavMenu.prototype.initList = function(configs){
    var cur = this.item;

    var target = this.target;

    configs.items.forEach( it => {
        
        cur.text = it.name;
        cur.image = it.imageUrl;

        cur.button.on('pressedend', function () {
            //label.translateLocal(0, -4, 0);
            target.fire("click", it);
        });

        //cur count = it.count

    });
}