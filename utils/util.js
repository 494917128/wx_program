const app = getApp()

// 时间格式转字符串(date为时间格式的值，isTime表示是否显示时分秒)
const formatTime = (date, isTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + (isTime ? ' ' + [hour, minute, second].map(formatNumber).join(':') : '')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示二维码二维码
const myCode = (_this) => {
  // wx.previewImage({
  //   current: app.url + _this.data.qrCode, // 当前显示图片的http链接     
  //   urls: [app.url + _this.data.qrCode] // 需要预览的图片http链接列表     
  // })
  _this.setData({
    my_code_show: !_this.data.my_code_show
  })
}

// 首页加载各种数据（restart代表是否要重新加载）
const requestIndex = (_this, user_id, restart) => {
  user_id = user_id || wx.getStorageSync('userId')
  if (app.globalData.userInfo && !restart) {
    _this.setData({
      user: app.globalData.userInfo,
      goods: app.globalData.goods,
      meida: app.globalData.meida,
      region: app.globalData.region,
      address: app.globalData.address,
      intro: app.globalData.intro,
    })
  } else {
    request({
      url: 'index.php?r=minfo%2Findex',
      method: 'get',
      data: {
        uid: user_id
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        for (var i = 0, len = data.meida.length; i < len; i++) {
          data.meida[i].date = formatTime(new Date(Number(data.meida[i].add_time) * 1000))
        }
        console.log(data)

        app.globalData.userInfo = data.user
        app.globalData.goods = data.goods
        app.globalData.meida = data.meida
        app.globalData.region = data.region
        app.globalData.address = data.address
        app.globalData.intro = data.intro,
        _this.setData({
          user: app.globalData.userInfo,
          goods: app.globalData.goods,
          meida: app.globalData.meida,
          region: app.globalData.region,
          address: app.globalData.address,
          intro: app.globalData.intro,
        })
      },

    })
  }
  if (app.globalData.qrCode && !restart) {
    _this.setData({
      qrCode: app.globalData.qrCode
    })
  } else {
    request({
      url: 'index.php?r=qrcode%2Findex',
      method: 'get',
      data: {
        u: user_id
      },
      success: function (res) {
        console.log(res)
        _this.setData({ qrCode: res.data.images })
        app.globalData.qrCode = res.data.images
      }
    })
  }
}


// request
const request = ({ prefix_url, url, data, method, type, success }) => {
  wx.request({
    url: (prefix_url || app.url) + url,
    data: data,
    header: {
      'content-type': type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    method: method || 'POST',
    dataType: 'json',
    responseType: 'text',
    success: success,
    fail: function () { }
  })
}

// 跳转webview
const webview = e => {
  var src = e.currentTarget.dataset.src
  app.globalData.noticeContent = src
  wx.navigateTo({
    url: '/pages/webView/webView',
  })
}

// 授权（暂时只用到保存到相册）
const authorize = (scope, callback, _this) => {
  compatible({// 兼容
    api: wx.getSetting,
    callback: function () {
      wx.getSetting({
        success(res) {
          if (!res.authSetting[scope]) {
            wx.authorize({
              scope: scope,
              success() {
                callback && callback()
              }, fail(res) {
                wx.showModal({
                  title: '提示',
                  content: '保存失败，请打开授权--保存到相册',
                  success(res) {
                    if (res.confirm) {
                      if (!wx.canIUse('openSetting')) {// 这里的！要去掉的，现在只是适应调试器
                        wx.openSetting()
                      } else {
                        _this.setData({
                          open_setting: true
                        })
                      }
                    }
                  }
                })
              }
            })
          } else {
            callback && callback()
          }
        }
      })
    }
  })
}

// 设置上一个页面参数并返回上个页面
const prevPage = (data) => {
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];  //上一个页面
  prevPage.setData(data)
  // 返回上一个页面
  wx.navigateBack({
    delta: 1,
  })
}

// 接口兼容
const compatible = ({ api, callback }) => {
  if (api) {
    callback()
  } else {
    wx.showModal({ title: '提示', content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。' })
  }
}

// 保存图片
const saveImage = ({ _this, url, callback, callbackFail }) => {
  wx.getImageInfo({
    src: url,
    success: function (res) {
      compatible({// 兼容版本
        api: wx.saveImageToPhotosAlbum,
        callback: function () {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(res) {
              callback(res)
            },
            fail() {
              callbackFail()
              wx.showToast({ 
                icon: 'none', 
                title: '保存失败' 
              })
            }
          })
        }
      })
    }, fail() {
      callbackFail()
      wx.showToast({ icon: 'none', title: '保存失败' })
    }
  })
}

module.exports = {
  formatTime,
  myCode,
  requestIndex,
  request,
  webview,
  authorize,
  prevPage,
  compatible,
  saveImage
}
