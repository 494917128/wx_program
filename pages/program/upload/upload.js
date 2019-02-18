const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    image_url: app.image_url,
    images: [],
    case_label: [],
    case_more: false,
  },

  titleInput(e){
    this.setData({
      case_title: e.detail.value
    })
  },
  // 选择视频
  chooseVideo(){
    var _this = this
    if (this.data.video) {
      wx.showToast({
        title: '最多选择1个视频',
        icon: 'none'
      })
    } else {
      wx.chooseVideo({
        sourceType: ['album'],
        compressed: false,
        success: function(res) {
          var tempFilePath = res.tempFilePath
          _this.uploadFile(tempFilePath, true)
          _this.setData({
            images: [],
          })
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {},
      })
    }
  },
  // 选择图片
  chooseImage(){
    var _this = this,
      len = this.data.images.length,
      max_len = this.data.type == 'friends' ? 9 : 2
    if (len >= max_len) {
      wx.showToast({
        title: '最多选择' + max_len + '张图片',
        icon: 'none'
      })
    } else {
      wx.chooseImage({
        count: max_len - len,
        success: function (res) {
          var tempFilePaths = res.tempFilePaths
          tempFilePaths.map((item, index) => {
            _this.setData({
              video: '',
            })
            _this.uploadFile(item)
          })
        }
      })
    }
  },
  uploadFile(tempFilePath, isVideo){
    var _this = this,
      file_address = this.data.type == 'friends' ? 'activity1' : 'case'
    util.upload({
      url: file_address,
      tempFilePath: tempFilePath,
      callback(data){
        if (isVideo){ // 判断传的是否是视频
          _this.setData({
            video: data.url
          })
        } else { 
          var image = data.url,
            images = _this.data.images
          images.push(image)
          _this.setData({
            images: images
          })
        }
      }
    })
  },
  previewImage(e) {
    var _this = this,
      image = e.currentTarget.dataset.image,
      images = e.currentTarget.dataset.images
    var url = app.image_url
    var urls = []
    for (var i = 0, len = images.length; i < len; i++) {
      urls.push(url + images[i])
    }
    wx.previewImage({
      current: url + image, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  submit () {
    var case_label = [],
      picker_id = this.data.picker_id,
      url = this.data.type == 'friends' ? 'v1/material/add-material' : 'case/add',
      data = {}

    if (this.data.type == 'friends') {
      if (!picker_id) {
        wx.showToast({
          title: '请选择标签',
          icon: 'none'
        })
        return;
      }
      data = {
        material_desc: this.data.case_title || '',
        'material_img[]': this.data.images,
        material_video: this.data.video||'',
        material_type: this.data.video ? 3 : 1,
        classify: this.data.picker_id,
      }
      util.request2({
        url: url,
        method: 'post',
        type: 'form',
        data: data,
        success(res) {
          wx.showToast({
            title: res.data.message || '上传成功',
            icon: 'none'
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.onPullDownRefresh() // 刷新上一个页面

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
    } else {
      this.data.case_label.map((item,index)=>{
        if(item.select){
          case_label.push(item.id)
        }
      })
      case_label.join(',')
      if (!case_label){
        wx.showToast({
          title: '请选择标签',
          icon: 'none'
        })
        return;
      }
      if (!this.data.images.length) {
        wx.showToast({
          title: '请选择图片',
          icon: 'none'
        })
        return;
      }
      data = {
        case_title: this.data.case_title || '',
        case_label: case_label,
        'case_img[]': this.data.images,
        user_id: this.data.user_id,
      }
      util.request({
        url: url,
        method: 'post',
        type: 'form',
        data: data,
        success (res) {
          wx.showToast({
            title: res.data.data,
            icon: 'none'          
          })
          if (res.data.state == 1) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.onPullDownRefresh() // 刷新上一个页面

            setTimeout(()=>{
              wx.navigateBack()
            },1500)
          }
        }
      })
    }
  },
  // 客户案例的标签选择
  chooseLabel(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      ['case_label[' + index + '].select']: !this.data.case_label[index].select
    })
  },
  // 朋友圈素材的标签选择
  chooseType(e){
    var value = e.detail.value,
      type_list = this.data.type_list,
      picker_name = [],
      picker_id = []
    type_list.map((item,index)=>{
      picker_name.push(item[value[index]].classify_name)
      picker_id.push(item[value[index]].classify_id)
    })
    this.setData({
      picker_name,
      picker_id
    })
  },
  caseMore() {
    this.setData({
      case_more: !this.data.case_more
    })
  },
  onLoad: function (options) {
    var user_id = wx.getStorageSync('userId')
    util.requestIndex(this, app.globalData.show_user, true)
    if (options.type) {
      this.setData({ type: options.type })
    }
    if (app.globalData.type_list) { // 上传朋友圈素材的标签
      var type_list = app.globalData.type_list,
        list = []
      type_list.map((item,index)=>{
        list.push(item.classify_list)
      })
      this.setData({
        type_list: list
      })
    }
    if (user_id) {
      this.setData({
        user_id: user_id
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '先登录再上传',
        showCancel: false,
        complete(){
          wx.navigateTo({
            url: '/pages/login/agent/agent',
          })
        }
      })
    }
  },

})