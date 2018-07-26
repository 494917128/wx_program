const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    select: false,
  },
  // 选择默认收货地址
  radioChange(e){
    this.setData({
      index_checked: e.detail.value
    })
  },
  // 添加收货地址
  addAddress(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  // 选择地址
  selectAddress(){
    // 设置上一个页面的参数
    util.prevPage({
      aa: 1
    })
  },
  onLoad: function (e) {
    // 判断是管理收货地址还是选择收货地址
    if(e.select){
      this.setData({
        select: true
      })
    }
  },
})