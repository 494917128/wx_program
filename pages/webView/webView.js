const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {
    url: app.url,
    canIUse: wx.canIUse('web-view')
  },

  onLoad: function (e) {
    if (!app.globalData.noticeContent) {
      wx.navigateBack({
        delta: '1',
      })
      return
    }
    this.setData({
      src: app.globalData.noticeContent
    })
    app.globalData.noticeContent = null
    if (!this.data.canIUse) {
      wx.showModal({ 
        title: '提示', 
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。', 
        success(){
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
})