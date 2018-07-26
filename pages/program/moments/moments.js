const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    now: util.formatTime(new Date, true),
    list: [],
    page: 1,
    loading: false,
  },
  // 获取图片宽高
  imageLoad(e) { 
    var index = e.currentTarget.dataset.index
    
    var width = e.detail.width,    //获取图片真实宽度  
      height = e.detail.height,
      ratio = width / height;      //图片的真实宽高比例  
    
    // 根据宽高比来定实际图片大小
    if(ratio > 1){
      var viewWidth = 490, 
        viewHeight = 490 / ratio;  
    } else {
      var viewHeight = 490,  
        viewWidth = 490 * ratio;
    }

    // 宽高最低276rpx
    viewWidth = viewWidth < 274 ? 274 : viewWidth
    viewHeight = viewHeight < 274 ? 274 : viewHeight

    this.setData({
      ['list[' + index +'].imgwidth']: viewWidth,
      ['list[' + index + '].imgheight']: viewHeight
    })  
  },
  // 复制文案
  copyText(e, callback) {
    var index = e.currentTarget.dataset.index
    var text = this.data.list[index].material_desc
    util.compatible({
      api: wx.setClipboardData,
      callback: function () {
        wx.setClipboardData({
          data: text,
        })
      }
    })
    if (typeof callback == 'function') {
      callback()
    } else {
      wx.showToast({
        title: '文案复制成功',
      })
    }
  },
  // 保存图片
  image_i: 0,
  copyImage(images) {
    var _this = this
    if (_this.image_i < images.length) {
      wx.showLoading({ mask: true })
      util.saveImage({
        _this: this,
        url: _this.data.image_url + images[_this.image_i],
        callback(res) {
          if (_this.image_i < images.length - 1) { //还在保存中
            _this.image_i++
            _this.copyImage(images)
          } else { //保存已完成
            _this.image_i = 0
            wx.hideLoading()
            wx.showToast({ title: '保存完成' })
          }
        },
        callbackFail() {
          wx.hideLoading()
        }
      })
    }
  },
  // 保存视频
  copyVideo(_this, video) {
    wx.downloadFile({
      url: video,
      success: function (res) {
        console.log(res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          util.compatible({// 兼容版本
            api: wx.saveVideoToPhotosAlbum,
            callback: function () {
              wx.saveVideoToPhotosAlbum({
                filePath: res.path,
                success(res) {
                  wx.showToast({ icon: 'none', title: res.errMsg })
                },
              })
            }
          })
        }
      }, fail(res) {
        wx.showToast({
          icon: 'none',
          title: res.errMsg,
        })
      }
    })
  },
  // 保存全部
  copyAll(e) {
    this.copyText(e)

    var _this = this
    var index = e.currentTarget.dataset.index
    var images = this.data.list[index].material_img
    var video = this.data.list[index].material_video
    console.log(images)
    console.log(video)

    // 判断授权
    util.authorize('scope.writePhotosAlbum', function () {
      // 循环下载图片
      _this.copyImage(images)
      // 下载视频
      if (video) {
        _this.copyVideo(_this, video)
      }
    }, _this)
  },
  // 预览图片
  previewImage(e) {
    var _this = this
    var index = e.currentTarget.dataset.index// 第几个素材
    var idx = e.currentTarget.dataset.idx// 素材中的第几个图片
    var images = this.data.list[index].material_img
    var url = this.data.image_url
    var urls = []
    for (var i = 0, len = images.length; i < len; i++) {
      urls.push(url + images[i])
    }
    wx.previewImage({
      current: url + images[idx], // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 获取用户信息
  getUserInfo(e) {
    var headimgurl = 'user.headimgurl';
    var nickname = 'user.nickname';
    if (e.detail.detail.userInfo) {
      this.setData({
        [headimgurl]: e.detail.detail.userInfo.avatarUrl,
        [nickname]: e.detail.detail.userInfo.nickName,
      })
    }
  },
  // 页面加载数据
  pageData() {
    var _this = this
    this.setData({ loading: true })
    util.request({
      url: 'index.php?r=minfo/list',
      method: 'get',
      data: {
        page: _this.data.page,
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data)
        var list = _this.data.list
        list.push(...data.data.list)


        if (data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: '没有更多了'
          })
        } else {
          _this.setData({
            page: _this.data.page + 1,
          })
        }

        _this.setData({
          list: list,
          loading: false,
        })
      }
    })
  },
  onLoad: function (options) {
    this.pageData()
  },
  onShow() {
    var _this = this
    wx.getUserInfo({
      success: function (res) {
        var headimgurl = 'user.headimgurl';
        var nickname = 'user.nickname';
        _this.setData({
          [headimgurl]: res.userInfo.avatarUrl,
          [nickname]: res.userInfo.nickName,
        })
      },
      fail() {
        // 显示点击授权模态框
        _this.setData({
          get_userinfo: true
        })
      }
    })
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    if (!this.data.loading) {
      this.pageData()
    }
  },
  // 下拉刷新
  onPullDownRefresh() { 
    console.log('下拉刷新')
    this.setData({
      list: [],// 重新加载
      page: 1,// 页数为1
    })
    this.pageData()
    setTimeout(() => { wx.stopPullDownRefresh() }, 1000)    
  }
})