const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    my_code_show: false,
    nav_list: ["产品介绍", "客户案例", "百问百答"],
    nav_index: 0,
    search: '',
    list: [],
    page: 1,
    loading: false,
    notice_content: false,
  },
  webView(e) {
    util.webview(e)
  },
  myCode() {
    util.myCode(this)
  },
  // nav导航
  navbar(e) {
    if (e.detail.currentTarget.dataset.index == 1) {
      wx.navigateTo({
        url: '/pages/program/case/case',
      })
    } else {
      util.contentNavbar({
        _this: this,
        list_name: 'list',
        ajax: this.ajax,
        pageData: this.pageData,
        e: e
      })
    }
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
  // 点击进入内容
  noticeContent(e) {
    this.setData({
      notice_content: true,
      notice_index: e.currentTarget.dataset.index
    })
  },
  // 内容返回
  noticeBack() {
    this.setData({
      notice_index: '',
      notice_content: false,
      notice_detail: ''      
    })
  },
  // 内容上一篇
  noticePrev() {
    this.setData({
      notice_index: this.data.notice_index - 1
    })
  },
  // 内容下一篇
  noticeNext() {
    util.noticeNext({
      _this: this,
      list_name: 'list',
      ajax: this.ajax,
      pageData: this.pageData
    })
  },
  // 数据请求
  pageData(callback) {
    util.contentPageData({
      _this: this,
      type: 2,
      index: this.data.nav_index,
      search_name: 'search',
      list_name: 'list',
      page_name: 'page',
      loading_name: 'loading',
      ajax_name: 'ajax',
      callback: callback,
    })
  },

  buy(e){
    wx.showModal({
      title: '提示',
      content: '该版本暂不支持购买，请前往结算系统进行购买',
      success(res){
        // if (res.confirm) util.webview(e)
      }
    })
  },
  onLoad: function (options) {
    util.contentShare({ // 通过转发消息进来
      _this: this,
      options: options,
      list_name: 'list',
      ajax: this.ajax,
      pageData: this.pageData,
      type: 2
    })
    util.requestIndex(this, app.globalData.show_user, true)
    
  },
  // 上拉加载
  onReachBottom(){
    util.contentReachBottom({
      _this: this,
      boolean: this.data.nav_index == 2,
      loading_name: 'loading',
      index: this.data.nav_index,
      ajax: this.ajax,
      pageData: this.pageData
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    util.contentDownRefresh({
      _this: this,
      boolean: this.data.nav_index == 2,      
      search_name: 'search',
      list_name: 'list',
      page_name: 'page',
      index: this.data.nav_index,
      ajax: this.ajax,
      pageData: this.pageData
    })
  },
  onShareAppMessage: function () {
    var path = '/pages/program/product/product?show_user=' + app.globalData.show_user + '&nav_index=' + this.data.nav_index,
      title = this.data.nav_list[this.data.nav_index]
    if (this.data.notice_index === 0 || this.data.notice_index || this.data.notice_detail) {
      path += '&notice_id=' + ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list[this.data.notice_index].article_id : this.data.notice_detail.article_id)
      title = ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list[this.data.notice_index].article_title : this.data.notice_detail.article_title)
    }
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})