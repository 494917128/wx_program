const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    my_code_show: false,
    region: ['北京市', '北京市', '东城区'],
  },

  myCode() {
    util.myCode(this)
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function () {

  },
})