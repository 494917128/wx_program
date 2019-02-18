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
    name: '',
    material: [],
  },
  x: windowWidth * 1.1,
  y: windowHeight * 1.5 - 103 - windowWidth * .4,
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
    var ctx = wx.createCanvasContext('header'),
      image = this.data.image,
      x = this.x - windowWidth * 1.1, // 截图的x轴
      y = this.y - windowHeight * 1.5 + 103 + windowWidth * .4 // 截图的y轴    
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, windowWidth * .8, windowWidth * .8)
    ctx.drawImage(image.url, x, y, image.width * this.scale, image.height * this.scale)
    this.drawMaterial(ctx, function(){
      wx.canvasToTempFilePath({
        canvasId: 'header',
        quality: 1,
        success(res) {
          wx.navigateTo({
            url: '/pages/program/meetingHeaderSave/meetingHeaderSave?src=' + encodeURIComponent(res.tempFilePath),
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
    if (this.data.image.url){
      this.drawCanvas()
    } else {
      wx.showModal({
        title: '提示',
        content: '请先上传图片',
        showCancel: false,
        success(res){
          if(res.confirm){
            _this.uploadImage()
          }
        }
      })
    }
  },
  // 上传图片
  uploadImage(){
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
              windowWidth: windowWidth,
              windowHeight: wx.getSystemInfoSync().windowHeight,
            })
          },
        })
      }
    })
  },
  // 画素材
  drawMaterial(ctx, callbcak){
    var _this = this,
      material = this.data.material,
      scale = windowWidth * .8 / 375
    ctx = ctx || wx.createCanvasContext('material')

    ctx.setTextBaseline('top')
    ctx.setTextAlign('center')
    material.map((item,index)=>{
      if (item.type == 1) { // 图片
        if (callbcak) { // 代表最终画图
          ctx.drawImage(this.data.material_img_save, 0, 0, windowWidth * .8, windowWidth * .8)
        } else { // 代表生成预览
          _this.setData({ material_img: item.des })
        }
      } else { // 文字
        ctx.setFillStyle(item.color)
        ctx.setFontSize(item.size * scale)
        var text = ''
        if (item.font_form == 2) { // 竖排
          if (item.type == 2) { // 文字
            text = item.des
            text = text.split('')
          } else if (item.type == 3) { // 用户名
            text = _this.data.name
            text = text.split('')
          }
          text.map((text,index)=>{
            ctx.fillText(text, 10||item.x * scale, item.y * scale + index * item.size * scale * 1.3) // 1.3倍间距
          })
        } else { // 横排
          if (item.type == 2) { // 文字
            text = item.des
          } else if (item.type == 3) { // 用户名
            text = _this.data.name
          }
          ctx.fillText(text, item.x * scale, item.y * scale)
        }
      }
    })
    ctx.draw(false,function(){
      callbcak && callbcak()
    })
    // setTimeout(()=>{
    //   callbcak &&　callbcak()
    // },1000)
  },
  // 姓名
  nameValue(e) {
    var value = e.detail.value
    this.setData({
      name: value
    })
    this.drawMaterial()
  },
  // 图片下载到本地地址
  downImage(data, i) {
    var _this = this
    data.data.list.map((item, index) => {
      if (i <= index){
        if (item.type == 1) { // 是图片下载到本地
          wx.getImageInfo({
            src: app.image_url + item.des,
            success(res){
              _this.setData({
                material_img_save: res.path
              })
            },
            fail(){
              wx.hideLoading()
              wx.showToast({
                title: '素材下载失败',
                icon: 'none',
              })
            }
          })
        }
        return;
      }
    })
  },

  pageData: function(){
    var _this = this
    util.request2({
      url: 'v1/meet/get-meet-type-details',
      method: 'POST',
      type: 'form',
      data: {
        meet_id: this.data.meet_id,
      },
      success: function (res) {
        var data = res.data

        wx.showLoading({ title: '加载素材中...', })
        _this.downImage(data,0) // 下载图片
        wx.hideLoading()
        _this.setData({
          material: data.data.list,
        })
        _this.drawMaterial()
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      name: options.name||'',
      meet_id: options.id,
    })
    this.pageData()
    // this.uploadImage()
  },
})