var vm = new Vue({
    el: '#app',
    data:{
        couponList:[
            {
                id: 'A',
                name: '优惠券1'
            },
            {
                id: '1',
                name: '优惠券2'
            },
            {
                id: '2',
                name: '优惠券3'
            }
        ],
        couponSelected: '',
    },
    created(){
　　　　　　　　　　　　//如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
        this.couponSelected = this.couponList[0].id;
    },
    methods:{

　　　　　　　　　　　　getCouponSelected(){
            //获取选中的优惠券
            console.log(this.couponSelected)
        }


    }
})