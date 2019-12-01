


let position = { x: 0 }

const tweenA = new TWEEN.Tween(position).to({ x: 500 }, 1000).onUpdate(function(){

    //div.style.left = position.x +'px'
    console.log("test");

}).start();


function animate(){ 

    requestAnimationFrame(animate); // requestAnimationFrame可以看成setTimeout(animate, 17)

    TWEEN.update(); // 每隔一段时间，update方法会调用上面的onUpdate函数，这样让left变化，小球位置也变化

 }

 animate();
 

var v =new Vue({
    el: '#app',
    data: {
        count: 100
    },
    methods: {
  　　setTimer: function () {
  　　　　this.timer = setInterval( () => {
              this.count ++;
  　　　　　　}, 1000)
  　　    }
      }
  });

v.setTimer();

let promise = new Promise(function(resolve, reject){
    $.ajaxSetup({
        
            cache: true
        
        });
    $.getScript('https://code.playcanvas.com/playcanvas-stable.dbg.js',function(){
        //alert('done');
        
       });
    resolve()
});


//promise.then(() => console.log("BBB"));
console.log("CCC")




 // not sync
 //document.writeln("<script src=\"https://code.playcanvas.com/playcanvas-stable.dbg.js\"></script>");


// function loadJs(url,callback){
//     var script=document.createElement('script');
//     script.type="text/javascript";
//     if(typeof(callback)!="undefined"){
//     if(script.readyState){
//     script.onreadystatechange=function(){
//      if(script.readyState == "loaded" || script.readyState == "complete"){
//      script.onreadystatechange=null;
//      callback();
//      }
//     }
//     }else{
//     script.onload=function(){
//      callback();
//     }
//     }
//     }
//     script.src=url;
//     document.body.appendChild(script);
//     }
//     loadJs("https://code.playcanvas.com/playcanvas-stable.dbg.js",function(){
//     alert('done');
//     });