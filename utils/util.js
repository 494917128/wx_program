const app = getApp()

// 时间格式转字符串(date为时间格式的值，isTime表示是否显示时分秒)
const formatTime = (date, isTime) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + (isTime ? ' ' + [hour, minute, second].map(formatNumber).join(':') : '')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTime = (time) => {
  var hour = parseInt(time / 3600),
    minute = parseInt(time / 60 - hour * 60),
    second = parseInt(time - hour * 3600 - minute * 60)
  if (hour < 10 && hour != 0) { hour = '0' + hour }
  if (minute < 10) { minute = '0' + minute }
  if (second < 10) { second = '0' + second }
  return (hour ? hour + ':' : '') + minute + ':' + second
}

// 显示二维码二维码
const myCode = (_this) => {
  _this.setData({
    my_code_show: !_this.data.my_code_show
  })
}

// 首页加载各种数据（restart代表是否要重新加载）
const requestIndex = (_this, user_id, restart) => {
  if (app.globalData.userInfo && !restart) {
    _this.setData({
      user: app.globalData.userInfo,
      goods: app.globalData.goods,
      goods_text: app.globalData.goods_text,
      meida: app.globalData.meida,
      region: app.globalData.region,
      address: app.globalData.address||'',
      intro: app.globalData.intro,
      case_label: app.globalData.case_label,
      carousel_img: app.globalData.carousel_img,
      is_up: app.globalData.is_up,
      is_admin: app.globalData.is_admin,
    })
  } else {
    request2({
      url: 'v1/user/mini-user-info',
      method: 'get',
      data: {
        uid: user_id||''
      },
      success: function (res) {
        var data = res.data.data
        for (var i = 0, len = data.meida.length; i < len; i++) {
          data.meida[i].date = formatTime(new Date(Number(data.meida[i].add_time) * 1000))
        }
        console.log(data)
        app.globalData.userInfo = data.user
        if (data.user.user_id == '1') { app.globalData.userInfo.headimgurl = app.image_url + app.globalData.userInfo.mini_headimgurl }
        app.globalData.goods = data.goods
        app.globalData.goods_text = data.goods_text
        app.globalData.meida = data.meida
        app.globalData.region = data.region.region_name
        app.globalData.address = data.address||''
        app.globalData.intro = data.intro
        app.globalData.case_label = data.label
        app.globalData.carousel_img = data.carousel_img
        app.globalData.is_up = data.is_up

        app.globalData.show_user = data.user.user_id// 更改小程序显示的人变成用户
        app.globalData.is_admin = data.is_admin||0// 判断是否是管理员
        

        _this.setData({
          user: app.globalData.userInfo,
          goods: app.globalData.goods,
          goods_text: app.globalData.goods_text,
          meida: app.globalData.meida,
          region: app.globalData.region,
          address: app.globalData.address,
          intro: app.globalData.intro,
          case_label: app.globalData.case_label,
          carousel_img: app.globalData.carousel_img,
          is_up: app.globalData.is_up,
          is_admin: app.globalData.is_admin,
        })
      },

    })
  }
  if (app.globalData.qrCode && !restart) {
    _this.setData({
      qrCode: app.globalData.qrCode
    })
  } else {
    requestCode(_this, user_id)
  }
}
const requestCode = (_this, user_id) => {
  request({
    url: 'qrcode%2Findex',
    method: 'get',
    data: {
      u: user_id||''
    },
    success: function (res) {
      console.log(res)
      if (res.data.state == 0) {
        _this.setData({ qrCode_msg: res.data.data })
        app.globalData.qrCode_msg = res.data.data
        console.log(res.data.data)
      } else {
        _this.setData({ qrCode: res.data.images })
        app.globalData.qrCode = res.data.images
      }
    }
  })
}

