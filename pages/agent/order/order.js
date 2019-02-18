const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    nav_list1: ["全部订单", "待处理", "待发货", "已发货", "已完成"],
    nav_list2: ["全部订单", "待确定", "待发货", "已发货", "已完成"],
    nav_index: 0,
    list: [],
    page: 1,
    loading: false,

  },
  // nav导航
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index,
      notice_content: false,
      list: [],// 重新加载
      page: 1,// 页数为1
    })
    this.ajax.abort()// 结束之前的请求
    this.pageData()
  },
  webView(e) {
    e.currentTarget.dataset.src = app.webview_url + e.currentTarget.dataset.src
    util.webview(e)
  },
  // 跳转到详情页面
  orderDetail(e){
    app.globalData.order_detail_info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/agent/orderDetail/orderDetail',
    })
  },
  // 请求数据
  pageData(){
    var _this = this
    var index = this.data.nav_index
    this.setData({ loading: true })
    this.ajax = util.request({
      url: 'order/index&page=' + _this.data.page + '&type=' + (this.data.nav_index + 1),
      type: 'form',
      data: {
        user_id: app.globalData.agentInfo.user_id,
      },
      success: function (res) {
        // 算出商品总数量
        for (var i = 0, len = res.data.data.list.length; i < len; i++) {
          res.data.data.list[i].goods_sum = 0
          for (var p = 0, length = res.data.data.list[i].goods_list.length; p < length; p++) {
            res.data.data.list[i].goods_sum += res.data.data.list[i].goods_list[p].goods_number
          }
        }

        var list = _this.data.list
        list.push(...res.data.data.list)

        if (res.data.data.list.length == 0) {
          if (_this.data.page != 1) {
            wx.showToast({
              icon: 'none',
              title: '没有更多了'
            })
          }
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
  onLoad: function (e) {

    // 订单列表有多少的提示
    var number = app.globalData.agentInfo.number
    var prompt_list1 = [],prompt_list2 = []
    prompt_list1.push('', number.order_user_3, number.order_user_1, number.order_user_2, number.order_user_4)
    prompt_list2.push('', number.order_supplier_0, number.order_supplier_1, number.order_supplier_2, '')

    this.setData({
      type: e.type||'',
      prompt_list1,
      prompt_list2
    })
    this.pageData()
  },
  // 上拉加载
  scrolltolower() {
    console.log('上拉加载')
    if (!this.data.loading) {
      this.ajax.abort()
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