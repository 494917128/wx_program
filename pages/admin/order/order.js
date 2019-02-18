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
    search_value: '',
    search: '',
  },
  // 搜索
  searchValue(e) {
    this.setData({
      search_value: e.detail.value
    })
  },
  search() {
    util.contentSearch({
      _this: this,
      index: this.data.nav_index,
      search_value: this.data.search_value,
      search_name: 'search',
      list_name: 'list',
      page_name: 'page',
      ajax: this.ajax,
      pageData: this.pageData
    })
  },

  // nav导航
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index,
      notice_content: false,
      search: '',
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
  orderDetail(e) {
    var info = e.currentTarget.dataset.info
    app.globalData.order_detail_info = info
    wx.navigateTo({
      url: '/pages/admin/orderDetail/orderDetail?id=' + info.order_id,
    })
  },
  // 请求数据
  pageData() {
    var _this = this,
      index = this.data.nav_index,
      data = {},
      para = this.data.para?JSON.parse(this.data.para):{}
    data.page = this.data.page
    data.status = index ? '10' + index : ''
    data.key = this.data.search
    data = Object.assign(data,para)

    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/order/order-list',
      type: 'form',
      data: data,
      success: function (res) {
        // 算出商品总数量
        for (var i = 0, len = res.data.data.list.length; i < len; i++) {
          res.data.data.list[i].goods_sum = 0
          for (var p = 0, length = res.data.data.list[i].goods.length; p < length; p++) {
            res.data.data.list[i].goods_sum += res.data.data.list[i].goods[p].goods_number
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
    wx.setNavigationBarTitle({
      title: e.title
    })

    // 订单列表有多少的提示
    // var number = app.globalData.agentInfo.number
    var prompt_list1 = [], prompt_list2 = []
    // prompt_list1.push('', number.order_user_3, number.order_user_1, number.order_user_2, number.order_user_4)
    // prompt_list2.push('', number.order_supplier_0, number.order_supplier_1, number.order_supplier_2, '')

    this.setData({
      para: e.para||'',
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