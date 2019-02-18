const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    user: {}
  },

  onLoad: function (options) {
    var _this = this
    this.setData({
      user: options
    })
    if (options.type == 'leader') { //领导人信息
      util.request({
        url: 'user/parent-user',
        type: 'form',
        method: 'post',
        data: {
          user_id: app.globalData.agentInfo.user_id
        },
        success: function (res) {
          _this.setData({
            user: res.data.data
          })
        }
      })
    }
  }
})