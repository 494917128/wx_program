const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
  },
  saveImage() {
    var _this = this
    util.authorize('scope.writePhotosAlbum', function () {
      util.saveImage({
        url: _this.data.src,
        callback(res) {
          wx.showToast({
            title: '保存成功',
          })
        }
      })
    }, this)
  },
  onLoad: function (options) {
    this.setData({
      src: decodeURIComponent(options.src || '')
    })
  },
})