const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    repertory_list: [],
    repertory_index: 0,
    action_note: '',
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      repertory_index: e.detail.value
    })
  },
  remarkInput(e) {
    var value = e.detail.value
    this.setData({ action_note: value })
  },
  submit() {
    var _this = this
    this.ajax = util.request2({
      url: 'v1/order/shipping-repertory',
      type: 'form',
      data: {
        order_id: this.data.id || '',
        repertory_id: this.data.repertory_list[this.data.repertory_index].id,
        action_note: this.data.action_note,
      },
      success: function (res) {
        wx.showToast({
          title: '分配成功',
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
        var repertory = res.data.data.repertory_list,
          repertory_list = [],
          repertory_index = 0
        for (var key in repertory) {
          repertory_list.push({ id: key, value: repertory[key] })
        }
        _this.setData({
          repertory_list: repertory_list,
          repertory_index: repertory_index
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