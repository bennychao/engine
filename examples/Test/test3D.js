var v =new Vue({
    el: '#app',
    data: {
        count: 80,
        posX: 80,
        posY: 100,
        posZ: 0.5,
        width: 100,
        height: 60
    },
    methods: {
  　　setTimer: function () {
  　　　　this.timer = setInterval( () => {
              this.count ++;
  　　　　　　}, 1000)
  　　    }
      }
  });



//   var position = { y: formY };

//   var pos = this.carNavPanel.getLocalPosition();

//   var cur = this;
//   var tweenA = new TWEEN.Tween(position).to({ y: this.carNavPosY - this.curNavUIHeight }, 300)
//       .onStart(function () {

//       })
//       .onUpdate(function () {
//           pos.y = position.y;
//           cur.carNavPanel.setLocalPosition(pos);
//       })
//       .onStop(function () {
//           cur.carNavPanel.enabled = false;
//       })
//       .start();