const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
    user_id: '',
    nav_list: [
      [{
        name: 'teach_title',
        title: '课程主题',
        text: '',
        bindtap: 'update',
        right: true
      }],
      [{
        name: 'teach_img',
        text: '',
        title: '讲师头像',
        bindtap: 'setHeader',
        right: true
      }], 
      [{
        name: 'teach_name',
        title: '主讲人',
        text: '',
        bindtap: 'update',
        right: true
      }, {
        name: 'name_detail',
        title: '主讲人介绍',
        text: '',
        bindtap: 'update',
        right: true
      }, {
        name: 'teach_desc',
        title: '课程概要',
        text: '',
        bindtap: 'update',
        right: true
      }]
    ],
    modal_name: '',
    modal_title: '',
    modal_text: '',
    modal_show: false,
  },
  // 修改头图
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
      title: '头图上传中...',
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
        _this.dataUpdate('teach_img', data.url)
      }
    })
  },

  // 修改信息
  update(e) {
    var name = e.currentTarget.dataset.name,
      title = e.currentTarget.dataset.title,
      text = e.currentTarget.dataset.text
    this.setData({
      modal_name: name,
      modal_title: title,
      modal_text: text,
      modal_show: true
    })
  },
  // 昵称输入框
  modalInput(e) {
    this.setData({
      modal_text: e.detail.value
    })
  },
  confirm() {
    this.dataUpdate(this.data.modal_name, this.data.modal_text)
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
    data.user_id = this.data.user_id
    if (this.data.teach_id){
      data.teach_id = this.data.teach_id
      this.teachUpdate(data)
    } else {
      data.teach_type = this.data.type_id
      this.teachAdd(data)
    }
  },
  teachUpdate(data) {
    var _this = this
    util.request({
      url: 'mini-teaching/update',
      method: 'post',
      type: 'form',
      data: data,
      success(res) {
        console.log(res.data)
        if (res.data.state == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
            complete() {
              // 修改上一页数据并返回
              util.prevPage({
                'info.teach_img': data.teach_img,
                'info.teach_title': data.teach_title,
                'info.teach_name': data.teach_name,
                'info.name_detail': data.name_detail,
                'info.teach_desc': data.teach_desc,
                'info.user_id': data.user_id,
                'info.teach_id': data.teach_id,
              })
            }
          })
        }
      }
    })
  },
  teachAdd(data) {
    var _this = this
    util.request({
      url: 'mini-teaching/add',
      method: 'post',
      type: 'form',
      data: data,
      success(res) {
        console.log(res.data)
        if (res.data.state == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
            complete() {
              wx.redirectTo({
                url: '/pages/program/class/class?teach_id=' + res.data.teach_id + '&is_open_class=' + 1,
              })
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
    nav.map((item,index)=>{
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