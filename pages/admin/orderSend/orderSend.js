const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    shipping_list: [],
    shipping_index: 0,
    repertory_list: [],
    repertory_index: 0,
    invoice_no: '',
    freight: '',
    action_note: '',
    images: [],
    images_max: 9,
  },
  bindPickerChange0: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      repertory_index: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      shipping_index: e.detail.value
    })
  },
  freightInput(e){
    var value = e.detail.value
    this.setData({ freight: value })
  },
  logisticsInput(e) {
    var value = e.detail.value
    this.setData({ invoice_no: value })
  },
  scan() {
    var _this = this
    wx.scanCode({
      success(res) {
        console.log(res)
        _this.setData({ invoice_no: res.result })
      }
    })
  },
  remarkInput(e) {
    var value = e.detail.value
    this.setData({ action_note: value })
  },
  chooseImage: function(){
    var _this = this,
      max = this.data.images_max - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        tempFilePaths.map((item,index)=>{
          _this.uploadFile(item)
        })
      }
    })
  },
  changeImage(e){
    var _this = this,
      index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        util.upload({
          url: 'factory',
          tempFilePath: res.tempFilePaths[0],
          callback(data) {

            _this.setData({
              ['images[' + index + ']']: data.url
            })

          }
        })
      }
    })
  },
  uploadFile(tempFilePath) {
    var _this = this,
      file_address = 'factory',
      images = this.data.images
    util.upload({
      url: file_address,
      tempFilePath: tempFilePath,
      callback(data) {

        images.push(data.url)

        _this.setData({
          images: images
        })

      }
    })
  },

  submit() {
    var _this = this,
      data = {
        order_id: this.data.id || '',
        invoice_no: this.data.invoice_no,
        freight_fee: this.data.freight,
        shipping_id: this.data.shipping_list[this.data.shipping_index].id,
        factory_img: this.data.images || '',
        action_note: this.data.action_note,
      }
    if (!this.data.repertory_id) {
      data.repertory_id = this.data.repertory_list[this.data.repertory_index].id
    }
    this.ajax = util.request2({
      url: 'v1/order/order-status',
      type: 'form',
      data: data,
      success: function (res) {
        wx.showToast({
          title: '发货成功',
          icon: 'none'
        })
        setTimeout(()=>{
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          if (prevPage.onPullDownRefresh){
            prevPage.onPullDownRefresh()
          } else {
            prevPage.pageData && prevPage.pageData()
          }
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }
    })
  },
  // 请求数据
  pageData() {
    var _this = this
    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/order/get-order-details',
      type: 'form',
      data: {
        order_id: _this.data.id||'',
      },
      success: function (res) {
        var shipping = res.data.data.shipping_list,
          shipping_list = [],
          shipping_index = 0,
          i = 0,
          repertory = res.data.data.repertory_list,
          repertory_list = [],
          repertory_index = 0
        for (var key in repertory) {
          repertory_list.push({ id: key, value: repertory[key] })
        }
        for (var key in shipping) {
          if (res.data.data.details.shipping_id == key) { shipping_index = i }
          shipping_list.push({id: key, value: shipping[key]})
          i++
        }
        _this.setData({
          shipping_list: shipping_list,
          shipping_index: shipping_index,
          repertory_list: repertory_list,
          repertory_index: repertory_index,
          repertory_id: res.data.data.details.repertory_id
        })
      }
    })

  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.pageData()
  },

})