const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {

  },

  onLoad: function (e) {
    var _this = this
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        console.log(res.data)
        if(res.data){
          wx.reLaunch({
            url: '/pages/agent/index'
          })
        }
      },
    })
  },
})