const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
  },
  saveImage() {
    util.saveImage({
      url: this.data.src,
      callback(res) {
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      src: decodeURIComponent(options.src || '')
    })
  },
})