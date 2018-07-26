//index.js
//获取应用实例
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    nav_list:["代理商介绍","公司介绍"],
    nav_index:0,
    my_code_show: false,
  },

  myCode() {
    util.myCode(this)
  },
  navbar(e){
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index
    })
  },
  onLoad: function () {
    util.requestIndex(this, app.globalData.show_user)
  },
})
