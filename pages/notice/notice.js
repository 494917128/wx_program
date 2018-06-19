const app = getApp()
import util from "../../utils/util.js";

Page({
  data: {
    url: app.url,
    nav_list: ["公司通告", "制度政策", "使用问题"],
    nav_index: 0,
    search_value: '',//搜索的内容
    my_code_show: false,
    notice_content: false,//判断是否进入公告内容
    notice_detail: {
      title:'标题标题标题',
      date: '2018-05-19',
      content: '内容\n\
      \n\
      内容内容内容\n\
      内容内容内容\n\
      '
    }
  },

  myCode() {
    util.myCode(this)
  },
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index,
      notice_content: false,
    })
  },
  searchValue(e){
    this.setData({
      search_value: e.detail.value
    })
  },

  search(){
    if (!this.data.search_value)
      return
    console.log(this.data.search_value)
  },
  noticeContent(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      notice_content: true
    })
  },
  noticeBack(){
    this.setData({
      notice_content: false
    })
  },
  onLoad: function () {
    util.requestIndex(this)

  },
})