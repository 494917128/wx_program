const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url
  },
  earnings() { },
  deal() { },
  withdraw() { },
  bonus() { },
  onLoad: function (e) {
    const type = e.type
    var title = ''
    if (type == 'earnings'){
      // 收益明细
      title = '收益明细'
      this.earnings()
    } else if (type == 'deal') {
      // 交易明细
      title = '交易明细'
      this.deal()
    } else if (type == 'withdraw') {
      // 提现明细
      title = '提现明细'
      this.withdraw()
    } else if (type == 'bonus') {
      // 奖金汇总
      title = '奖金汇总'
      this.bonus()
    } else if (type == 'inventory') {
      // 奖金汇总
      title = '库存记录'
      // this.inventory()
    }
    wx.setNavigationBarTitle({
      title: title
    })
  }
})