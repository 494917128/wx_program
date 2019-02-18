const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url
  },
  // 选择银行卡
  selectCard(){
    util.prevPage({
      aa:'aa'
    })
  },
  onLoad: function (options) {

  }
})