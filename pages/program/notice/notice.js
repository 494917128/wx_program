const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    nav_list: ["公司通告", "百问百答"],
    nav_index: 0,
    video: 'http://www.saiminet.com/vcr.mp4',
    search_value: '',//搜索的内容
    my_code_show: false,
    list: [[], []],
    page: [1, 1],
    loading: [false, false],// 是否请求中，请求中就不再次请求
    search: ['',''],
    notice_content: false,//判断是否进入公告内容
    // notice_detail: {
    //   title:'标题标题标题',
    //   date: '2018-05-19',
    //   content: '内容\n\
    //   \n\
    //   内容内容内容\n\
    //   内容内容内容\n\
    //   '
    // }
  },

  myCode() {
    util.myCode(this)
  },
  // nav导航
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index,
      notice_content: false,
    })
    if(index==1&&this.data.list[1].length==0){
      console.log(1)
      this.pageData()
    }
  },

  // 搜索
  searchValue(e){
    this.setData({
      search_value: e.detail.value
    })
  },
  search(){
    // if (!this.data.search_value)
    //   return
    var index = this.data.nav_index
    this.setData({
      ['search[' + index + ']']: this.data.search_value,
      ['list[' + index + ']']: [],// 如果搜索重新加载
      ['page[' + index + ']']: 1,// 如果搜索页数就是1
    })
    this.pageData()
    console.log(this.data.search_value)
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
      notice_content: false
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
    var _this = this
    var notice_index = this.data.notice_index
    if (notice_index == this.data.list[1].length - 1){
      this.pageData(function(){
        _this.setData({
            notice_index: notice_index + 1
          })
        })
    }else{
      this.setData({
        notice_index: notice_index + 1
      })
    }
  },
  // 数据请求
  pageData(callback){
    var _this = this
    var index = this.data.nav_index
    var search = this.data.search[index]
    this.setData({ ['loading[' + index + ']']: true })
    util.request({
      url:'index.php?r=minfo/info',
      method: 'get',
      data:{
        page: _this.data.page[index],
        type: index+1,
        content: search || ''
      },
      success:function(res){
        var data = JSON.parse(res.data)
        console.log(data)
        var list = _this.data.list[index]
        list.push(...data.data.list)

        if (data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: (search && (_this.data.page[index] == 1)) ? '未搜索到内容' : '没有更多了'
          })
        } else {
          _this.setData({
            ['page[' + index + ']']: _this.data.page[index] + 1,//页数自增
          })
        }

        _this.setData({
          ['list[' + index + ']']: list,
          ['loading[' + index + ']']: false,
        })

        callback && callback()
      }
    })
  },
  onLoad: function () {
    util.requestIndex(this, app.globalData.show_user)
    this.pageData()
  },
  
  // 上拉加载
  onReachBottom(){
    console.log('上拉加载')
    if (!this.data.loading[this.data.nav_index]) {
      this.pageData()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    var index = this.data.nav_index
    this.setData({
      ['search[' + index + ']']: '',
      ['list[' + index + ']']: [],
      ['page[' + index + ']']: 1,
    })
    this.pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)    
  }
})