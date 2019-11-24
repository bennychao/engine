var selectCard = 1;

var app1 = new Vue({
    el: '#app',
    data: {
      sites: [
        { name: 'Runoob', id :'1', isRecommend: {'is-recommend': true}},
        { name: 'Google', id : '2'},
        { name: 'Taobao', id : '3', isFocused: {'is-focused': false}},
        { name: 'Google', id : '4'},
        { name: 'Google', id : '5'},
        { name: 'Google', id : '6'},
        { name: 'Google', id : '7'},
        { name: 'Google', id : '8'},
        { name: 'Google', id : '9'},
        { name: 'Google', id : '10'},
        { name: 'Google', id : '11'},
        { name: 'Google', id : '12'},
        { name: 'Google', id : '13'},
        { name: 'Google', id : '14'},
        { name: 'Google', id : '15'},
        { name: 'Google', id : '16'},
        { name: 'Google', id : '17'},
        { name: 'Google', id : '18'}
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
        selectCard =new Number(event.target.id);

        app1.sites.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        app1.sites[selectCard - 1].isFocused = {'is-focused': true};
      }
    }
  })


  var selectCardShow = 1;

var app1 = new Vue({
    el: '#app2',
    data: {
      sites: [
        { name: 'Runoob', id :'1', isRecommend: {'is-recommend': true}},
        { name: 'Google', id : '2'},
        { name: 'Taobao', id : '3', isFocused: {'is-focused': false}},
        { name: 'Google', id : '4'},
        { name: 'Google', id : '5'}
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
        selectCardShow =new Number(event.target.id);

        app1.sites.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        app1.sites[selectCardShow - 1].isFocused = {'is-focused': true};
      }
    }
  })