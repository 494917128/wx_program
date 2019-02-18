const app = getApp()
import util from "../../utils/util.js";
Component({
  relations: {
    './myUserInfo/myUserInfo': {
      type: 'parent',
    },

  },
  properties: {
    qrCode: String,
    qrCode_msg: String,
    show: {
      type: Boolean,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        if (newVal && this.data.qrCode) {
          this.code() // 因为不能监控退出预览图片，所以在进入预览图片是就设置
          this.previewImage()
        }
      }
    },
  },

  data: {
    image_url: app.image_url,
  },

  methods: {
    code: function () {
      this.triggerEvent('_myCode')
    },
    // 阻止冒泡
    stop:function(){},
    // 长按（暂不支持长按识别）
    longpress(){
      var _this = this
      wx.showActionSheet({
        itemList: ['保存到手机'],
        success: function(res) {
          if(res.tapIndex===0){
            util.authorize('scope.writePhotosAlbum', function () {
              wx.showLoading({ title: '保存中...' })              
              util.saveImage({
                _this,
                url: app.image_url + _this.data.qrCode,
                callback(res){
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功',
                  })
                },
                callbackFail() {
                  wx.hideLoading()
                }
              })
            },_this)
          // } else if(res.tapIndex===1){
          //   wx.showToast({
          //     title: '暂不支持长按识别',
          //     icon: 'none',
          //   })
          }
        },
      })
    },
    // 预览图片
    previewImage() {
      var image_url = 'https://api.saiminet.com/'
      wx.previewImage({
        current: image_url + this.data.qrCode, // 当前显示图片的http链接
        urls: [image_url + this.data.qrCode], // 需要预览的图片http链接列表
      })
    },
  },
  ready () {

  },
})
