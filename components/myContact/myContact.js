const app = getApp()
Component({
  relations: {

  },
  properties: {
    index: Boolean,
    user: Object,
  },

  data: {

  },

  methods: {
    call() {
      wx.makePhoneCall({
        phoneNumber: this.data.user.mobile || this.data.user.mobile_phone
      })
    }
  },
  ready() {
    console.log(this.data.user)
    if(this.data.user)
      return
    this.setData({user:app.globalData.userInfo})
  }
})
