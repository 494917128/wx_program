const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    my_code_show: false,
    // swpier:[],
    // nav_list: ["产品详情", "联系经销商"],
    // nav_index: 0,
    // scroll_top: 0,
    // detail_table: {
    //   head: ['等级', '数量', '价格', '总金额'],
    //   body: [
    //     ['体验', '2盒', '269元', '538元'],
    //     ['代言', '5盒', '199元', '995元'],
    //     ['团购', '10盒', '169元', '1690元'],
    //     ['核心', '30盒', '149元', '4470元'],
    //     ['官方', '600盒', '119元', '71400元'],
    //   ]
    // },
    // buy_goods: false,
  },
  myCode() {
    util.myCode(this)
  },
  onLoad (e){
    var imgs = e.imgs.split(',')
    this.setData({
      imgs: imgs
    })
    util.requestIndex(this, app.globalData.show_user)
  },

  // navbar(e) {
  //   var index = e.detail.currentTarget.dataset.index
  //   if (index == this.data.nav_index)
  //     return;
  //   if (index == 1){
  //     this.setData({
  //       scroll_top: 10000
  //     })
  //   }
  //   this.setData({
  //     // nav_index: index,
  //     notice_content: false,
  //   })
  // },
  // buyGoods(){
  //   var _this = this
  //   wx.getStorage({
  //     key: 'userId',
  //     success: function(res) {
  //       _this.setData({
  //         buy_goods: true
  //       })
  //     },
  //     fail: function(){
  //       wx.showModal({
  //         title: '提示',
  //         content: '您未登录，请前往系统下单',
  //       })
  //     }
  //   })
  // },
  // buyGoodsClose(){
  //   this.setData({
  //     buy_goods: false
  //   })
  // },
  // // 阻止冒泡
  // stop(){},
  // onLoad: function (e) {
  //   this.setData({
  //     swiper: [e.image],
  //     name: e.name
  //   })
  //   wx.setNavigationBarTitle({
  //     title: e.name,
  //   })

  //   util.requestIndex(this, app.globalData.show_user)
  // },
})