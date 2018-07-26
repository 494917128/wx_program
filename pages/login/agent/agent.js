const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    count_down: 0,
  },
  // input值获取
  inputValue(e){
    const type = e.currentTarget.dataset.type
    const data = {}
    data[type] = e.detail.value + ""//转字符串
    this.setData(data)
  },
  // 验证码倒计时
  // countDown(){
  //   var _this = this
  //   this.setData({
  //     count_down: 60
  //   })
  //   this.interval = setInterval(()=>{
  //     if (_this.data.count_down > 0){
  //       _this.setData({
  //         count_down: _this.data.count_down - 1
  //       })
  //     }else{
  //       clearInterval(_this.interval)
  //     }
  //   },1000)
  // },

  // 发送验证码
  // sendCode(){
  //   var _this = this
  //   if (!this.data.phone || this.data.phone.length != 11){
  //     wx.showToast({
  //       icon: "none",
  //       title: '手机号码错误',
  //     })
  //   }else{
  //     wx.showToast({
  //       icon: "none",
  //       title: '验证码已发送',
  //     })
  //     this.countDown()
  //   }
  //   // util.request({
  //   //   prefix_url: 'http://wx.saiminet.com/',
  //   //   url:'index.php?r=sms/binding-mobiles',
  //   //   data: {
  //   //     mobile: 13566296373
  //   //   },
  //   //   type: "form",
  //   //   success:function(res){
  //   //     wx.showToast({
  //   //       icon: "none",
  //   //       title: '短信发送成功',
  //   //     })
  //   //   }
  //   // })
  // },

  // 登录
  binding(e){
    var phone = this.data.phone, 
      password = this.data.password
    if (!phone) {
      wx.showToast({
        icon: "none",
        title: '手机号码不能为空',
      })
    } else if (!password) {
      wx.showToast({
        icon: "none",
        title: '密码不能为空',
      })
    } else {
      util.request({
        url: 'index.php?r=login/login',
        data: {
          mobile: phone,
          password: password
        },
        type: "form",
        success: function (res) {
          console.log(res)
          if( res.data.state === 1) { 
            wx.setStorage({
              key: 'userId',
              data: res.data.user_id,
            })
            wx.reLaunch({
              url: '/pages/agent/index'
            })
            wx.showToast({
              icon: 'none',
              title: '登录成功'
            })
          } else if ( res.data.state === 0) {
            wx.showToast({
              icon: 'none',
              title: res.data.date
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '登录失败'
            })
          } 
        }
      })
    }
  },
  // 判断
  judeg(){

  },
  // 跳转官方展示板
  showOfficial(){
    app.globalData.show_user = 9940
    wx.reLaunch({
      url: '/pages/program/index/index',
    })
  },
  onLoad: function (options) {
    var _this = this
    this.setData({
      user: app.globalData.userInfo      
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          wx.reLaunch({
            url: '/pages/agent/index'
          })
        }
      },
    })
  },
  onUnload(){
    clearInterval(this.interval)
  }
})