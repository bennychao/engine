var vm = new Vue({
    el: '#app',
    data: {
        subdata: {
            models: [
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
            modelsSelected: '1',

            isSeen: { 'btn-warning': true },
            noSeen: { 'btn-warning': false },

            isSocial: { 'btn-warning': true },
            noSocial: { 'btn-warning': false },

            is30: { 'btn-warning': true },
            is60: { 'btn-warning': false },
            isOther: { 'btn-warning': false },

            income1: { 'btn-warning': true },
            income2: { 'btn-warning': false },
            income3: { 'btn-warning': false },
        }

    },
    created() {
        //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
        //this.couponSelected = this.couponList[0].id;
    },
    methods: {

        getCouponSelected() {
            //获取选中的优惠券
            console.log(this.couponSelected)
        },

        OnClick: function (event) {
            switch (event.target.id) {
                case "incomebtn1":
                    this.subdata.income1 = { 'btn-warning': true };
                    this.subdata.income2 = { 'btn-warning': false };
                    this.subdata.income3 = { 'btn-warning': false };
                    break;
                case "incomebtn2":
                    this.subdata.income1 = { 'btn-warning': false };
                    this.subdata.income2 = { 'btn-warning': true };
                    this.subdata.income3 = { 'btn-warning': false };
                    break;

                case "incomebtn3":
                    this.subdata.income1 = { 'btn-warning': false };
                    this.subdata.income2 = { 'btn-warning': false };
                    this.subdata.income3 = { 'btn-warning': true };
                    break;
                case "datebtn1":
                    this.subdata.is30 = { 'btn-warning': true };
                    this.subdata.is60 = { 'btn-warning': false };
                    this.subdata.isOther = { 'btn-warning': false };
                    break;
                case "datebtn2":
                    this.subdata.is30 = { 'btn-warning': false };
                    this.subdata.is60 = { 'btn-warning': true };
                    this.subdata.isOther = { 'btn-warning': false };
                    break;
                case "datebtn3":
                    this.subdata.is30 = { 'btn-warning': false };
                    this.subdata.is60 = { 'btn-warning': false };
                    this.subdata.isOther = { 'btn-warning': true };
                    break;
                case "socialbtn1":
                    this.subdata.isSocial = { 'btn-warning': true };
                    this.subdata.noSocial = { 'btn-warning': false };
                    break;
                case "socialbtn2":
                    this.subdata.isSocial = { 'btn-warning': false };
                    this.subdata.noSocial = { 'btn-warning': true };
                    break;
                case "seenbtn1":
                    this.subdata.isSeen = { 'btn-warning': true };
                    this.subdata.noSeen = { 'btn-warning': false };
                    break;
                case "seenbtn2":
                    this.subdata.isSeen = { 'btn-warning': false };
                    this.subdata.noSeen = { 'btn-warning': true };
                    break;
            }
        }

    }
})