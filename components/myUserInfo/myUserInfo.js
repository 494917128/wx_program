const app = getApp()
Component({
  relations: {
    './myCode/myCode': {
      type: 'child',
    }
  },
  properties: {
    user: Object,
    intro: Object,
  },

  data: {

  },

  methods: {
    code: function(){
      this.triggerEvent('_myCode')
    },
    call() {
      wx.makePhoneCall({
        phoneNumber: this.data.user.mobile || this.data.user.mobile_phone
      })
    }
  },
  ready(){
    // this.setData({
    //   user: app.globalData.userInfo,
    //   intro: app.globalData.intro
    // })
  }
})
