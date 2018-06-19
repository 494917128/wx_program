const app = getApp()
Component({
  relations: {
    './myCode/myCode': {
      type: 'child',
    }
  },
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    phone: Number // 电话号码
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
    this.setData({user: app.globalData.userInfo})
  }
})
