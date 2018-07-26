const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    my_code_show: false,
  },

  myCode() {
    util.myCode(this)
  },

  buy(e){
    wx.showModal({
      title: '提示',
      content: '该版本暂不支持购买，请前往结算系统进行购买',
      success(res){
        // if (res.confirm) util.webview(e)
      }
    })
  },
  onLoad: function () {
    util.requestIndex(this, app.globalData.show_user)
  },
})