const tokenReset = (callback) => {
  var refresh_token = wx.getStorageSync('refreshToken')||''
  request2({
    url: 'login/refresh',
    method: 'get',
    type: 'form',
    data: {
      refresh_token: refresh_token,
    },
    success(res) {
      console.log(res)
      if (res.data.state == 1) {
        app.globalData.mini_float = res.data.data.mini_float || {}
        wx.setStorageSync('userId', res.data.data.access_token)
        wx.setStorageSync('accessToken', res.data.data.access_token)
        wx.setStorageSync('refreshToken', res.data.data.refresh_token)
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];  //当前页面
        Page.setData({ guide: true });
        callback && callback()
      } else {
        wx.removeStorageSync('user_rank')
        wx.removeStorageSync('userId')
        wx.removeStorageSync('accessToken')
        wx.removeStorageSync('refreshToken')
        loginFail(res.data.message,'/pages/login/agent/agent')
      }
    },
    fail(){
      callback && callback()
    }
  })

}

// request
var before_network
const request = ({ prefix_url, url, data = {}, method, type, success }) => {
  var token = wx.getStorageSync('userId')
  if (token) { data.token = token }
  var ajax = wx.request({
    url: (prefix_url || app.url) + url,
    data: data,
    header: {
      'content-type': type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    method: method || 'POST',
    dataType: 'json',
    responseType: 'text',
    success: success,
    fail: function (res) {
      console.log(res)
      var callback = () => {
        request({ prefix_url, url, data, method, type, success })
      }
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型
          noneNetworl(res, callback)
        }
      })
    }
  })
  return ajax // 返回实例用于中断请求
}
const request2 = ({ prefix_url, url, data, method, type, success, fail }) => {
  var token = wx.getStorageSync('accessToken'),
    old_url = url;
  if (token) { url = url + '&accessToken=' + token;console.log(token) }
  var ajax = wx.request({
    url: (prefix_url || app.url2) + url,
    data: data,
    header: {
      'content-type': type == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    method: method || 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log(res)
      if (old_url == 'login/refresh') { // 为了tokenReset
        success && success(res)
      } else if (res.data.code == 200 || res.data.code == 0) {
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.message||'',
            icon: 'none',
          })
        } else {
          success && success(res)
        }
      } else if (res.data.code == 401) {
        fail && fail()
        wx.showToast({
          title: '登录已失效，请重新登录',
          icon: 'none',
          duration: 1500,
        })
        setTimeout(() => {
          // wx.navigateTo({ url: '/pages/login/agent/agent?again=1' })
          wxLogin()
        }, 1500)
      } else if (res.data.code == 429) { // 请求过快
        wx.showToast({
          title: '您点的太快了，请等下再试吧',
          icon: 'none',
          duration: 1500,
        })
      } else {
        fail && fail()
        wx.showToast({
          title: '请求出错',
          icon: 'none',
        })
      }
    },
    fail: function () {
      fail && fail()
      var callback = () => {
        request({ prefix_url, url, data, method, type, success })
      }
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型
          noneNetworl(res, callback)
        }
      })
    }
  })
  return ajax // 返回实例用于中断请求
}
const wxLogin = () => {
  var _this = this
  wx.login({
    success: function (ress) {
      if (ress.code) {
        wx.getUserInfo({
          success: function (res) {
            res.code = ress.code

            login(res)
          },
          fail() {
            // 显示点击授权模态框
            var pages = getCurrentPages();
            var Page = pages[pages.length - 1];  //当前页面
            Page.getUserInfo = (e) => {
              if (e.detail.detail.userInfo) {
                e.detail.detail.code = ress.code
                login(e.detail.detail)
              }
            }
            Page.setData({
              get_userinfo: true
            })
          }
        })
      }
    }
  })

}
const login = (res) => {
  console.log(res)
  var userInfo = JSON.stringify(res.userInfo)
  wx.showLoading({
    title: '登录中...',
  })

  request({
    url: 'login/register',
    data: {
      appid: app.AppID,
      secret: app.AppSecret,
      code: res.code,
      userInfo: userInfo,
      iv: res.iv,
      encryptedData: res.encryptedData,
    },
    method: 'post',
    type: 'form',
    success: function (res) {
      app.globalData.mini_float = res.data.mini_float||{}
      var pages = getCurrentPages();
      var Page = pages[pages.length - 1];  //当前页面
      if (Page.loginCallback) { // 适应登录页面的登录
        Page.loginCallback(res)
      } else {
        loginCallback(res)
      }
    }
  })

}
var loginTime = 1
const loginCallback = (res) => {
  wx.hideLoading()
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
      success() { // 储存完毕再执行
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];  //当前页面
        Page.setData({ guide: true });
        (Page.onPullDownRefresh && Page.onPullDownRefresh()) || (Page.pageData && Page.pageData()) // 刷新数据
      }
    })
    wx.showToast({
      icon: 'none',
      title: '登录成功'
    })
  } else if (res.data.state === 0) {
    if (loginTime < 5) { // 小于5次，登录失败，重新登录
      wxLogin() 
      loginTime++
      wx.showToast({
        icon: 'none',
        title: res.data.data == -41003 ? '登录失败，请再试' : String(res.data.data)
      })
    } else { // 大于等于5次，登录失败，报异常
      wx.showToast({
        icon: 'none',
        title: '登录异常，请联系管理员'
      })
      loginTime = 1
    }
  } else {
    wx.showToast({
      icon: 'none',
      title: '登录失败'
    })
  }
}

