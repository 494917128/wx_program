const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
    user_id: '',
    nav_list: [
      [{
        name: 'group_name',
        title: '名称',
        text: '',
        type: 'text',
      }, {
        name: 'group_images',
        text: '',
        title: '上传二维码',
        bindtap: 'setHeader',
        right: true
      }],
      [{
        name: 'group_number',
        title: '起始人数',
        text: '',
        type: 'text',
      }, {
        name: 'group_max',
        title: '最大人数',
        text: '',
        type: 'text',
      }]
    ],
    modal_name: '',
    modal_title: '',
    modal_text: '',
    modal_show: false,
  },
  // 上传二维码
  setHeader(e) {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        _this.uploadFile(tempFilePath)
      }
    })
  },
  uploadFile(tempFilePath) {
    wx.showLoading({
      title: '二维码上传中...',
    })
    var _this = this
    util.upload({
      url: 'mini_teach',
      tempFilePath: tempFilePath,
      callback: function (data) {
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
        })
        _this.dataUpdate('group_images', data.url)
      }
    })
  },

  // 修改信息
  bindInput(e) {
    var value = e.detail.value,
      type = e.currentTarget.dataset.type
    this.dataUpdate(type, value)

  },

  // 更新原有数据
  dataUpdate(name, value) {
    var _this = this
    this.data.nav_list.map((item, index) => {
      item.map((item, idx) => {
        if (item.name == name) {
          _this.setData({
            ['nav_list[' + index + '][' + idx + '].text']: value
          })
        }
      })
    })
  },
  submit() {
    var data = {}
    this.data.nav_list.map((item, index) => {
      item.map((item, idx) => {
        data[item.name] = item.text
      })
    })

    if (data.group_number > data.group_max){
      wx.showToast({ title: '起始人数不能超过最大人数', icon: 'none' })
      return;
    }
    this.teachAdd(data)
  },

  teachAdd(data) {
    var _this = this
    util.request2({
      url: 'v1/group-code/add',
      method: 'post',
      type: 'form',
      data: data,
      success(res) {
        if (res.data.state == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.data||'添加成功',
            showCancel: false,
            complete() {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.onPullDownRefresh()
              wx.navigateBack({ delta: 1 })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
          })
        }
      }
    })
  },
  onLoad: function (options) {
    util.requestIndex(this, app.globalData.show_user)
    var nav = this.data.nav_list
    nav.map((item, index) => {
      for (var i = 0, len = item.length; i < len; i++) {
        for (var key in options) {
          if (key == item[i].name) {
            nav[index][i].text = options[key]
          }
        }
      }
    })
    this.setData({
      nav_list: nav,
      teach_id: options.teach_id || '', // 修改课程
      type_id: options.type_id || '', // 创建课程
    })
    var user_id = wx.getStorageSync('userId')
    if (user_id) {
      this.setData({
        user_id: user_id
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        complete() {
          wx.navigateTo({
            url: '/pages/login/agent/agent',
          })
        }
      })
    }
  }
})