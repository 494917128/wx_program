const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
  },
  webView(e){
    e.currentTarget.dataset.src = app.webview_url + e.currentTarget.dataset.src
    util.webview(e)
  },
  onLoad: function () {
    this.setData({
      order: app.globalData.order_detail_info
    })
    console.log(app.globalData.order_detail_info)
    app.globalData.order_detail_info = null
  },
})