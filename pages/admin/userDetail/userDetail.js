
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    user: {},
  },
  pageData() {
    var _this = this

    this.setData({ loading: true })
    this.ajax = util.request2({
      url: 'v1/statistics/user-details',
      type: 'form',
      data: {
        user_id: this.data.user_id,
      },
      success: function (res) {
        res.data.data.reg_time = util.formatTime(new Date(res.data.data.reg_time * 1000), true)
        console.log(res)
        _this.setData({
          user: res.data.data
        })
      }
    })
  },
  onLoad(e) {
    this.setData({
      user_id: e.user_id || '',
    })
    this.pageData()
  },
});
