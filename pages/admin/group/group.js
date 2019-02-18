const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    list: [],
    page: 1,
    loading: false,
    modal_index:'',
    modal_show: false,
    modal_type: '',
    input_value: {},
  },
  startNum(e) {
    var index = e.currentTarget.dataset.index,
      value = this.data.list[index].group_number
    this.setData({
      'input_value.group_number': value,
      modal_index: index,
      modal_show: true,
      modal_title: '修改起始人数',
      modal_type: 'group_number',
    })
  },
  maxNum(e) {
    var index = e.currentTarget.dataset.index,
      value = this.data.list[index].group_max
    this.setData({
      'input_value.group_max': value,
      modal_index: index,
      modal_show: true,
      modal_title: '修改最大人数',
      modal_type: 'group_max',
    })
  },
  updateName(e) {
    var index = e.currentTarget.dataset.index,
      value = this.data.list[index].group_name
    this.setData({
      'input_value.group_name': value,
      modal_index: index,
      modal_show: true,
      modal_title: '修改名称',
      modal_type: 'group_name',
    })
  },
  modalInput(e) {
    var type = this.data.modal_type,
      value = e.detail.value
    this.setData({
      ['input_value.'+type]: value
    })
  },
  confirm() {
    var type = this.data.modal_type,
      value = this.data.input_value[type],
      index = this.data.modal_index
    this.update(index, type, value)
  },
  code(e) {
    var index = e.currentTarget.dataset.index,
      url = app.image_url + this.data.list[index].group_images
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  updateCode(e) {
    var _this = this,
      index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        _this.uploadFile(tempFilePath,index)
      }
    })
  },
  uploadFile(tempFilePath,index) {
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
        _this.update(index, 'group_images', data.url)
      }
    })
  },

  update(index, type, value){
    var data = {},
      compare = {},
      _this = this
    data[type] = value
    compare.group_number = this.data.list[index].group_number
    compare.group_max = this.data.list[index].group_max
    compare[type] = value

    if (compare.group_number > compare.group_max) {
      wx.showToast({ title: '起始人数不能超过最大人数', icon: 'none' })
      return;
    }

    data.id = this.data.list[index].group_code_id
    util.request2({
      url: 'v1/group-code/modify',
      type: 'form',
      data: data,
      success: function (res) {
        _this.setData({
          ['list[' + index + '].' + type]: value,
          ['input_value.' + type]: '',
          modal_show: false,
          modal_type: '',
        })
      }
    })
  },
  // 请求数据
  pageData() {
    var _this = this,
      list = this.data.list

    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/group-code/list',
      type: 'form',
      data: { },
      success: function (res) {

        var list = res.data.data

        // if (res.data.data.list.length == 0) {
        //   if (_this.data.page != 1) {
        //     wx.showToast({
        //       icon: 'none',
        //       title: '没有更多了'
        //     })
        //   }
        // } else {
        //   _this.setData({
        //     page: _this.data.page + 1,
        //   })
        // }

        _this.setData({
          list: list,
          loading: false,
        })

      }
    })

  },
  onLoad: function (e) {
    this.pageData()
    wx.setNavigationBarTitle({
      title: e.title
    })
  },
  // 上拉加载
  scrolltolower() {
    console.log('上拉加载')
    if (!this.data.loading) {
      this.ajax.abort()
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