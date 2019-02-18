const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
  },
  // 请求列表
  pageData() {
    var _this = this
    _this.setData({ loading: true })// 加载中
    this.ajax = util.request2({
      url: 'v1/meet/get-meet-list',
      method: 'POST',
      type: 'form',
      data: {
        Page: 1,
      },
      success: function (res) {
        _this.setData({
          src: res.data.data.list[0].meet_img,
          id: res.data.data.list[0].meet_id,
        })
      }
    })
  },
  onLoad: function (options) {
    this.pageData()
  },
})