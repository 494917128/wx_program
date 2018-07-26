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
    show: Boolean // 电话号码
  },

  data: {
    url: app.url
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
        itemList: ['保存到手机','长按识别'],
        success: function(res) {
          if(res.tapIndex===0){
            util.authorize('scope.writePhotosAlbum', function () {
              util.saveImage({
                _this,
                url: app.url + _this.data.qrCode,
                callback(res){
                  wx.showToast({
                    title: '保存成功',
                  })
                }
              })
            },_this)
          } else if(res.tapIndex===1){
            wx.showToast({
              title: '暂不支持长按识别',
              icon: 'none',
            })
          }
        },
      })
    }
  },
  ready () {

  },
})
