const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
    list: [],
    page: 1,
    loading: false,
    
  },
  pageData() {
    var _this = this
    this.setData({ loading: true })// 加载中
    this.ajax = util.request({
      url: 'mini-teaching/type-list',
      method: 'get',
      type: 'form',
      data: {
        page: this.data.page,
      },
      success(res) {
        var list = _this.data.list
        var data = res.data
        list.push(...data.data.list)

        if (data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '没有更多了'
          })
        } else {
          _this.setData({
            page: _this.data.page + 1,//页数自增
          })
        }
        _this.setData({
          list: list,
          loading: false,
        })

        console.log(list)
      }
    })
  },
  onLoad: function (options) {
    util.requestIndex(this, app.globalData.show_user)
    this.pageData()
    var user_id = wx.getStorageSync('userId')
    if (user_id) {
      this.setData({
        user_id: user_id
      })
    } else { // 没有就要重新登录
      wx.navigateTo({
        url: '/pages/login/agent/agent?again=1',
      })
    }
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    this.ajax.abort()
    this.pageData()
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.setData({
      list: [],
      page: 1,
    })
    this.ajax.abort()
    this.pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)
  },
  onShareAppMessage: function () {
    return {
      title: '线上课程',
      path: 'pages/program/classType/classType'
    }
  }
})