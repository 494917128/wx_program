const app = getApp()
import util from "../../../utils/util.js";
var res = wx.getSystemInfoSync(),
  windowWidth = res.windowWidth,
  windowHeight = res.windowHeight

Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    image: {},
    material_img: '/upload/nianhui/403027429286723788.jpg',
  },
  x: 410 * windowWidth / 750 * 1.1,
  
  y: 720 * windowWidth / 750 * 1.5 - 720 * windowWidth / 750 * .4,
  scale: 0.8,
  onChange: function (e) {
    this.x = e.detail.x
    this.y = e.detail.y
  },
  onScale: function (e) {
    this.x = e.detail.x
    this.y = e.detail.y
    this.scale = e.detail.scale
  },
  // 画canvas
  drawCanvas() {
    var _this = this,
      ctx = wx.createCanvasContext('header'),
      image = this.data.image,
      viewHeight = this.data.viewHeight,
      viewWidth = this.data.viewWidth,
      x = this.x - viewWidth, // 截图的x轴
      y = this.y - viewHeight, // 截图的y轴    
      scale = windowWidth / 750
      
    ctx.drawImage(this.data.material_img_save, 0, 0, windowWidth, this.data.material_img_height)
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(15 * scale, 430 * scale, windowWidth - 30 * scale, 410 * scale)
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.rect(15 * scale, 430 * scale, windowWidth - 30 * scale, 410 * scale)
    ctx.clip();
    ctx.drawImage(image.url, x + 15 * scale, y + 430 * scale, image.width * this.scale, image.height * this.scale)
    ctx.restore();
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        canvasId: 'header',
        quality: 1,
        success(res) {
          
          wx.navigateTo({
            url: '/pages/program/meetingSave/meetingSave?src=' + encodeURIComponent(res.tempFilePath),
          })
          // util.saveImage({
          //   url: res.tempFilePath,
          //   callback(res) {
          //     wx.showToast({
          //       title: '保存成功',
          //     })
          //   }
          // })
        }
      })
    })
  },
  // 点击生成
  downloadImage() {
    var _this = this
    if (this.data.image.url) {
      this.drawCanvas()
    } else {
      wx.showModal({
        title: '提示',
        content: '请先上传图片',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            _this.uploadImage()
          }
        }
      })
    }
  },

  // 图片下载到本地地址
  downImage() {
    var _this = this
    wx.getImageInfo({
      src: app.image_url + _this.data.material_img,
      success(res) {
        console.log(res)
        _this.setData({
          material_img_save: res.path,
          material_img_height: res.height / res.width * windowWidth
        })
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '素材下载失败',
          icon: 'none',
        })
      }
    })
  },

  // 上传图片
  uploadImage() {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            var width = windowWidth,
              height = res.height / res.width * width
            _this.setData({
              'image.url': res.path,
              'image.width': width,
              'image.height': height,
              viewWidth: 720 * windowWidth / 750,
              viewHeight: 410 * windowWidth / 750,
            })
          },
        })
      }
    })
  },


  onLoad: function (options) {
    this.downImage()
  },
})