const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
    user_id: '',
    tabbar_list: [
      { icon: 'icon-yuyin', text: '语音', bindtap: 'record' },
      { icon: 'icon-xuanwenben', text: '文字', bindtap: 'text' },
      { icon: 'icon-tupian', text: '图片', bindtap: 'image' },
      { icon: 'icon-shezhi1', text: '设置', bindtap: 'setting' },
    ],
    tabbar_index: -1, 
    text_value: '',
    info: {},
    list: [],
    code_img: '',
    code_show: false,
  },
  tabbarIndex(index) {
    this.setData({
      tabbar_index: index
    })
  },
  uploadFile(tempFilePath, type) {
    wx.showLoading({
      title: '发送中...',
      mask: true
    })
    var _this = this
    util.upload({
      url: 'mini_teach_log',
      tempFilePath: tempFilePath,
      callback: function (data) {
        wx.hideLoading()
        _this.logAdd(data.url, type)
      }
    })
  },
  logAdd(content, type){

    var _this = this
    util.request({
      url: 'mini-teaching/log-add',
      method: 'post',
      type: 'form',
      data: {
        user_id: this.data.user_id,
        teach_id: this.data.teach_id,
        content: content,
        teach_time: this.data.recorde_time||'',
        type: type,
      },
      success(res) {
        console.log(res.data)
        var list = _this.data.list
        if(res.data.state == 1){
          list.push(res.data.teach_log)
          _this.setData({
            list: list,
            recorde: '', // 语音重置
            recorde_time: 0,
            text_value: '', // 文字重置
          })
          setTimeout(()=>{
            _this.setData({ start: 'start', }) // 滚动重置
          },100)
          wx.showToast({
            title: res.data.data,
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
          })
        }
      },
      fail(){
        wx.showToast({
          title: '发送失败',
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  // 开始听请求接口
  addLog(index){
    var _this = this
    util.request({
      url: 'mini-teaching/add-log',
      method: 'post',
      type: 'form',
      data: {
        user_id: this.data.user_id,
        teach_id: this.data.teach_id,
        log_id: this.data.list[index].log_id
      },
      success(res) {
        if (res.data.state == 1) {
          _this.setData({
            played_id: res.data.id
          })
        }
      },
    })
  },
  // 听完该条请求接口
  upLog(index) {
    var _this = this
    util.request({
      url: 'mini-teaching/up-log',
      method: 'post',
      type: 'form',
      data: {
        id: this.data.played_id,
        // user_id: this.data.user_id,
        // teach_id: this.data.teach_id,
        // log_id: this.data.list[index].log_id
      },
      success(res) {
        if (res.data.state == 1) {
          _this.setData({
            ['list[' + index + '].is_listen']: 1
          })
        }
      }
    })
  },
  // 撤回
  logDeleteModal(e){
    var _this = this
    wx.showModal({
      title: '提示',
      content: '是否撤回该条信息？',
      success(res){
        if (res.confirm) {
          _this.logDelete(e)
        }
      },
    })
  },
  logDelete(e){
    var _this = this,
      id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index
    util.request({
      url: 'mini-teaching/delete',
      method: 'post',
      type: 'form',
      data: {
        log_id: id,
      },
      success(res) {
        if(res.data.state==1){
          var list = _this.data.list
          list.splice(index, 1)
          wx.showToast({
            title: '已撤回',
            icon: 'none',
          })
          _this.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
          })
        }
      }
    })
  },
  // 移动
  logMove(e) {
    var index = e.currentTarget.dataset.index
    if (index === 0) index = '0'
    this.setData({
      move_index: index,
    })
  },
  // 移动到某个位置
  logMoveAfter(e){
    var _this = this,
      list = this.data.list,
      move_index = this.data.move_index,
      index = e.currentTarget.dataset.index + 1,
      param = index - move_index

    if (move_index < index) {
      index = index - 1
    }

    util.request({
      url: 'mini-teaching/sort',
      method: 'post',
      type: 'form',
      data: {
        log_id: list[move_index].log_id,
        teach_id: this.data.teach_id,
        num: index - move_index,
      },
      success(res) {
        if (res.data.state == 1) {
          var move_list = list.splice(move_index, 1)[0];
          list.splice(index, 0, move_list);
          _this.setData({
            list: list
          })
          _this.logMoveReset()
        }
        wx.showToast({
          title: res.data.data,
          icon: 'none'
        })
      }
    })
  },
  // 取消移动
  logMoveReset(e) {
    this.setData({
      move_index: '',
    })
  },
  navNone(){
    this.tabbarIndex(-1)    
  },
  /********** 录音 ***********/
  record(e) { 
    var index = e.currentTarget.dataset.index
    this.tabbarIndex(index)
  },
  // 录音组件
  setRecorderManager(){
    var _this = this
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onStart(() => {
      console.log('开始录音')
    })
    this.recorderManager.onStop((res) => {
      console.log('结束录音', res)
      const { tempFilePath } = res
      _this.setData({ record_file: tempFilePath })
      _this.setInnerAudioContext(tempFilePath)
    })
    this.recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
  },
  // 音频组件
  setInnerAudioContext(tempFilePath) {
    var _this = this
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.autoplay = false
    this.innerAudioContext.src = tempFilePath
    this.innerAudioContext.onPlay(() => {
      console.log('开始试听')
      _this.setData({
        audio_play: true,
      })
    })
    this.innerAudioContext.onStop(() => {
      console.log('结束试听')
      _this.setData({
        audio_play: false,
      })
    })
    this.innerAudioContext.onEnded(() => {
      console.log('结束试听')
      _this.setData({
        audio_play: false,
      })
    })
    console.log(this.innerAudioContext)
  },
  // 开始录音
  recordeStart(){
    var _this = this
    this.setRecorderManager()
    this.recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    })
    this.setData({
      recorde: 'play',
      recorde_time: 0,
    })
    this.recordeInterval = setInterval(()=>{
      if (_this.data.recorde_time < 60) {
        this.setData({
          recorde_time: _this.data.recorde_time + 1
        })
      } else {
        _this.recordeStop()
        clearInterval(_this.recordeInterval)
      }
    },1000)
  },
  // 停止录音
  recordeStop(){
    if (this.data.recorde_time < 3) {
      wx.showToast({
        title: '录音时间太短',
        icon: 'none'
      })
    } else {
      this.recorderManager.stop() // 停止录音
      clearInterval(this.recordeInterval) // 结束轮询
      this.setData({
        recorde: 'stop'
      })
    }
  },
  // 试听
  recordeListen () {
    this.innerAudioContext.play()
  },
  // 结束试听
  recordeListenStop(){
    this.innerAudioContext.stop()
  },
  // 重录
  recordeReset (){
    var _this = this
    wx.showModal({
      title: '提示',
      content: '是否重新录制？',
      success(){
        _this.setData({
          recorde: '',
          recorde_time: 0,
        })
      }
    })
  },
  // 发送
  recordeSend(){
    console.log('发送音频：' + this.data.record_file)
    this.uploadFile(this.data.record_file, 1)
  },
  /********** 输入文字 ***********/
  text(e) { 
    var index = e.currentTarget.dataset.index
    this.tabbarIndex(index)
  },
  textValue(e){
    this.setData({
      text_value: e.detail.value
    })
  },
  textSend(){
    if (this.data.text_value) {
      wx.showLoading({
        title: '发送中...',
        mask: true        
      })
      this.logAdd(this.data.text_value, 2)
    }

  },
  /********** 发送图片 ***********/
  image(e) { 
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        _this.uploadFile(tempFilePath, 3)
        setTimeout(() => {
          _this.setData({ start: 'start', }) // 滚动重置
        }, 100)
      }
    })
  },
  /********** 设置课程 ***********/
  setting() { 
    var info = this.data.info
    wx.navigateTo({
      url: '/pages/program/classAdd/classAdd?teach_id=' + this.data.teach_id + '&name_detail=' + info.name_detail + '&teach_desc=' + info.teach_desc + '&teach_img=' + info.teach_img + '&teach_name=' + info.teach_name + '&teach_title=' + info.teach_title,
    })
  },
  /********** 课程列表 ***********/
  pageData(){
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    this.ajax = util.request2({
      url: 'v1/teaching/get-teaching-desc',
      method: 'post',
      type: 'form',
      data: {
        teach_id: this.data.teach_id,
      },
      success(res) {
        wx.hideLoading()
        if (res.data.state == 1) {
          var list = res.data.data.list
          var start = ''
          console.log(res.data)
          // res.data.data.poster_img=''
          wx.setNavigationBarTitle({
            title: res.data.data.teach_title
          })
          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].is_listen == 1) {
              start = 'audio_' + list[i].log_id
            }
          }
          var info = res.data.data
          info.list = ''
          _this.setData({
            info: info,
            list: list,
          })
          setTimeout(() => {
            _this.setData({ start: start, })
          }, 100)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
            complete(){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
      }
    })
  },
  // 获取图片宽高
  imageLoad(e) {
    var index = e.currentTarget.dataset.index

    var width = e.detail.width,    //获取图片真实宽度  
      height = e.detail.height,
      ratio = width / height;      //图片的真实宽高比例  

    // 根据宽高比来定实际图片大小
    if (ratio > 1) {
      var viewWidth = 240,
        viewHeight = 240 / ratio;
    } else {
      var viewHeight = 240,
        viewWidth = 240 * ratio;
    }

    // 宽高最低276rpx
    viewWidth = viewWidth < 130 ? 130 : viewWidth
    viewHeight = viewHeight < 130 ? 130 : viewHeight

    this.setData({
      ['list[' + index + '].imgwidth']: viewWidth,
      ['list[' + index + '].imgheight']: viewHeight
    })
  },
  // 图片预览
  previewImage(e){
    var image = e.currentTarget.dataset.image
    var urls = []
    for (var i = 0, len = this.data.list.length; i < len; i++) {
      if (this.data.list[i].type==3){
        urls.push(app.image_url + this.data.list[i].content + '?x-oss-process=style/shuiyin')
      }
    }
    wx.previewImage({
      current: app.image_url + image + '?x-oss-process=style/shuiyin',
      urls: urls,
    })
  },
  // 播放音频
  audioPlay: function(e){
    var index = e.currentTarget.dataset.index
    var _this = this

    if (this.classAudio) { // 停止播放的那条
      this.classAudio.stop()
      if (this.classAudio.src != this.data.image_url + this.data.list[index].content){ // 如果点击的是另一条，播放点击的那条
        setTimeout(() => { _this.ceartAudio(index) }, 100)
      }
    } else { // 播放点击的那条
      this.ceartAudio(index)
    }

  },
  ceartAudio(index){
    this.setData({
      ['list[' + index + '].played']: 'loading'
    })
    var _this = this
    var list = this.data.list
    var content = list[index].content
    this.classAudio = wx.createInnerAudioContext()
    this.classAudio.autoplay = true
    this.classAudio.src = this.data.image_url + content
    this.classAudio.onPlay(() => {
      wx.hideLoading()
      _this.addLog(index)
      console.log('开始播放')
      _this.setData({
        ['list[' + index + '].played']: true
      })
    })
    this.classAudio.onEnded(() => {
      _this.upLog(index)
      _this.classAudio.destroy()
      // _this.classAudio = '' // 自然播放不赋空，为了防止播放结束时，又点一条导致两条一起
      console.log('结束播放:自然')
      _this.setData({
        ['list[' + index + '].played']: false,
        slider: 0,
      })
      for (var i = 0, len = list.length; i < len; i++) { // 播放下一条
        if (index < i && list[i].type == 1) {
          setTimeout(() => {
            _this.setData({ start: 'audio_' + list[i].log_id})
          }, 100)
          
          _this.ceartAudio(i)
          return;
        }
      }
    })
    this.classAudio.onStop(() => {
      _this.classAudio.destroy()
      console.log('结束播放：stop')
      _this.setData({
        ['list[' + index + '].played']: false,
        slider: 0,
      })
      _this.classAudio = ''      
    })
    this.classAudio.onTimeUpdate(() => {
      var slider = _this.classAudio.currentTime / _this.data.list[index].teach_time * 100
      _this.setData({
        slider: parseInt(slider)
      })
    })
    this.classAudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  // 加载二维码
  saveImage(path) {
    var _this = this
    util.authorize('scope.writePhotosAlbum', function () {
      util.saveImage({
        _this: _this,
        url: path,
        callback(res) {
          wx.hideLoading()
          wx.showToast({ title: '保存完成' })
        },
        callbackFail() {
          _this.saveFail()
        }
      })
    }, _this)
  },
  // 保存失败
  saveFail() {
    wx.hideLoading()
    wx.showToast({
      icon: 'none',
      title: '二维码保存失败',
    })
  },

  fail() {
    wx.hideLoading()
    wx.showToast({
      icon: 'none',
      title: '二维码生成失败',
    })
  },
  requestCode() {
    var _this = this
    wx.showLoading({ title: '二维码生成中...' })
    util.request({
      url: 'qrcode/mini-code',
      type: 'form',
      method: 'post',
      data: {
        appid: app.AppID,
        secret: app.AppSecret,
        scene: this.data.teach_id,
        path: 'pages/program/class/class'
      },
      success(res) {
        if (_this.data.info.mini_img) {
          _this.codeImageInfo(app.image_url + res.data.img, app.image_url + _this.data.info.mini_img)
        } else {
          wx.hideLoading()
          _this.setData({ code_img: res.data.img })
        }
      },
      fail() { _this.fail() }
    })
  },
  // 获取二维码的本地地址
  codeImageInfo(codeimgurl, headimgurl) {
    var _this = this
    wx.getImageInfo({
      src: codeimgurl,
      success(res) {
        _this.headImageInfo(res.path, headimgurl)
      },
      fail() { _this.fail() }
    })
  },
  // 获取背景的本地地址
  headImageInfo(codeimgurl, headimgurl) {
    var _this = this
    wx.getImageInfo({
      src: headimgurl,
      success(res) {
        // _this.drawCanvas(codeimgurl, res.path, 'codeId', 1)
        _this.drawCanvas(codeimgurl, res.path, 'hiddenId', 2)
      },
      fail() { _this.fail(); console.log(1) }
    })
  },
  // 画canvas
  drawCanvas(codeimgurl, headimgurl, canvasId, mulriple) {
    var ctx = wx.createCanvasContext(canvasId),
      _this = this
    ctx.drawImage(headimgurl, 0, 0, 451 * mulriple, 802 * mulriple)
    ctx.drawImage(codeimgurl, this.data.info.x_axis * mulriple, this.data.info.y_axis * mulriple, 158 * mulriple, 158 * mulriple)

    ctx.draw(false,function(){
      _this.saveCanvas()
    })
    wx.hideLoading()
  },
  saveCanvas() {
    var _this = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'hiddenId',
      quality: 1,
      success: function (res) {
        _this.setData({
          canvas_img: res.tempFilePath,
        })
        // 回传二维码，以后不用生成
        util.upload({
          url: 'class_code',
          tempFilePath: res.tempFilePath,
          showLoading: false,
          callback(data) { 
            util.request2({
              url: 'v1/teaching/add-poster-img',
              method: 'post',
              type: 'form',
              data: {
                teach_id: _this.data.teach_id,
                poster_img: data.url
              },
              success(res) {}
            })
          }
        })
      },
      fail() { _this.saveFail() }
    })
  },

  // 二维码显示
  code() {
    if (!this.data.canvas_img && !this.data.info.poster_img) { this.requestCode() }
    this.setData({
      code_show: true
    })
  },
  codeConfirm() {
    var _this = this
    wx.showLoading({ title: '保存中...' })
    if (this.data.canvas_img) {
      _this.saveImage(this.data.canvas_img)
    } else {
      wx.getImageInfo({
        src: app.image_url + this.data.info.poster_img,
        success: function (res) {
          _this.saveImage(res.path)
        },
        fail: function (res) {
          _this.saveFail()
        },
      })
    }
  },
  onLoad: function (options) {
    var user_id = wx.getStorageSync('userId')
    if (user_id) {
      this.setData({
        user_id: user_id,
      })
    } 
    // else { // 没有就要重新登录
    //   wx.navigateTo({
    //     url: '/pages/login/agent/agent?again=1',
    //   })
    // }
    // 必须要teach_id
    if (options.scene){ options.teach_id = options.scene }
    if (options.teach_id){
      this.setData({
        teach_id: options.teach_id,
        is_open_class: options.is_open_class||0        
      })
      this.pageData()
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  onShow(){
    if (this.data.info.teach_title) {
      wx.setNavigationBarTitle({
        title: this.data.info.teach_title
      })
    }
  },
  onHide(){
    if (this.classAudio) {
      this.classAudio.stop()
    }
    if (this.recorderManager) {
      this.recorderManager.stop() // 停止录音
      clearInterval(this.recordeInterval) // 结束轮询
      this.setData({
        recorde: 'stop'
      })
    }
    if (this.innerAudioContext) {
      this.recordeListenStop()
    }
  },
  onUnload(){
    this.ajax && this.ajax.abort()
    if (this.classAudio) {
      this.classAudio.stop()
    }
    if (this.recorderManager && this.data.recorde == 'play') { // 录音中息屏或来电话（暂停录音）
      this.recorderManager.stop() // 停止录音
      clearInterval(this.recordeInterval) // 结束轮询
      this.setData({
        recorde: 'stop'
      })
    }
    if (this.innerAudioContext) {
      this.recordeListenStop()
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.info.teach_title,
      path: 'pages/program/class/class?teach_id=' + (this.data.teach_id || '')
    }
  }
})