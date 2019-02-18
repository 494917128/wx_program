//index.js
//获取应用实例
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    user:{},
    nav_list:[
      { icon: 'icon-xiaoxi', text: '关于', bg_color: '#FE9F00', url: '/pages/program/aboutUs/aboutUs' },
      { icon: 'icon-chanpin', text: '产品', bg_color: '#FC7500', url: '/pages/program/product/product' },
      { icon: 'icon-xinwen', text: '公告', bg_color: '#AD6509', url: '/pages/program/notice/notice' },
      { icon: 'icon-qianmishangxueyuan-', text: '商学院', bg_color: '#FFA1A9', url: '/pages/program/moments/moments' },
    ],
    swiper_image: [
      'images/carousel/1.webp.jpg', 
      'images/carousel/1.png',
      'images/carousel/2.png',
      'images/carousel/3.jpg',
      'images/carousel/4.jpg',
      'images/carousel/5.jpg',
    ],
    my_code_show:false,
  },

  myCode() {
    util.myCode(this)
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.user.mobile||this.data.user.mobile_phone
    })
  },
  // 点击进入内容
  noticeContent(e) {
    util.webview(e)
  },
  buy(e) {
    wx.showModal({
      title: '提示',
      content: '该版本暂不支持购买，请前往结算系统进行购买',
      success(res) {
        // if (res.confirm) util.webview(e)
      }
    })
  },
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    if (options.scene) { 
      app.globalData.show_user = decodeURIComponent(options.scene)
    }

    if (!app.globalData.show_user) { 
      wx.showToast({
        title: '参数无效',
        icon: 'none',
      })
      app.globalData.show_user = app.globalData.show_user || 1
    }
    util.requestIndex(this, app.globalData.show_user, true)

    if (options.guide) {
      this.setData({ guide: true });
    }
  },
  onShareAppMessage: function () {
    return {
      title: (this.data.user.real_name || this.data.user.nickname) + '的小程序',
      path: '/pages/program/index/index?scene=' + app.globalData.show_user
    }
  }

})
