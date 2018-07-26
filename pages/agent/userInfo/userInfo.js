const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    url: app.url,
    photo: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI20osBk6neDCzj5HBGg8t0q4s0mb6ibljIDkM9YES1tsf68ob6uJhO15KsxicBIUvTSslBN3wG2Gjg/132'
  },

  onLoad: function (options) {
    var _this = this
    if (options.nickname) { //用户信息
      this.setData({
        user: options
      })
    } else { //领导人信息
      util.request({
        url: 'index.php?r=user/parent-user',
        type: 'form',
        method: 'post',
        data: {
          user_id: app.globalData.agentInfo.user_id
        },
        success: function (res) {
          _this.setData({
            user: res.data.data
          })
        }
      })
    }
  }
})