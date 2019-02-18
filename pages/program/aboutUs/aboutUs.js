//index.js
//获取应用实例
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    nav_list: ["经销商介绍", "团队介绍", "公司介绍"],
    nav_index:0,
    my_code_show: false,
  },

  myCode() {
    util.myCode(this)
  },
  navbar(e){
    var index = e.detail.currentTarget.dataset.index
    if (index == this.data.nav_index)
      return;
    this.setData({
      nav_index: index
    })
  },
  updatePhoto(){
    var _this = this
    wx.showLoading({
      title: '上传中...',
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        _this.uploadFile(res.tempFilePaths[0])
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
        })
      }
    })
  },
  uploadFile(tempFilePath) {
    var _this = this
    util.upload({
      url: 'mini_headimgurl',
      tempFilePath: tempFilePath,
      callback: function (data) {
        _this.requestUpdate(data.url)
      }
    })
  },
  requestUpdate(mini_headimgurl){
    var _this = this
    var user_id = wx.getStorageSync('userId')
    
    util.request({
      url: 'minfo/head-add',
      method: 'post',
      type: 'form',
      data: {
        mini_headimgurl: mini_headimgurl,
        user_id: user_id,
      },
      success(res) {
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.state == 1){
          _this.setData({
            'user.mini_headimgurl': mini_headimgurl
          })
        }
        wx.showToast({
          title: data.data,
          icon: 'none'
        })
      }
    })
  },
  onLoad: function (options) {
    app.globalData.show_user = options.show_user || app.globalData.show_user || 1
    this.setData({
      nav_index: options.nav_index||0,
    })
    util.requestIndex(this, app.globalData.show_user, true)
  },
  onShareAppMessage: function () {
    var path = '/pages/program/aboutUs/aboutUs?show_user=' + app.globalData.show_user + '&nav_index=' + this.data.nav_index,
      title = this.data.nav_list[this.data.nav_index]

    console.log(path)
    return {
      title: title,
      path: path
    }
  }
})
