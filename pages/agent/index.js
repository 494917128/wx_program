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
          icon: "icon-shouquanshu",
          color: "#FF7B45",
          text: "我的授权书",
          bindtap: 'myCode',
        }, {
        //   icon: "icon-touxiang",
        //   color: "#AA081B",
        //   text: "周年庆典",
        //   url: "/pages/program/meeting/meeting",
        // }, {
        //   icon: "icon-touxiang",
        //   color: "#77BAF8",
        //   text: "庆典头像",
        //   url: "/pages/program/meetingHeaderExample/meetingHeaderExample",
        // }, {
          icon: "icon-guanyuwomen",
          color: "#FFBC43",
          text: "关于我们",
          type: "switchTab",
          url: "/pages/program/aboutUs/aboutUs?nav_index=2"
        }, {
          icon: "icon-guanjiaowangtubiao03",
          color: "#059AFE",
          text: "产品介绍",
          type: "switchTab",
          url: "/pages/program/product/product",
        }, {
          icon: "icon-anli",
          color: "#F6980D",
          text: "用户案例",
          url: "/pages/program/case/case",
        }, {
          icon: "icon-mairu",
          color: "#FE6162",
          text: "买入订单",
          // bindtap: "wait",
          url: "/pages/agent/order/order?type=buy",
        // }, {
        //   icon: "icon-kefu",
        //   color: "#059AFE",
        //   text: "客服中心"
        }, {
          icon: "icon-xinwen",
          color: "#3BB0B8",
          text: "公司通告",
          type: "switchTab",
          url: "/pages/program/notice/notice",
        }, {
          icon: "icon-qianmishangxueyuan-",
          color: "#059AFE",
          text: "商学院",
          type: "switchTab",
          url: "/pages/program/moments/moments",
        }, {
          icon: "icon-xianshangkecheng",
          color: "#FFBC43",
          text: "线上课程",
          url: "/pages/program/classType/classType",
        }]
      },
      {
        title: "客户管理",
        list: [{
          icon: "icon-ren",
          color: "#03B8F7",
          text: "我的领导人",
          url: "/pages/agent/userInfo/userInfo?type=leader",
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
        //   icon: "icon-shezhi",
        //   color: "#1AABA8",
        //   text: "修改资料",
        //   bindtap: "wait",
        //   // url: "/pages/agent/update/update"
        // }, {
          icon: "icon-banbengengxin",
          color: "#C8D4E5",
          text: "版本更新公告",
          url: "/pages/agent/version/version"
        // }, {
        //   icon: "icon-fankui",
        //   color: "#ED454C",
        //   text: "意见&Bug反馈",
        //   bindtap: "wait",
        //   // url: "/pages/agent/opinion/opinion"
        }]
      }
    ],
    my_code_show: false,
    pay_show: false,
  },
  payShow (){
    this.setData({
      pay_show: !this.data.pay_show
    })
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
  edit(edit){
    edit = edit ? '1' : ''
    wx.removeStorageSync('user_rank')
    wx.removeStorageSync('accessToken')
    wx.removeStorageSync('refreshToken')
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
          url: '/pages/login/agent/agent?edit=' + edit,
        })
      },
    })
  },
  myCode() {
    util.myCode(this)
  },
  // 数据加载
  pageData(){
    var _this = this
    var user_id = wx.getStorageSync('userId')
    util.request({
      url: 'site/index',
      type: 'form',
      method: 'post',
      data: {
        user_id: user_id
      },
      success: function (res) {
        if (res.data.rank == 0) { // 之前是官方，现在不是，跳到登录页面
          _this.edit(true)
          return;
        }
        res.data.user.regs_time = util.formatTime(new Date(Number(res.data.user.reg_time||0)*1000))
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
        app.globalData.show_user = res.data.user.user_id // 更改我的小程序里的请求内容
        util.requestCode(_this, app.globalData.show_user) // 为了更改我的授权书

        if (res.data.data.admin) { wx.navigateTo({ url: '/pages/admin/index', }) } // 跳转到管理员页面
      },
    })
  },

  onLoad: function (options) {
    // wx.connectSocket({
    //   url: app.socket,
    //   data: {},
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success(){
    //     console.log(1)
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
    // wx.onSocketMessage(function(data){
    //   console.log(data)
    // })
    // wx.onSocketError(function(res){
    //   console.log(res)
    // })
    // var  socketOpen = false
    // var socketMsgQueue = []
    // wx.onSocketOpen(function (res) {
    //   socketOpen = true
    //   console.log('建立成功')
    //   sendSocketMessage('{"type":"pong","to_client_id":"all","content":"hahah"}')
    //   socketMsgQueue = []
    // })
    // function sendSocketMessage(msg) {
    //   if (socketOpen) {
    //     wx.sendSocketMessage({
    //       data: msg,
    //       success(){
    //         console.log('发送成功：' + msg)
    //       }
    //     })
    //   } else {
    //     socketMsgQueue.push(msg)
    //   }
    // }

    if (options.is_login){
      this.pageData()
    } else {
      util.tokenReset(
        this.pageData
      )
    }
  },
  onShareAppMessage: function () {
    return {
      title: (this.data.agent.real_name || this.data.agent.nickname) + '的小程序',
      path: '/pages/program/index/index?scene=' + app.globalData.show_user
    }
  }
})