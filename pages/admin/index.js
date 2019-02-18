const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {
    url: app.url,
    image_url: app.image_url,
    list: [],
    modal_list: [
      { name: 'v1/order/order-list', path: '/pages/admin/order/order' },
      { name: 'v1/statistics/is-region', path: '/pages/admin/region/region' },
      { name: 'v1/statistics/user-count', path: '/pages/admin/userCount/userCount' },
      { name: 'v1/statistics/user-list', path: '/pages/admin/userList/userList' },
      { name: 'v1/nianhui/redeem', path: '/pages/admin/dahuiCode/dahuiCode' },
      { name: 'v1/nianhui/redeem', path: '/pages/admin/group/group' },
    ]
  },
  // 请求数据
  pageData() {
    var _this = this,
      modal_list = this.data.modal_list
    util.request2({
      url: 'v1/application/application-list',
      type: 'form',
      success: function (res) {
        var list = res.data.data
        list.map((item,index)=>{
          item.list.map((item,idx)=>{
            for (var i = 0, len = modal_list.length; i < len; i++) {
              if (list[index].list[idx].model == modal_list[i].name) {
                list[index].list[idx].path = modal_list[i].path+'?para='+item.para+'&title='+item.name
              }
            }
          })
        })
        console.log(list)
        _this.setData({
          list: list
        })
      }
    })
  },
  onShow(){
    var _this = this
    wx.getUserInfo({
      success: function (res) {
        _this.setData({
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },
  onLoad: function (e) {

    // 没token就登录
    var user_id = wx.getStorageSync('userId')
    if (user_id) {
      this.setData({
        user_id: user_id
      })
    } else { // 没有就要重新登录
      wx.navigateTo({
        url: '/pages/login/agent/agent?again=1',
      })
    }

    util.tokenReset(
      this.pageData
    )
  },

})