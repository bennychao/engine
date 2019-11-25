


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