const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    nav_list: ["产品详情", "联系代理商"],
    nav_index: 0,
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

  onLoad: function () {

  },
})