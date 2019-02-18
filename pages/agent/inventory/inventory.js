const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    list: [],
  },
  // 请求数据
  pageData(){
    var _this = this
    util.request({
      url: '',
      type: 'form',
      data: {
        user_id: app.globalData.agentInfo.user_id
      },
      success: function (res) {
        _this.setData({
          list:res.data.list
        })
      }
    })
  },
  onLoad: function (options) {
    this.pageData()
  }
})