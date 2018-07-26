const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url
  },

  onLoad: function (e) {
    var type_text
    if (e.type == 'withdraw'){//提现
      type_text = '提现'
    }else{//转账
      type_text = '转账'
    }
    this.setData({
      type: e.type,
      type_text: type_text
    })
    // 设置标题
    wx.setNavigationBarTitle({
      title: '金额'+type_text
    })
  }
})