const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url
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
      url: 'qrcode/mini-code',
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
        _this.codeImageInfo(app.image_url + res.data.img, res.data.headimgurl)
      },
      fail() { _this.fail() }
    })
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx77c8e93db22f6d55&secret=eb92b5a969f378e908a4c4d3930c420e',
    //   success: function(res){
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
    //       data: {
    //         scene: 10867,
    //         // auto_color: '#ff0000',
    //         page: 'pages/program/index/index',
    //       },
    //       method: 'POST',
    //       responseType: 'arraybuffer',
    //       success: function(res){
    //         let base64 = wx.arrayBufferToBase64(res.data);
            
    //         var userImageBase64 = 'data:image/jpg;base64,' + base64;;
    //         _this.setData({ image: userImageBase64})
    //       }
    //     })
    //   }
    // })
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
      fail() { _this.fail();console.log(1) }
    })
  },
  // 画canvas
  drawCanvas(codeimgurl, headimgurl, canvasId, mulriple) {
    var ctx = wx.createCanvasContext(canvasId),
      top = 55 * mulriple
    ctx.setFillStyle('#03A9F4')
    ctx.fillRect(0, 0, 226 * mulriple, top)
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(16 * mulriple)
    ctx.setTextAlign('center')
    ctx.fillText('赛蜜新零售2.0', 113 * mulriple, 20 * mulriple)
    ctx.fillText('消费省钱 分享赚钱', 113 * mulriple, 45 * mulriple)
    ctx.drawImage(codeimgurl, 0, 0 + top, 226 * mulriple, 226 * mulriple)
    ctx.save()
    ctx.beginPath()
    ctx.arc(113 * mulriple, 113 * mulriple + top, 50 * mulriple, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(headimgurl, 63 * mulriple, 63 * mulriple + top, 100 * mulriple, 100 * mulriple)
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
      height: 281 * 3,
      destWidth: 226 * 3,
      destHeight: 281 * 3,
      canvasId: 'hiddenId',
      quality: 1,
      success: function (res) {
        _this.saveImage(res.tempFilePath)
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