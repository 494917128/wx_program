const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url
  },
  getToken(){
    var _this = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + app.AppID + '&secret=' + app.AppSecret,

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        _this.code(res.data.access_token)
      }
    })
  },
  code(token){
    var _this = this
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token,
      method: 'post',
      data: {
        scene: 10867,
        path: 'pages/program/index/index'
      },
      responseType: 'arraybuffer', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let base64 = wx.arrayBufferToBase64(res.data);
        var userImageBase64 = 'data:image/png;base64,' + base64;
        _this.getImageInfo(userImageBase64)
      }
    })
  },
  // 生成失败提醒
  fail() {
    wx.hideLoading()
    wx.showToast({
      icon: 'none',
      title: '二维码生成失败',
    })
  },
  // 请求二维码
  getCode() {
    var _this = this
    util.request({
      url: 'index.php?r=qrcode/mini-code',
      type: 'form',
      method: 'post',
      data: {
        appid: app.AppID,
        secret: app.AppSecret,
        scene: app.globalData.agentInfo.user_id,
        path: 'pages/program/index/index'
      },
      success(res) {
        // _this.setData({ code_image: _this.data.url + res.data.img })
        _this.codeImageInfo(_this.data.url + res.data.img, app.globalData.agentInfo.headimgurl)
      },
      fail() { _this.fail() }
    })
  },
  // 获取二维码的本地地址
  codeImageInfo(codeimgurl, headimgurl) {
    var _this = this
    wx.getImageInfo({
      src: codeimgurl,
      success(res) {
        _this.headImageInfo(res.path, headimgurl)
      },
      fail() { _this.fail() }
    })
  },
  // 获取头像的本地地址
  headImageInfo(codeimgurl, headimgurl) {
    var _this = this
    wx.getImageInfo({
      src: headimgurl,
      success(res) {
        _this.drawCanvas(codeimgurl, res.path, 'codeId', 1)
        _this.drawCanvas(codeimgurl, res.path, 'hiddenId', 3)
      }, 
      fail() { _this.fail() }
    })
  },
  // 画canvas
  drawCanvas(codeimgurl, headimgurl, canvasId, mulriple) {
    var ctx = wx.createCanvasContext(canvasId)
    ctx.drawImage(codeimgurl, 0, 0, 226 * mulriple, 226 * mulriple)
    ctx.save()
    ctx.beginPath()
    ctx.arc(113 * mulriple, 113 * mulriple, 50 * mulriple, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(headimgurl, 63 * mulriple, 63 * mulriple, 100 * mulriple, 100 * mulriple)
    ctx.restore()
    ctx.draw()
    wx.hideLoading()
  },
  // 保存失败
  saveFail(){
    wx.hideLoading()
    wx.showToast({
      icon: 'none',
      title: '二维码保存失败',
    })
  },
  // 保存按钮（canvas生成本地图片）
  saveCanvas() {
    var _this = this
    wx.showLoading({ title: '保存中...' })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 226 * 3,
      height: 226 * 3,
      destWidth: 226 * 3,
      destHeight: 226 * 3,
      canvasId: 'hiddenId',
      quality: 1,
      success: function (res) {
        _this.saveImage(res.tempFilePath)
        console.log(res.tempFilePath)
      },
      fail() { _this.saveFail() }
    })
  },
  // 保存到相册
  saveImage(path) { 
    var _this = this
    util.authorize('scope.writePhotosAlbum', function () {
      util.saveImage({
        _this: _this,
        url: path,
        callback(res) {
          wx.hideLoading()
          wx.showToast({ title: '保存完成' })
        },
        callbackFail() {
          _this.saveFail()
        }
      })
    },_this)
  },
  onLoad: function (options) {
    wx.showLoading({ title: '二维码生成中...' })
    this.getCode()
  }
})