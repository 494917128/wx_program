const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    nav_list: ["公司通告", "政策公告"],
    nav_index: 0,
    video: 'http://www.saiminet.com/vcr.mp4',
    search_value: '',//搜索的内容
    my_code_show: false,
    list_1: [],// 1为公司通告
    list_3: [],// 3为公司政策
    page_1: 1,
    page_3: 1,
    loading_1: false,
    loading_3: false,
    search_1: '',
    search_3: '',

    notice_content: false,//判断是否进入公告内容
  },

  myCode() {
    util.myCode(this)
  },
  // nav导航
  navbar(e) {
    util.contentNavbar({
      _this: this,
      list_name: 'list_3',
      ajax: this.ajax_3,
      pageData: this.pageData,
      e: e
    })
  },

  switchIndex (type) {
    var _index = '',
        _type = ''
    switch (this.data.nav_index) {
      case (0):
        _index = '_1'
        _type = 1
        break;
      case ('0'):
        _index = '_1'
        _type = 1
        break;
      case (1):
        _index = '_3'
        _type = 3
        break;
      case ('1'):
        _index = '_3'
        _type = 3
        break;
    }
    if (type == 'type') {
      return _type
    } else {
      return _index
    }
  },
  // 搜索
  searchValue(e){
    this.setData({
      search_value: e.detail.value
    })
  },
  search(){
    var _index = this.switchIndex()
    util.contentSearch({
      _this: this,
      index: this.data.nav_index,
      search_value: this.data.search_value,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      ajax: this['ajax' + _index],
      pageData: this.pageData
    })
  },

  webView(e) {
    util.webview(e)
  },
  // 点击进入内容
  noticeContent(e){
    this.setData({
      notice_content: true,
      notice_index: e.currentTarget.dataset.index
    })
  },
  // 内容返回
  noticeBack(){
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
    var _index = this.switchIndex()
    util.noticeNext({
      _this: this,
      list_name: 'list' + _index,
      ajax: this['ajax' + _index],
      pageData: this.pageData
    })
  },
  // 数据请求
  pageData(callback) {
    var _index = this.switchIndex(),
        _type = this.switchIndex('type')
    util.contentPageData({
      _this: this,
      type: _type,
      index: this.data.nav_index,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      loading_name: 'loading' + _index,
      ajax_name: 'ajax' + _index,
      callback: callback,
    })
  },
  onLoad: function (options) {
    this.pageData()
    util.contentShare({ // 通过转发消息进来
      _this: this,
      options: options,
      list_name: 'list_3',
      ajax: this.ajax_3,
      pageData: this.pageData,
      type: 1,
    })
    util.requestIndex(this, app.globalData.show_user, true)
  },
  
  // 上拉加载
  onReachBottom(){
    var _index = this.switchIndex()    
    util.contentReachBottom({
      _this: this,
      loading_name: 'loading' + _index,
      index: this.data.nav_index,
      ajax: this['ajax' + _index],
      pageData: this.pageData
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    var _index = this.switchIndex()    
    util.contentDownRefresh({
      _this: this,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      index: this.data.nav_index,
      ajax: this['ajax' + _index],
      pageData: this.pageData
    })
  },
  onShareAppMessage: function () {
    var path = '/pages/program/notice/notice?show_user=' + app.globalData.show_user + '&nav_index=' + this.data.nav_index,
      title = this.data.nav_list[this.data.nav_index]
    if (this.data.notice_index === 0 || this.data.notice_index || this.data.notice_detail) {
      path += '&notice_id=' + ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list_3[this.data.notice_index].id : this.data.notice_detail.id)
      title = ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list_3[this.data.notice_index].title : this.data.notice_detail.title)
    }
    return {
      title: title,
      path: path
    }
  }
})