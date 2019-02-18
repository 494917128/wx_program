const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    list: [],
    page: 1,
    loading: false,
  },
  // 选择素材
  select(e){
    var id = e.currentTarget.dataset.id
    util.prevPage({
      meet_id: id
    })
  },
  // 请求列表
  pageData(){
    var _this = this,
      list = this.data.list,
      page = this.data.page
    _this.setData({ loading: true })// 加载中
    this.ajax = util.request2({
      url: 'v1/meet/get-meet-list',
      method: 'POST',
      type: 'form',
      data: {
        Page: this.data.page,
      },
      success: function (res) {
        var data = res.data
        var list2 = [                //类型：Array  必有字段  备注：无
          {                //类型：Object  必有字段  备注：无
            "meet_id": "5",                //类型：String  必有字段  备注：无
            "meet_name": "年会6",                //类型：String  必有字段  备注：会议名称
            "click_count": 0,                //类型：Number  必有字段  备注：无
            "is_on": 0,                //类型：Number  必有字段  备注：是否关闭
            "meet_img": "upload/meet_img/2018-10-24/rf_alioss_154035166099995498.png",                //类型：String  必有字段  备注：效果图
            "add_time": "2018-10-24 11:27:44"                //类型：String  必有字段  备注：无
          },]
        list.push(...list2)

        if (data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: page == 1 ? '未搜索到内容' : '没有更多了'
          })
        } else {
          _this.setData({
            page: page + 1,//页数自增
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