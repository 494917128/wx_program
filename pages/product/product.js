const app = getApp()
import util from "../../utils/util.js";

Page({
  data: {
    url: app.url,
    my_code_show: false,
  },

  myCode() {
    util.myCode(this)
  },

  onLoad: function () {
    util.requestIndex(this)

  },
})