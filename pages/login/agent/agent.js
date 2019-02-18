const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    count_down: 0,
    get_userinfo: false,
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
  //   //   url:'sms/binding-mobiles',
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
    var phone  = this.data.phone, 
      password = this.data.password,
      _this    = this
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
      wx.showLoading({
        title: '登录中...',
      })
      util.request({
        url: 'login/login',
        data: {
          mobile: phone,
          password: password
        },
        type: "form",
        success: function (res) {
          _this.loginCallback(res)
        }
      })
    }
  },
  loginCallback (res) {
    var _this = this
    wx.hideLoading()
    if (!res.data.user) {res.data.user = {}}
    if (res.data.state === 1) {
      wx.setStorage({ // 储存用户等级，大于等于6是官方
        key: 'user_rank',
        data: res.data.user.user_rank,
      })
      wx.setStorage({ // 储存userid（适应之前版本）
        key: 'userId',
        data: res.data.user_id,
      })
      wx.setStorage({ // 储存换取token的refreshToken
        key: 'refreshToken',
        data: res.data.toke.refresh_token || '',
      })
      wx.setStorage({ // 储存token
        key: 'accessToken',
        data: res.data.toke.access_token || '',
        success(){ // 储存完毕再执行
          if (_this.again) { // 当是token失效时进入的，成功后后退一页
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            _this.setData({ guide: true });
            (prevPage.onPullDownRefresh && prevPage.onPullDownRefresh()) || (prevPage.pageData && prevPage.pageData()) // 刷新数据
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            },0)
          } else if (res.data.user.user_rank >= 6) { // 是官方，跳到个人中心
            wx.reLaunch({
              url: '/pages/agent/index?is_login=1&guide=1'
            })
          } else { // 不是官方，跳到小程序首页
            _this.showOfficial()
          }
        }
      })
      wx.showToast({
        icon: 'none',
        title: '登录成功'
      })
    } else if (res.data.state === 0) {
      wx.showToast({
        icon: 'none',
        title: res.data.data == -41003 ? '登录失败，请再试' : res.data.data
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '登录失败'
      })
    } 
  },
  // 判断
  judeg(){

  },
  // 跳转官方展示板
  showOfficial(){
    app.globalData.show_user = 1
    wx.reLaunch({
      url: '/pages/program/index/index?guide=1',
    })
  },
  // 获取用户信息
  getUserInfo(e) {
    var _this = this
    wx.login({
      success: function (ress) {
        if (ress.code) {
          if (e.detail.detail.userInfo) {
            e.detail.detail.code = ress.code
            util.login(e.detail.detail)
          }
        }
      }
    })
  },
  onLoad: function (options) {
    var _this = this
    this.setData({
      user: app.globalData.userInfo
    })
    if (options.again) { // 判断是否是token失效的再次登录
      this.again = true
      util.wxLogin()
    } else {
      wx.getStorage({
        key: 'user_rank',
        success: function (res) {
          console.log(res.data)
          if (Number(res.data) >= 6) { // 是官方
            wx.reLaunch({
              url: '/pages/agent/index'
            })
          } else { // 不是官方
            // 获取个人信息
            _this.canNotLogin(options)
          }
        },
        fail () { 
          // 获取个人信息
          _this.canNotLogin(options)
        }
      })
    }

  },
  canNotLogin(options){ 
    var _this = this
    // 获取个人信息
    if (!options.edit) {
      util.wxLogin()
    }
  },
  onUnload(){
    clearInterval(this.interval)
  },
  // // 下拉刷新
  // onPullDownRefresh() {
  //   console.log('下拉刷新')
  //   this.onLoad({})
  // },
})