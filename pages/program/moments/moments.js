const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    now: util.formatTime(new Date, true),
    nav_list: ["朋友圈", "线上课程", "学习资料"],
    nav_index: 0,
    study_nav: [],
    study_nav_index: 0,
    list: [],
    list_4: [],
    list_5: [],
    page: 1,
    page_4: 1,
    page_5: 1,
    loading: false,
    loading_4: false,
    loading_5: false,
    search_4: '',
    search_5: '',

    audio_slide: 0,
    audio_duration: '00:00',
    audio_currentTime: '00:00',

  },
  // nav导航
  navbar(e) {
    if (e.detail.currentTarget.dataset.index == 1) { // 线上课程
      wx.navigateTo({
        url: '/pages/program/classType/classType',
      })
    } else {
      util.contentNavbar({
        _this: this,
        list_name: 'list_4',
        ajax: this.ajax_4,
        pageData: this.studyData,
        e: e
      })
    }

    if (e.detail.currentTarget.dataset.index == 2) { // 学习资料
      this.setData({
        before_video: ''
      })
    }

  },
  studyNavbar(e){
    this.setData({
      study_nav_index: e.detail.currentTarget.dataset.index,
      list_4: [],
      page_4: 1,
    })
    this.studyData()
  },

  switchIndex(type) {
    var _index = '',
      _type = ''
    switch (this.data.nav_index) {
      case (2):
        _index = '_4'
        _type = 4
        break;
      case ('2'):
        _index = '_4'
        _type = 4
        break;
      // case (2):
      //   _index = '_4'
      //   _type = 4
      //   break;
      // case ('2'):
      //   _index = '_4'
      //   _type = 4
      //   break;
    }
    if (type == 'type') {
      return _type
    } else {
      return _index
    }
  },
  // 获取图片宽高
  imageLoad(e) {
    var index = e.currentTarget.dataset.index,
        list = e.currentTarget.dataset.list

    var width = e.detail.width,    //获取图片真实宽度  
      height = e.detail.height,
      ratio = width / height;      //图片的真实宽高比例  

    // 根据宽高比来定实际图片大小
    if (ratio > 1) {
      var viewWidth = 400,
        viewHeight = 400 / ratio;
    } else {
      var viewHeight = 400,
        viewWidth = 400 * ratio;
    }

    // 宽高最低160rpx
    viewWidth = viewWidth < 160 ? 160 : viewWidth
    viewHeight = viewHeight < 160 ? 160 : viewHeight

    this.setData({
      [list + '[' + index + '].imgwidth']: viewWidth,
      [list + '[' + index + '].imgheight']: viewHeight
    })
  },
  // 复制文案
  copyText(e, callback) {
    var text = e.currentTarget.dataset.text
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
      console.log(app.image_url + images[_this.image_i])
      util.saveImage({
        _this: this,
        url: app.image_url + images[_this.image_i] + '?x-oss-process=style/shuiyin',
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
        callbackFail(res) {
          wx.hideLoading()
          console.log(res)
        }
      })
    }
  },
  // 保存视频
  copyVideo(_this, video) {
    wx.showLoading({
      title: '保存中',
    })
    console.log(app.image_url + video)
    wx.downloadFile({
      url: app.image_url + video,
      success: function (res) {
        console.log(res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          util.compatible({// 兼容版本
            api: wx.saveVideoToPhotosAlbum,
            callback: function () {
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.hideLoading()
                  wx.showToast({ icon: 'none', title: '保存完成' })
                },
                fail (res) {
                  wx.hideLoading()
                  console.log(res)
                  wx.showToast({ icon: 'none', title: '保存失败' })
                }
              })
            }
          })
        }
      }, fail(res) {
        wx.hideLoading()
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

    var _this = this,
      images = e.currentTarget.dataset.images,
      video = e.currentTarget.dataset.video

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
  deleteItem(e){
    var id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      list = this.data.list,
      _this = this
    wx.showModal({
      title: '提示',
      content: '是否删除该条朋友圈',
      success(res){
        if (res.confirm) { // 点确定后执行删除
          util.request2({
            url: 'v1/material/del',
            method: 'get',
            data: {
              material_id: id
            },
            success: function (res) {
              if (res.data.state == 1){
                wx.showToast({
                  title: '删除成功',
                })
                list.splice(index, 1)
                _this.setData({
                  list
                })
              }
            }
          })
        }
      },
    })
  },
  // 预览图片
  previewImage(e) {
    var _this = this,
        image = e.currentTarget.dataset.image,
        images = e.currentTarget.dataset.images
    var url = app.image_url
    var urls = []
    for (var i = 0, len = images.length; i < len; i++) {
      urls.push(url + images[i] + '?x-oss-process=style/shuiyin')
    }
    wx.previewImage({
      current: url + image + '?x-oss-process=style/shuiyin', // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 视频播放(只能播放一个)
  videoPlay(e) {
    var id = e.currentTarget.id,
        offsetTop = e.currentTarget.offsetTop
    if (this.data.before_video && id != this.data.before_video) {
      var video = wx.createVideoContext(this.data.before_video)
      video.pause()
    }
    this.setData({
      before_video: id,
      video_offsetTop: offsetTop
    })
  },
  // 获取用户信息
  getUserInfo(e) {
    var headimgurl = 'userinfo.headimgurl';
    var nickname = 'userinfo.nickname';
    console.log(e)
    
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
    var aa = new Date().getTime()
    this.ajax = util.request2({
      url: 'v1/material/get-material-list',
      method: 'post',
      type: 'form',
      data: {
        Page: _this.data.page,
        content: _this.data.picker_id||''
      },
      success: function (res) {
        var data = res.data
        if (data.data.list.length == 0) {
          wx.showToast({
            icon: 'none',
            title: (_this.data.picker_id && (_this.data.page == 1)) ? '未搜索到内容' : '没有更多了'
          })
          if (_this.data.picker_id && (_this.data.page == 1)) {
            _this.setData({ page: _this.data.old_page, list: _this.data.old_list })
            return
          }
        } else {
          _this.setData({
            page: _this.data.page + 1,
          })
        }

        var list = _this.data.list
        data.data.list.map((item, index) => {// 避免图片和视频同时出现（只显示图片）
          if (item.material_img.length && item.material_video) {
            item.material_img = []
          }
        })
        list.push(...data.data.list)

        var type_list = data.data.type_list,
          picker = []
        _this.type_list = type_list // 给上传素材传入标签
        type_list.map((item,index)=>{
          picker.push([{
            classify_id: item.classify_id,
            classify_name: item.classify_name,
            parent_id: item.parent_id,
            add_time: item.add_time,
          },...item.classify_list])
        })
        var data = { loading: false, picker_list: picker }
        if (list.length != 0) { data.list = list } // 有分类但是搜不到内容，不刷新列表

        _this.setData(data)
        
      }
    })
  },
  // 上传素材按钮
  uploadNavigator(){
    app.globalData.type_list = this.type_list
    wx.navigateTo({
      url: '/pages/program/upload/upload?type=friends',
    })
  },
  // picker搜索
  pickerChange(e){
    var value = e.detail.value,
      list = this.data.picker_list,
      picker_id = []
    list.map((item,index)=>{
      picker_id.push(item[value[index]].classify_id)
    })
    this.setData({
      picker_id,
    })
    var old_page = this.data.page,
      old_list = this.data.list
    this.setData({
      page: 1,
      list: [],
      old_page: old_page,
      old_list: old_list
    })
    this.pageData()
  },
  // 搜索
  searchValue(e) {
    this.setData({
      search_value: e.detail.value
    })
  },
  search() {
    var _index = this.switchIndex()
    util.contentSearch({
      _this: this,
      index: this.data.nav_index,
      search_value: this.data.search_value,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      ajax: this['ajax' + _index],
      pageData: this.studyData
    })
  },
  searchLabel(e){
    var value = e.currentTarget.dataset.value
    var _index = this.switchIndex()
    this.setData({
      search_value: value
    })
    util.contentSearch({
      _this: this,
      index: this.data.nav_index,
      search_value: this.data.search_value,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      ajax: this['ajax' + _index],
      pageData: this.studyData
    })
  },
  // 点击进入内容
  noticeContent(e) {
    this.setData({
      notice_content: true,
      notice_index: e.currentTarget.dataset.index
    })
    this.noticeAudio()    
  },
  // 内容返回
  noticeBack() {
    this.setData({
      notice_index: '',      
      notice_content: false,
      notice_detail: ''
    })
    this.audioStop()
  },
  // 内容上一篇
  noticePrev() {
    this.setData({
      notice_index: this.data.notice_index - 1
    })
    this.audioStop()
    this.noticeAudio()
  },
  // 内容下一篇
  noticeNext() {
    var _index = this.switchIndex()
    util.noticeNext({
      _this: this,
      list_name: 'list' + _index,
      ajax: this['ajax' + _index],
      pageData: this.studyData
    })
    this.audioStop()
    this.noticeAudio()
  },
  // 打开并下载文档
  noticeFile(e) {
    wx.showLoading({ mask: true })
    
    wx.downloadFile({
      url: app.image_url + e.currentTarget.dataset.url,
      success: function (res) {
        var filePath = res.tempFilePath
        console.log(res.tempFilePath)
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.hideLoading()            
            console.log('打开文档成功')
          },
          fail(res) {
            wx.hideLoading()
            console.log(res)            
            wx.showToast({
              title: '打开失败',
            })
          }
        })
      },
      fail(res){
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          title: '下载失败',
        })
      }
    })
  },
  noticeAudio() {
    var data = this.data.list_4[this.data.notice_index] || this.data.notice_detail,
        _this = this
    if (data.text_type == 2) {
      this.AudioContext = wx.createInnerAudioContext()
      this.AudioContext.autoplay = true
      this.AudioContext.src = app.image_url + data.file

      this.AudioContext.onPlay(() => {
        _this.setData({
          audio: 'play'
        })
      })
      this.AudioContext.onPause(() => {
        _this.setData({
          audio: 'pause'
        })
      })
      this.AudioContext.onStop(() => {
        this.setData({ audio: '' })
      })
      this.AudioContext.onEnded(() => {
        _this.setData({ audio: '' })
      })
      this.AudioContext.onTimeUpdate(() => {
        _this.setData({
          audio_slide: parseInt(_this.AudioContext.currentTime * 100 / _this.AudioContext.duration),
          audio_duration: util.getTime(_this.AudioContext.duration),
          audio_currentTime: util.getTime(_this.AudioContext.currentTime),
        })
      })
      this.AudioContext.onSeeked(() => {
        _this.AudioContext.play()
      })
      this.AudioContext.onWaiting((e) => {
        wx.showToast({
          icon: 'loading',
          title: '加载中',
        })
      })
      
      this.AudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    }
  },
  audioSlideing(e) {
    var value = e.detail.value,
        date  = parseInt(value * this.AudioContext.duration) / 100
    this.AudioContext.pause()
    this.setData({
      audio_currentTime: util.getTime(date),
    })
  },
  audioSlide(e) {
    var value = e.detail.value,
        date  = parseInt(value * this.AudioContext.duration) / 100
    this.AudioContext.seek(date)
  },
  audioPause() { 
    this.AudioContext.pause()
  },
  audioPlay() {
    !this.AudioContext && this.noticeAudio()
    if (!this.data.audio) { // 播放结束后，从新播放
      this.AudioContext.seek(0)
      this.setData({
        audio_currentTime: '00:00',
        audio_slide: 0,
      })
    } else {
      this.AudioContext.play()
    }
  },
  audioStop() { 
    this.AudioContext && this.AudioContext.stop()
    this.setData({
      audio: '',
      audio_slide: 0,
      audio_duration: '00:00',
      audio_currentTime: '00:00',
    })
  },
  noticeVideo(e) {
    this.copyVideo(this, e.currentTarget.dataset.url)
  },
  noticeImage(e) {
    var images = e.currentTarget.dataset.images
    this.copyImage(images)
  },
  previewNoticeImage(e) {
    var images = e.currentTarget.dataset.images,
        url = e.currentTarget.dataset.url,
        urls = []

    for (var i = 0, len = images.length; i < len; i++) {
      urls.push(app.image_url + images[i])
    }
    wx.previewImage({
      url: app.image_url + url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 数据请求
  studyData() {
    var _index = this.switchIndex(),
      _type = this.switchIndex('type'),
      _this = this
    util.contentPageData({
      _this: this,
      type: _type,
      index: this.data.nav_index,
      search_name: 'search' + _index,
      list_name: 'list' + _index,
      page_name: 'page' + _index,
      loading_name: 'loading' + _index,
      ajax_name: 'ajax' + _index,
      text_type: this.data.nav_index==2?this.data.study_nav_index:'',
      callback: function(res){
        _this.setData({
          study_nav: res.data.text_type
        })
      },
    })
  },

  onLoad: function (options) {
    console.log(options)
    this.pageData()
    var res = wx.getSystemInfoSync()
    this.setData({
      windowHeight: res.windowHeight,
    })
    util.contentShare({ // 通过转发消息进来
      _this: this,
      options: options,
      list_name: 'list_4',
      ajax: this.ajax_4,
      pageData: this.studyData,
    })
    util.requestIndex(this, app.globalData.show_user,true)
  },
  onShow() {
    var _this = this
    wx.getUserInfo({
      success: function (res) {
        var headimgurl = 'userinfo.headimgurl';
        var nickname = 'userinfo.nickname';
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
  onHide(){
    var _this = this
    setTimeout(()=>{
      var video = wx.createVideoContext(_this.data.before_video || '')
      video.webviewId = this.data.__webviewId__
      video.pause()
      var studyVideo = wx.createVideoContext('studyVideo')
      studyVideo.webviewId = this.data.__webviewId__
      studyVideo.pause()
      _this.audioStop()
    },1000)

  },
  // 上拉加载
  onReachBottom() {
    if (this.data.nav_index == 0) {
      console.log('上拉加载')
      if (!this.data.loading) {
        this.ajax.abort()
        this.pageData()
      }
    } else {
      var _index = this.switchIndex()
      util.contentReachBottom({
        _this: this,
        loading_name: 'loading' + _index,
        index: this.data.nav_index,
        ajax: this['ajax' + _index],
        pageData: this.studyData
      })
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    if (this.data.nav_index == 0) {
      console.log('下拉刷新')
      this.setData({
        list: [],// 重新加载
        page: 1,// 页数为1
      })
      this.ajax.abort()
      this.pageData()
      setTimeout(() => { wx.stopPullDownRefresh() }, 1000)
    } else {
      var _index = this.switchIndex()    
      util.contentDownRefresh({
        _this: this,
        boolean: this.data.nav_index != 0,
        search_name: 'search' + _index,
        list_name: 'list' + _index,
        page_name: 'page' + _index,
        index: this.data.nav_index,
        ajax: this['ajax' + _index],
        pageData: this.studyData
      })
    }
  },
  // 页面滚动
  onPageScroll(e) {
    if ((e.scrollTop > this.data.video_offsetTop + 230) || (e.scrollTop + this.data.windowHeight < this.data.video_offsetTop)) {
      if (this.data.before_video) {
        var video = wx.createVideoContext(this.data.before_video)
        video.pause()
        this.setData({
          before_video: null,
          video_offsetTop: null
        })
      }
    }
  },
  onShareAppMessage: function () {
    var path = '/pages/program/moments/moments?show_user=' + app.globalData.show_user + '&nav_index=' + this.data.nav_index,
      title = '赛蜜助手小程序'
    if (this.data.nav_index == 2) { title = '学习资料' }
    if (this.data.notice_index === 0 || this.data.notice_index || this.data.notice_detail) {
      path += '&notice_id=' + ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list_4[this.data.notice_index].id : this.data.notice_detail.id)
      title = ((this.data.notice_index === 0 || this.data.notice_index) ? this.data.list_4[this.data.notice_index].title : this.data.notice_detail.title)
    }
    console.log(path)
    return {
      title: title,
      path: path
    }
  }

})