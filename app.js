//app.js
var token = wx.getStorageSync('accessToken')

App({
  onLaunch: function () {
    var _this = this
  },
  url: 'https://api.saiminet.com/wxxcx.php?r=',
  url2: 'https://api.saiminet.com/api/index.php?r=',
  socket: 'ws://api.saiminet.com:9501/',
  image_url: 'https://file.saiminet.com/',
  webview_url: 'https://wx.saiminet.com/mby/webview.html?web_view_src=',
  upload_url: 'https://api.saiminet.com/api/index.php?r=file/ali-oss',
  AppID: 'wx77c8e93db22f6d55',
  AppSecret: 'eb92b5a969f378e908a4c4d3930c420e',
  globalData: {
    userInfo: null,
    qrCode: '',
    first_launch: true, // 首次进入小程序，跳转到小程序页面
    data:{},
  }
})