const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {
    url: app.url,
    canIUse: wx.canIUse('web-view')
  },

  onLoad: function (e) {
    var src = e.src || ''

    src = decodeURIComponent(e.src)
    if (!src) {
      wx.navigateBack({
        delta: '1',
      })
      return
    }
    this.setData({
      src: src,
      title: e.title
    })

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
  onShareAppMessage: function () {
    var src = this.data.src
    console.log('/pages/webView/webView?src=' + encodeURIComponent(src)) + '&title=' + this.data.title
    return {
      title: this.data.title,
      path: '/pages/webView/webView?src=' + encodeURIComponent(src) + '&title=' + this.data.title
    }
  }
})