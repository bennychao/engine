var select = 1;

var app1 = new Vue({
    el: '#app',
    data: {
      sites: [
        { name: 'Runoob', id :'1', selected: {'btn-my-focus': false}},
        { name: 'Google', id : '2', selected: {'btn-my-focus': false}},
        { name: 'Taobao', id : '3', selected: {'btn-my-focus': false}}
      ]
    },
    methods: {
      click: function (event) {
        // `this` 在方法里指当前 Vue 实例
         //alert('Hello ' + this.name + '!')
        // // `event` 是原生 DOM 事件
        // if (event) {
        //     alert(event.target.tagName)
        // }
        select =new Number(event.target.id);

        app1.sites.forEach(element => {
          element.selected = {'btn-my-focus': false};
        });
        app1.sites[select - 1].selected = {'btn-my-focus': true};
      }
    }
  })