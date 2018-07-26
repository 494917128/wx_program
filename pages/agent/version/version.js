const app = getApp()
import util from "../../../utils/util.js";
import version from "../../../version.js";
Page({

  data: {
    url: app.url,
  },

  onLoad: function (options) {
    this.setData({
      version
    })
  }
})