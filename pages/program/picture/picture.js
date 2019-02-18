const app = getApp(),
  util = require("../../../utils/util.js")

Page({
  data: {
    image: '',
    name: '',
  },
  // 上传图片
  uploadImage() {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        var size = res.tempFilePaths[0].size
        
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            if (res.height * res.width / 2 / 1024 <= 500){ //图片质量小于500k
              wx.showToast({
                title: '您的照片质量太低，请重新上传',
                icon: 'none'
              })
            } else {
              _this.setData({
                image: res.path,
              })
            }
          },
        })
      }
    })
  },
  // 姓名
  nameValue(e) {
    var value = e.detail.value
    this.setData({
      name: value
    })
  },
  submit() {
    var name = this.data.name,
      image = this.data.image
    if (!name) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
      })
    } else if (!image) {
      wx.showToast({
        title: '请上传您的照片',
        icon: 'none',
      })
    } else {
      util.upload({
        url: 'picture', 
        tempFilePath: image, 
        file_name: name,        
        callback (res){
          console.log(res)
        },
      })
    }
  },

  onLoad: function () {

  },
})