const upload = ({ url, tempFilePath, callback, file_name='', showLoading=true }) => {
  var token = wx.getStorageSync('accessToken');
  file_name = file_name.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')// 去除特殊字符
  if (showLoading) {
    wx.showLoading({
      title: '上传中...',
    })
  }
  wx.uploadFile({
    url: app.upload_url + '&accessToken=' + token + '&file=' + url + '&name=' + file_name,
    filePath: tempFilePath,
    name: 'file',
    success: function (res) {
      res = JSON.parse(res.data)
      if (res.code == 200){
        callback && callback(res.data)
      } else if (res.code == 401) {
        loginFail()
      } else {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
        })
      }
    },
    complete(){
      wx.hideLoading()
    }
  })

}
var noneNetworl = (res, callback) => {
  if (res.networkType == 'none') {
    wx.showToast({
      title: '当前无网络，请连接网络后再试',
      icon: 'none',
      duration: 5000
    })
  }
}
const loginFail = (msg,nav) => {
  wx.showToast({
    title: msg||'登录已失效，请重新登录',
    icon: 'none',
    duration: 1500,
  })
  setTimeout(() => {
    wx.navigateTo({
      url: nav||'/pages/login/agent/agent?again=1',
    })
  })
}

// 跳转webview
const webview = e => {
  var src  = e.currentTarget.dataset.src,
      type = e.currentTarget.dataset.type,
      title = e.currentTarget.dataset.title
  src = encodeURIComponent(src)
  wx.navigateTo({
    url: '/pages/webView/webView?src=' + src + '&title=' + (title||''),
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
                      if (wx.canIUse('openSetting')) {
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
              callback && callback(res)
            },
            fail() {
              callbackFail && callbackFail()
              wx.showToast({
                icon: 'none',
                title: '保存失败'
              })
            }
          })
        }
      })
    }, fail(res) {
      callbackFail && callbackFail(res)
      wx.showToast({ icon: 'none', title: '保存失败' })
    }
  })
}

