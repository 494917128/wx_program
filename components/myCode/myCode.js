const app = getApp()
Component({
  relations: {
    './myUserInfo/myUserInfo': {
      type: 'parent',
    }
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
    stop:function(){}
  },
  ready () {
    if (this.data.qrCode)
      return
    this.setData({ qrCode: app.globalData.qrCode })
  },
})
