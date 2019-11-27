

//cars tab
var cars = new Vue({
    el: '#cars',
    data: {
      show: true,
      selectCard: 1,
      sites1: [
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
      ],
      sites2: [
        { name: 'Runoob2', id :'1', isRecommend: {'is-recommend': true}},
        { name: 'Google2', id : '2'},
        { name: 'Taobao2', id : '3', isFocused: {'is-focused': false}},
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
      OnClickSite1: function (event) {
        // `this` 在方法里指当前 Vue 实例
         //alert('Hello ' + this.name + '!')
        // // `event` 是原生 DOM 事件
        // if (event) {
        //     alert(event.target.tagName)
        // }
        cars.selectCard =new Number(event.target.id);

        cars.sites1.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        cars.sites1[cars.selectCard - 1].isFocused = {'is-focused': true};
      },

      OnClickSite2: function (event) {
        selectCard =new Number(event.target.id);

        cars.cars.sites2.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        cars.sites2[cars.selectCard - 1].isFocused = {'is-focused': true};
      }
    }
  });

var brands = new Vue({
  el: '#brands',
  data: {
    show: true,
    selectCard: 1,
    sites1: [
      { name: 'brands', id :'1', isRecommend: {'is-recommend': true}},
      { name: 'brands', id : '2'},
      { name: 'brands', id : '3', isFocused: {'is-focused': false}},
      { name: 'brands', id : '4'},
      { name: 'Google', id : '5'},
      { name: 'brands', id : '6'},
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
    ],
    sites2: [
      { name: 'Runoob2', id :'1', isRecommend: {'is-recommend': true}},
      { name: 'Google2', id : '2'},
      { name: 'Taobao2', id : '3', isFocused: {'is-focused': false}},
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
    OnClickSite1: function (event) {
      // `this` 在方法里指当前 Vue 实例
       //alert('Hello ' + this.name + '!')
      // // `event` 是原生 DOM 事件
      // if (event) {
      //     alert(event.target.tagName)
      // }
      cars.selectCard =new Number(event.target.id);

      cars.sites1.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      cars.sites1[cars.selectCard - 1].isFocused = {'is-focused': true};
    },

    OnClickSite2: function (event) {
      selectCard =new Number(event.target.id);

      cars.cars.sites2.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      cars.sites2[cars.selectCard - 1].isFocused = {'is-focused': true};
    }
  }
});

var tabs = new Vue(
  {
    el: '#tabs',
    methods: {
      OnClickCars: function (event) {
        cars.show = true;
        brands.show = false;
      },

      OnClickBrands: function (event) {
        cars.show = false;
        brands.show = true;
      },

      OnClickSearches: function (event) {
        cars.show = false;
        brands.show = false;
      }
    }
  }
)
//for nav bar
  var selectCardShow = 1;

var app2 = new Vue({
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

        app2.sites.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        app2.sites[selectCardShow - 1].isFocused = {'is-focused': true};
      }
    }
  });