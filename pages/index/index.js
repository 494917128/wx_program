//index.js
//获取应用实例
const app = getApp()
import util from "../../utils/util.js";

Page({
  data: {
    url: app.url,
    user:{},
    nav_list:[
      { icon: 'icon-xiaoxi', text: '关于', bg_color: '#FE9F00', url: '/pages/aboutUs/aboutUs' },
      { icon: 'icon-chanpin', text: '产品', bg_color: '#FC7500', url: '/pages/product/product' },
      { icon: 'icon-xinwen', text: '公告', bg_color: '#AD6509', url: '/pages/notice/notice' },
      { icon: 'icon-iconset0336', text: '联系', bg_color: '#C7C7C7', url: '/pages/join/join' },
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
  onLoad: function () {
    util.requestIndex(this)

  },
})
