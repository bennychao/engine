

//cars tab
var cars = new Vue({
    el: '#cars',
    data: {
      show: false,
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
        this.selectCard =new Number(event.target.id);

        this.sites1.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        this.sites1[this.selectCard - 1].isFocused = {'is-focused': true};
      },

      OnClickSite2: function (event) {
        this.selectCard =new Number(event.target.id);

        this.sites2.forEach(element => {
          element.isFocused = {'is-focused': false};
        });
        this.sites2[this.selectCard - 1].isFocused = {'is-focused': true};
      }
    }
  });

var brands = new Vue({
  el: '#brands',
  data: {
    show: false,
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
      this.selectCard =new Number(event.target.id);

      this.sites1.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      this.sites1[this.selectCard - 1].isFocused = {'is-focused': true};
    },

    OnClickSite2: function (event) {
      this.selectCard =new Number(event.target.id);

      this.sites2.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      this.sites2[this.selectCard - 1].isFocused = {'is-focused': true};
    }
  }
});

var searches = new Vue({
  el: '#searches',
  data: {
    show: false,
    selectCard: 1,
    sites1: [
      { name: 'earches', id :'1', isRecommend: {'is-recommend': true}},
      { name: 'earches', id : '2'},
      { name: 'earches', id : '3', isFocused: {'is-focused': false}},
      { name: 'earches', id : '4'},
      { name: 'earches', id : '5'},
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
      this.selectCard =new Number(event.target.id);

      this.sites1.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      this.sites1[this.selectCard - 1].isFocused = {'is-focused': true};
    },

    OnClickSite2: function (event) {
      this.selectCard =new Number(event.target.id);

      this.sites2.forEach(element => {
        element.isFocused = {'is-focused': false};
      });
      this.sites2[this.selectCard - 1].isFocused = {'is-focused': true};
    }
  }
});

// tabs controller
var tabs = new Vue(
  {
    el: '#tabs',
    data:{
      isCarsActived: {'active': false},
      isBrandsActived: {'active': false},
      isSearchActived: {'active': false}
    },
    methods: {
      OnClickCars: function (event) {
        cars.show = true;
        brands.show = false;
        searches.show = false;

        tabs.isCarsActived = {'active': true};
        tabs.isBrandsActived = {'active': false};
        tabs.isSearchActived = {'active': false};
      },

      OnClickBrands: function (event) {
        cars.show = false;
        brands.show = true;
        searches.show = false;

        tabs.isCarsActived = {'active': false};
        tabs.isBrandsActived = {'active': true};
        tabs.isSearchActived = {'active': false};
      },

      OnClickSearches: function (event) {
        cars.show = false;
        brands.show = false;
        searches.show = true;

        tabs.isCarsActived = {'active': false};
        tabs.isBrandsActived = {'active': false};
        tabs.isSearchActived = {'active': true};
      }
    }
  }
)
//for nav bar
//   var selectCardShow = 1;

// var app2 = new Vue({
//     el: '#app2',
//     data: {
//       sites: [
//         { name: 'Runoob', id :'1', isRecommend: {'is-recommend': true}},
//         { name: 'Google', id : '2'},
//         { name: 'Taobao', id : '3', isFocused: {'is-focused': false}},
//         { name: 'Google', id : '4'},
//         { name: 'Google', id : '5'}
//       ]
//     },
//     methods: {
//       click: function (event) {
//         // `this` 在方法里指当前 Vue 实例
//          //alert('Hello ' + this.name + '!')
//         // // `event` 是原生 DOM 事件
//         // if (event) {
//         //     alert(event.target.tagName)
//         // }
//         selectCardShow =new Number(event.target.id);

//         app2.sites.forEach(element => {
//           element.isFocused = {'is-focused': false};
//         });
//         app2.sites[selectCardShow - 1].isFocused = {'is-focused': true};
//       }
//     }
//   });

  // var sidebar = new Vue({
  //   el: '#sidebar',
  //   data: {
  //     show : false
  //   },
  //   methods: {
  //     OnClickCars: function (event) {
  //       container.show = false;
  //     },

  //     OnClickBrands: function (event) {
  //       container.show = false;
  //     },

  //     OnClickSearches: function (event) {
  //       container.show = false;
  //     }
  //   }
  // });

  
var DoT = function (length) {
  this.length = length;
  this.count = 0;

  this.inc = function () {
      this.count++;
  };

  this.done = function () {
      return (this.count === this.length);
  };
};


  var navOpened = new Vue({
    el: '#nav-opened',
    data: {
      show : true
    },
    methods: {
      OnClick: function (event) {
        container.show = true;
        //$("#sidebar").hide();
      　$("#sidebar").removeClass("sibebar-wrapper-enter-active");
        $("#sidebar").addClass("sibebar-wrapper-leave-active");
        　　setTimeout(function(){
                  $("#sidebar").removeClass("sibebar-wrapper-leave-active");
                 $("#sidebar").hide();
          　　},500);
        navOpened.show = false;
        //sidebar.show = true;
        cars.show = false;
        brands.show = false;
        searches.show = false;

        tabs.isCarsActived = {'active': false};
        tabs.isBrandsActived = {'active': false};
        tabs.isSearchActived = {'active': false};
      }
    }
  });

  var container = new Vue({
    el: '#container',
    data: {
      show : true
    },
    methods: {
      onClickTest: function (event) {
        container.show = false;
      },

      OnClickCars: function (event) {
        container.show = false;
        $("#sidebar").show();
        $("#sidebar").removeClass("sibebar-wrapper-leave-active");
        $("#sidebar").addClass("sibebar-wrapper-enter-active");
    　　setTimeout(function(){
      　　　　$("#sidebar").removeClass("sibebar-wrapper-enter-active");
      　　},500);
        navOpened.show = true;
        tabs.isCarsActived =  {'active': true};
        cars.show = true;
        //sidebar.show = true;
      },

      OnClickBrands: function (event) {
        container.show = false;
        $("#sidebar").show();
        $("#sidebar").removeClass("sibebar-wrapper-leave-active");
        $("#sidebar").addClass("sibebar-wrapper-enter-active");
    　　setTimeout(function(){
      　　　　$("#sidebar").removeClass("sibebar-wrapper-enter-active");
      　　},500);
        navOpened.show = true;
        brands.show = true;
        tabs.isBrandsActived =  {'active': true};
        //sidebar.show = true;
      },

      OnClickSearches: function (event) {
        container.show = false;
        $("#sidebar").show();
        $("#sidebar").removeClass("sibebar-wrapper-leave-active");
        $("#sidebar").addClass("sibebar-wrapper-enter-active");
    　　setTimeout(function(){
      　　　　$("#sidebar").removeClass("sibebar-wrapper-enter-active");
      　　},500);
        navOpened.show = true;
        searches.show = true;
        tabs.isSearchActived =  {'active': true};
        //sidebar.show = true;
      }
    }
  });


  var splash = new Vue({
    el: '#application-splash',
    data: {
      show : true,
      progress: 90
    }
  });

