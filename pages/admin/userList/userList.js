
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    level_array: [
      { name: '官方', type: 'month' },
      { name: '核心', type: 'year' },
    ],
    level_index: 0,
    area_array: [
      { name: '是', type: 'month' },
      { name: '否', type: 'year' },
    ],
    area_index: 0,
    search: '',
    list: [],
    page: 1,
    loading: false,
  },
  searchInput(e) {
    var value = e.detail.value
    
    this.setData({
      search: value
    })
  },
  bindPickerChange: function (e) {
    var value = e.detail.value,
      type = e.currentTarget.dataset.type
    this.setData({
      [type + '_index']: value
    })
  },
  searchSubmit(){
    this.setData({ list: [], page: 1 })
    this.pageData()
  },
  pageData() {
    var _this = this,
      list = this.data.list

    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/statistics/user-list',
      type: 'form',
      data: {
        level: this.data.level_array[this.data.level_index].type,
        area: this.data.area_array[this.data.area_index].type,
        key: this.data.search,
        Page: this.data.page
      },
      success: function (res) {
        var list2 = res.data.data.list
        for (var i = 0,len = list2.length; i < len; i++) {
          list2[i].reg_time = util.formatTime(new Date(list2[i].reg_time*1000),true)
        }
        list.push(...list2)
        _this.setData({
          loading: false,
          list: list,
          page: _this.data.page + 1
        })
      }
    })
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: e.title
    })
    this.setData({
      para: e.para || '',
    })
    this.pageData()
  },
  // 上拉加载
  onReachBottom() {
    if (!this.data.loading) {
      this.ajax && this.ajax.abort()
      this.pageData && this.pageData()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      search: '',
      list: [],
      page: 1,
    })
    this.ajax && this.ajax.abort()
    this.pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)
  },
});
