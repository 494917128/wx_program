const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    image_url: app.image_url,
    user_id: '',
    class: {},
    nav_list: ['课程介绍','听课列表'],
    nav_index: 0,
  },
  // nav导航
  navbar(e) {
    var index = e.detail.currentTarget.dataset.index
    this.setData({
      nav_index: index,
    })
  },
  pageData() {
    var _this = this
    this.ajax = util.request2({
      url: 'v1/teaching/get-teaching-type-details',
      method: 'post',
      type: 'form',
      data: {
        type_id: this.data.type_id,
      },
      success(res) {
        if (res.data.state == 1) {
          var list = res.data.data.type_list
          
          res.data.data.type_desc = res.data.data.type_desc.replace(/\<img/gi, '<img class="rich-img" ');
          _this.setData({ class: res.data.data })
          wx.setNavigationBarTitle({
            title: res.data.data.type_title
          })
          // 开发中设置
          if (!res.data.data.is_open.state) {
            wx.showModal({
              title: '提示',
              content: res.data.data.is_open.error || '课程开发中，敬请期待',
              showCancel: false,
              complete() {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
        } else {
          setTimeout(()=>{
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      is_admin: app.globalData.is_admin,
    })
    var user_id = wx.getStorageSync('userId')
    if (user_id) {
      this.setData({
        user_id: user_id,
        type_id: options.type_id
      })
      util.requestIndex(this, app.globalData.show_user)
    } else { // 没有就要重新登录
      wx.navigateTo({
        url: '/pages/login/agent/agent?again=1',
      })
    }
    //  else {
    //   // 开发中设置
    //   wx.showModal({
    //     title: '提示',
    //     content: '课程开发中，敬请期待',
    //     showCancel: false,
    //     complete() {
    //       wx.navigateBack({
    //         delta: 1,
    //       })
    //     }
    //   })

    //   // wx.showModal({
    //   //   title: '提示',
    //   //   content: '请先登录',
    //   //   showCancel: false,
    //   //   complete() {
    //   //     wx.navigateTo({
    //   //       url: '/pages/login/agent/agent',
    //   //     })
    //   //   }
    //   // })
    // }
    this.setData({
      class: options
    })
    if (options.type_title) {
      wx.setNavigationBarTitle({
        title: options.type_title
      })
    }
  },
  onShow(){
    if (this.data.user_id && this.data.type_id) {
      this.pageData()      
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.class.type_title,
      path: 'pages/program/classDetail/classDetail?type_id='+(this.data.type_id||'')
    }
  }
})