// 内容列表的搜索
const contentNavbar = ({ _this, list_name = 'list', ajax, pageData, e }) => {
  _this.noticeBack && _this.noticeBack()
  var index = e.detail.currentTarget.dataset.index

  if(index == _this.data.nav_index)
    return;
  _this.setData({
    nav_index: index,
    notice_content: false,
  })
  if (index != 0 && _this.data[list_name].length == 0) {
    ajax && ajax.abort()
    pageData && pageData()
  }
}
const contentSearch = ({ _this, search_name = 'search', list_name = 'list', page_name = 'page', ajax, index, search_value = '', pageData }) => {
  _this.setData({
    [search_name]: search_value,
    [list_name]: [],
    [page_name]: 1,
  })
  ajax && ajax.abort()// 结束之前的请求
  pageData && pageData()
  console.log(search_value)
}
const noticeNext = ({ _this, list_name = 'list', ajax, pageData }) => {
  var notice_index = _this.data.notice_index
  if (notice_index == _this.data[list_name].length - 1) {
    ajax && ajax.abort()
    pageData && pageData(function () {
      _this.setData({
        notice_index: notice_index + 1
      })
    })
  } else {
    _this.setData({
      notice_index: notice_index + 1
    })
  }
}
//type：1为公司通告，2为百问百答，3为公司政策，4为培训资料
const contentPageData = ({ _this, type, search_name = 'search', list_name = 'list', page_name = 'page', loading_name = 'loading', ajax_name = 'ajax', index, callback, text_type }) => {
  _this.setData({ [loading_name]: true })// 加载中
  var list   = _this.data[list_name],
      page   = _this.data[page_name],
      search = _this.data[search_name],
      data   = {
        Page: page,
        type: type,
        content: search || '',
      }
  if (text_type) { // 学习资料有专有（文档、语音、视频、其他）
    data.text_type = text_type
  }

  var url = 'v1/media/get-media-list'
  if (type == 2) { url = 'v1/article/get-article-list' } // 百问百答
  if (type == 5) { url = 'v1/case/get-case-list' } // 客户案例
  _this[ajax_name] = request2({
    url: url,
    method: 'post',
    data: data,
    type: 'form',
    success: function (res) {
      var data = res.data
      console.log(data)
      list.push(...data.data.list)

      if (data.data.list.length == 0) {
        wx.showToast({
          icon: 'none',
          title: (search && (page == 1)) ? '未搜索到内容' : '没有更多了'
        })
      } else {
        _this.setData({
          [page_name]: page + 1,//页数自增
        })
      }

      _this.setData({
        [list_name]: list,
        [loading_name]: false,
      })

      data.data.list.length != 0 && callback && callback(data)
    }
  })
}
const contentReachBottom = ({ _this, boolean = true, loading_name = 'loading', ajax, index, pageData }) => {
  console.log('上拉加载')
  if (!_this.data[loading_name] && !_this.data.notice_content && boolean) {
    ajax && ajax.abort()
    pageData && pageData()    
  }
}
const contentDownRefresh = ({ _this, boolean = true, search_name = 'search', list_name = 'list', page_name = 'page', ajax, index, pageData }) => {
  console.log('下拉刷新')
  if (!_this.data.notice_content && boolean) {
    _this.setData({
      [search_name]: '',
      [list_name]: [],
      [page_name]: 1,
    })
    ajax && ajax.abort()
    pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)
  } else {
    wx.stopPullDownRefresh()
  }
}
// 通过转发消息进来
const contentShare = ({ _this, options, list_name = 'list', ajax, pageData, type }) => {
  if (options.nav_index) { 
    var e = { detail: { currentTarget: { dataset: { index: Number(options.nav_index) } } } }
    contentNavbar({
      _this: _this,
      list_name: list_name,
      ajax: ajax,
      pageData: pageData,
      e: e
    })
  }
  if (options.notice_id) {
    _this.setData({
      notice_content: true,
    })
    var data = { id: options.notice_id, type: type ? type : 0, },
      url = 'minfo/details'
    if (type == 1) { data = { id: options.notice_id }; url = 'minfo/media-detail' }
    if (type == 2) { data = { article_id: options.notice_id }; url = 'minfo/article-detail' }
    request({
      url: url,
      method: 'post',
      type: 'form',
      data: data,
      success(res) {
        var data = JSON.parse(res.data)
        console.log(data)
        _this.setData({
          notice_detail: data.data
        })
      }
    })
  }
  app.globalData.show_user = options.show_user || app.globalData.show_user || 1
}

module.exports = {
  formatTime,
  getTime,
  myCode,
  tokenReset,
  requestIndex,
  requestCode,
  request,
  request2,
  wxLogin,
  upload,
  webview,
  authorize,
  prevPage,
  compatible,
  saveImage,
  contentNavbar,
  contentSearch,
  noticeNext,
  contentPageData,
  contentReachBottom,
  contentDownRefresh,
  contentShare
}
