const app = getApp()
Component({
  relations: {

  },
  properties: {
    index: Boolean,
    user: Object,
    region: String,
    address: Object,
  },

  data: {

  },

  methods: {
    call() {
      var phone = this.data.user.mobile || this.data.user.mobile_phone
      if (phone) { 
        wx.makePhoneCall({
          phoneNumber: phone
        })
      } else { 
        wx.showToast({
          icon: 'none',
          title: '该用户无电话',
        })
      }
    },
    address(){
      var address = this.data.address
      if (address) { 
        var latitude = Number(address.lat)
        var longitude = Number(address.lng)
        var name = this.data.region
        wx.openLocation({
          latitude,
          longitude,
          name,
          scale: 28
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无地址',
        })
      }
    }
  },
  ready() {

  }
})
