const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    nav_list: [{
      url: '/pages/agent/bill/bill?type=earnings',
      icon: 'icon-qianbipencil82',
      text: '收益明细',
    }, {
      url: '/pages/agent/bill/bill?type=deal',
      icon: 'icon-tuiguang',
      text: '交易明细',
    }, {
      url: '/pages/agent/bill/bill?type=withdraw',
      icon: 'icon-tuiguang',
      text: '提现明细',
    }, {
    //   url: '/pages/agent/withdraw/withdraw?type=withdraw',
    //   icon: 'icon-tuiguang',
    //   text: '金额提现',
    // }, {
    //   url: '/pages/agent/withdraw/withdraw?type=transfer',
    //   icon: 'icon-tuiguang',
    //   text: '金额转账',
    // }, {
      url: '/pages/agent/bill/bill?type=bonus',
      icon: 'icon-tuiguang',
      text: '奖金汇总',
    }]
  },

  onLoad: function (options) {
    this.setData({
      agent: app.globalData.agentInfo,
    })
  }
})