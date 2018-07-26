const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url
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