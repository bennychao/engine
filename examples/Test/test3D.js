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