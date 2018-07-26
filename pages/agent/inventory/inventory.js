const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
  },
  // 请求数据
  pageData(){
    util.request({
      url: '',
      type: 'form',
      data: {
        
      },
      success: function (res) {
      }
    })
  },
  onLoad: function (options) {
    this.pageData()
  }
})