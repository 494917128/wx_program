const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    list: [],
    page: 1,
    loading: false,
  },
  // 数据请求
  pageData(){
    var _this = this
    this.setData({ loading: true })
    util.request({
      url: 'index.php?r=user/commended&page=' + _this.data.page,
      type: 'form',
      data: {
        user_id: app.globalData.agentInfo.user_id,
      },
      success: function (res) {
        var list = _this.data.list
        list.push(...res.data.data.list)

        if (res.data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: list.length ? '没有更多了' : '您还没有推荐会员'
          })
        } else {
          _this.setData({
            page: _this.data.page + 1,
          })
        }

        _this.setData({
          list: list,
          loading: false,
        })
      }
    })
  },
  onLoad: function (options) {
    this.pageData()
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    if (!this.data.loading) {
      this.pageData()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.setData({
      list: [],// 重新加载
      page: 1,// 页数为1
    })
    this.pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)
  }
})