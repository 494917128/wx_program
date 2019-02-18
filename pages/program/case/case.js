const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    nav_list: ['客户案例', '视频见证'],
    nav_index: 0,
    search_value: '',
    search_5: '',
    search_6: '',
    list_5: [],
    list_6: [],
    page_5: 1,
    page_6: 1,
    loading_5: false,
    loading_6: false,
    case_more: false,// 是否显示全部图标
    upload_show: false,// 是否显示上传案例图标
  },
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index,
      _index = this.switchIndex()

    util.contentNavbar({
      _this: this,
      list_name: 'list_6',
      ajax: this['ajax_6'],
      pageData: this.pageData,
      e: e
    })
  },
  switchIndex(type) {
    var _index = '',
      _type = ''
    switch (this.data.nav_index) {
      case (0):
        _index = '_5'
        _type = 5
        break;
      case (1):
        _index = '_6'
        _type = 6
        break;
    }
    if (type == 'type') {
      return _type
    } else {
      return _index
    }
  },

  // previewImage的所有image
  images: [],
  caseMore () {
    this.setData({
      case_more: !this.data.case_more
    })
  },
  // 搜索
  searchValue(e) {
    this.setData({
      search_value: e.detail.value
    })
  },
  search() {
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
  searchLabel(e) {
    var value = e.currentTarget.dataset.value
    var _index = this.switchIndex()
    this.setData({
      search_value: value
    })
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
  previewImage (e) {
    var img = e.currentTarget.dataset.img
    var urls = []
    for (var i = 0, len = this.images.length; i < len; i++) {
      urls.push(app.image_url + this.images[i] + '?x-oss-process=style/shuiyin')
    }
    wx.previewImage({
      current: app.image_url + img + '?x-oss-process=style/shuiyin',
      urls: urls,
    })
  },
  pageData () {
    var _index = this.switchIndex(),
      _type = this.switchIndex('type'),
      _this = this
    if (this.data.page_5 == 1) {
      this.images = []
    }
    this.setData({
      case_more: false
    })
    util.contentPageData({
      _this: this,
      type: _type,
      index: this.data.nav_index,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      loading_name: 'loading' + _index,
      ajax_name: 'ajax' + _index,
      callback: function(data){
        if (_type == 5) {
          var list = data.data.list
          console.log(list)
          var images = _this.images
          for (var i = 0, len = list.length; i < len; i++) {
            for (var p = 0, len2 = list[i].case_img.length; p < len2; p++) {
              images.push(list[i].case_img[p])
            }
          }
        }
      }
    })
  },
  onLoad: function (e) {
    var _this = this
    app.globalData.show_user = e.show_user || app.globalData.show_user || 1
    if (e.search) { this.setData({ search: e.search }) }
    util.requestIndex(this, app.globalData.show_user,true)
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (res.data){
          _this.setData({
            upload_show: true
          })
        }
      },
    })
    this.pageData()
    util.contentShare({ // 通过转发消息进来
      _this: this,
      options: e,
      list_name: 'list_6',
      ajax: this.ajax_6,
      pageData: this.pageData,
    })
  },
  // 上拉加载
  onReachBottom() {
    var _index = this.switchIndex()
    util.contentReachBottom({
      _this: this,
      loading_name: 'loading' + _index,
      index: this.data.nav_index,
      ajax: this.ajax,
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
      ajax: this.ajax,
      pageData: this.pageData
    })
  },
  onShareAppMessage: function () {
    var _type = this.switchIndex('type'),
      path = '/pages/program/case/case?show_user=' + app.globalData.show_user + '&nav_index=' + this.data.nav_index + '&search=' + (this.data.search || ''),
      title = this.data.nav_list[this.data.nav_index]
    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})