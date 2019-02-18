const app = getApp()
import util from "../../../utils/util.js";
Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    
  },

  onLoad: function (options) {
    this.setData({
      src: options.src,
      title: options.title
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: 'pages/program/caseVideo/caseVideo?src=' + this.data.src + '&title=' + this.data.title
    }
  }

})