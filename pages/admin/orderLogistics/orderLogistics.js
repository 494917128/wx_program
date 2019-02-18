const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    shipping: {},
    Reason: ' ',
  },
  previewImage(){
    var factory_img = this.data.factory_img
    wx.previewImage({
      current: app.image_url+factory_img,
      urls: [app.image_url+factory_img],
    })
  },
  // 请求数据
  pageData() {
    var _this = this
    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/order/order-logistics',
      type: 'form',
      data: {
        order_id: _this.data.id || '',
      },
      success: function (res) {
        var shipping = res.data.data.shipping,
          shipping_name = res.data.data.shipping_info.shipping_name,
          LogisticCode = res.data.data.shipping.LogisticCode,
          Reason = res.data.data.shipping.Reason,
          factory_img = res.data.data.factory_img
        shipping.Traces.reverse() // 倒叙
        _this.setData({
          shipping: shipping,
          shipping_name: shipping_name,
          LogisticCode: LogisticCode,
          Reason: Reason,
          factory_img: factory_img,
        })
      },fail(){
        _this.setData({
          Reason: ''
        })
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.pageData()
  },

})