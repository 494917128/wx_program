const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
  },
  webView(e) {
    e.currentTarget.dataset.src = app.webview_url + e.currentTarget.dataset.src
    util.webview(e)
  },
  // 复制订单号
  numberCopy() {
    var _this = this
    wx.showActionSheet({
      itemList: ['复制订单号'],
      success(res) {
        wx.setClipboardData({ data: _this.data.order.order_sn })
      }
    })
  },
  // 复制收货地址
  addressCopy() {
    var _this = this
    wx.showActionSheet({
      itemList: ['复制收货信息'],
      success(res) {
        var data = _this.data.order.consignee + ' ' + _this.data.order.mobile + ' ' + _this.data.order.region + ' ' + _this.data.order.address

        wx.setClipboardData({ data: data })
      }
    })
  },
  // 请求数据
  pageData() {
    var _this = this
    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/order/get-order-details',
      type: 'form',
      data: {
        order_id: _this.data.id || '',
      },
      success: function (res) {
        var details = res.data.data.details,
          shipping = res.data.data.shipping,
          goods_list = res.data.data.goods_list,
          auth = res.data.data.auth,
          user = res.data.data.user
          
        details.goods = goods_list
        details.auth = auth
        details.user = user
        
        _this.setData({
          order: details,
          shipping: shipping,
        })
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.setData({
      order: app.globalData.order_detail_info,
    })
    console.log(app.globalData.order_detail_info)
    app.globalData.order_detail_info = null
    this.pageData()
  },
})