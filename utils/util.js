const app = getApp()


const formatTime = (date,isTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + (isTime?' ' + [hour, minute, second].map(formatNumber).join(':'):'')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 二维码
const myCode = (_this) => {
  // wx.previewImage({
  //   current: app.url + _this.data.qrCode, // 当前显示图片的http链接     
  //   urls: [app.url + _this.data.qrCode] // 需要预览的图片http链接列表     
  // })
  _this.setData({
    my_code_show: !_this.data.my_code_show
  })
}

// 首页加载数据
const requestIndex = _this =>{
  if (app.globalData.userInfo) {
    _this.setData({
      user: app.globalData.userInfo,
      goods: app.globalData.goods,
      meida: app.globalData.meida,
      qrCode: app.globalData.qrCode
    })
  } else {
    request({
      url: 'index.php?r=qrcode%2Findex&u=11677',
      data: '',
      success: function (res) {
        console.log(res)
        _this.setData({ qrCode: res.data.images })
        app.globalData.qrCode = res.data.images
      }
    })

    request({
      url: 'index.php?r=minfo%2Findex&u=11677',
      data: '',
      success: function (res) {
        var data = JSON.parse(res.data)
        for (var i = 0, len = data.meida.length; i < len; i++) {
          data.meida[i].date = formatTime(new Date(Number(data.meida[i].add_time) * 1000))
        }
        console.log(data)

        app.globalData.userInfo = data.user
        app.globalData.goods = data.goods
        app.globalData.meida = data.meida
        _this.setData({
          user: app.globalData.userInfo,
          goods: app.globalData.goods,
          meida: app.globalData.meida
        })
      },

    })
  }
}

// request
const request = ({url, data, success}) =>{
  wx.request({
    url: app.url + url,
    data: data,
    header: {}  ,
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: success,
    fail: function(){}
  })
}

module.exports = {
  formatTime,
  myCode,
  requestIndex,
  request
}
