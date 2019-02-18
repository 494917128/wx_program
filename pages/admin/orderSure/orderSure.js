const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,

    action_note: '',
  },
  remarkInput(e) {
    var value = e.detail.value
    this.setData({ action_note: value })
  },
  submit() {
    var _this = this
    this.ajax = util.request2({
      url: 'v1/order/action',
      type: 'form',
      data: {
        order_id: this.data.id || '',
        action: this.data.action,
        action_note: this.data.action_note,
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        setTimeout(() => {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          if (prevPage.onPullDownRefresh) {
            prevPage.onPullDownRefresh()
          } else { prevPage.pageData && prevPage.pageData() }
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      id: options.id,
      action: options.action
    })
  },

})