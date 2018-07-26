const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {
    nav_list:[
      {
        title:"我的小程序",
        list: [{
          icon: "icon-xiaochengxu",
          color: "#16D328",
          text: "进入小程序",
          type: "switchTab",
          url: "/pages/program/index/index"
        }, {
          icon: "icon-changan",
          color: "#FF7B45",
          text: "小程序码",
          url: "/pages/agent/code/code"
        }, {
          icon: "icon-xyue",
          color: "#FFBC43",
          text: "账户余额",
          bindtap: "wait",
          // url: "/pages/agent/sell/sell"
        }, {
          icon: "icon-kucun",
          color: "#079BEF",
          text: "库存管理",
          bindtap: "wait",
          // url: "/pages/agent/inventory/inventory",
        // }, {
        //   icon: "icon-guanjiaowangtubiao03",
        //   color: "#059AFE",
        //   text: "购买商品",
        //   type: "switchTab",
        //   url: "/pages/program/product/product",
        }, {
          icon: "icon-mairu",
          color: "#FE6162",
          text: "买入订单",
          // bindtap: "wait",
          url: "/pages/agent/order/order?type=buy",
        // }, {
        //   icon: "icon-icon5",
        //   color: "#3C6BE5",
        //   text: "卖出订单",
        //   // bindtap: "wait",
        //   url: "/pages/agent/order/order?type=sale",
        // }, {
        //   icon: "icon-kefu",
        //   color: "#059AFE",
        //   text: "客服中心"
        }, {
          icon: "icon-sucai",
          color: "#3BB0B8",
          text: "素材中心",
          type: "switchTab",
          url: "/pages/program/notice/notice",
        }, {
          icon: "icon-qianmishangxueyuan-",
          color: "#059AFE",
          text: "商学院",
          type: "switchTab",
          url: "/pages/program/moments/moments",
        }]
      },
      {
        title: "客户管理",
        list: [{
          icon: "icon-ren",
          color: "#03B8F7",
          text: "我的领导人",
          url: "/pages/agent/userInfo/userInfo",
        }, {
        //   icon: "icon-xinzeng",
        //   color: "#0094DB",
        //   text: "新增会员",
        //   bindtap: "wait",
        //   // url: "/pages/agent/client/client",
        // }, {
          icon: "icon-kehu",
          color: "#99C87D",
          text: "所有推荐人",
          url: "/pages/agent/client/client",
        }]
      },
      {
        title: "其他",
        list: [{
          icon: "icon-shezhi",
          color: "#1AABA8",
          text: "修改资料",
          bindtap: "wait",
          // url: "/pages/agent/update/update"
        }, {
          icon: "icon-banbengengxin",
          color: "#C8D4E5",
          text: "版本更新公告",
          url: "/pages/agent/version/version"
        }, {
          icon: "icon-fankui",
          color: "#ED454C",
          text: "意见&Bug反馈",
          bindtap: "wait",
          // url: "/pages/agent/opinion/opinion"
        }]
      }
    ]
  },
  // 提示功能未开放
  wait(e) {
    wx.showModal({
      title: '提示',
      content: '该功能暂未开放',
      success(res) {
      }
    })
  },
  // 退出登录
  edit(){
    wx.removeStorage({
      key: 'userId',
      success: function(res) {
        app.globalData.agentInfo = null
        app.globalData.userInfo = null
        app.globalData.goods = null
        app.globalData.meida = null
        app.globalData.region = null
        app.globalData.qrCode = null
        wx.redirectTo({
          url: '/pages/login/agent/agent',
        })
      },
    })
  },
  // 数据加载
  pageData(){
    var _this = this
    var user_id = wx.getStorageSync('userId')
    util.request({
      url: 'index.php?r=site/index',
      type: 'form',
      method: 'post',
      data: {
        user_id: user_id
      },
      success: function (res) {

        app.globalData.agentInfo = res.data.user
        app.globalData.agentInfo.number = res.data.data

        var nav_list = _this.data.nav_list
        nav_list.map((list, index) => {
          list.list.map((item, idx) => {
            if (item.text == '库存管理') {
              nav_list[index].list[idx].prompt = res.data.data.Goods_Sum
            }
          })
        })

        _this.setData({
          agent: app.globalData.agentInfo,
          nav_list
        })
      },

    })
    // util.requestIndex(this, user_id, true) // 更改我的小程序里的请求内容
    app.globalData.show_user = user_id// 更改小程序显示的人变成用户
  },

  onLoad: function (options) {
    this.pageData()
  },
  onShareAppMessage: function () {
    return {
      title: (this.data.agent.real_name || this.data.agent.nickname) + '的小程序',
      path: '/pages/program/index/index?scene=' + app.globalData.show_user
    }
  }
})