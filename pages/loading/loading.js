const app = getApp()
import util from "../../utils/util.js";
Page({

  data: {
    is_authorization: false,//判断是否要授权登录
  },
  // 没有unionID的用户获取unionID
  getUserInfo(e){
    // 这里要给后台传encryptedData，iv，userId让后台存UnionID
    // 如果UnionID原本有的话，返回用户的所有信息

    console.log(e.detail.userInfo)
    console.log(e.detail.encryptedData)
    console.log(e.detail.iv)
  },
  loginCallback(res){
    console.log(res)
    if (!res.data.unionid) {
      wx.showModal({
        title: '提示',
        content: '您还未关注“赛蜜网络”公众号，需要您授权登录',
      })
      this.setData({
        is_authorization: true,
      })
    }else{
      // 这里获取用户的所有信息
    }
  },
  // 获取用户所有信息
  userInfo(res){
    if (res.referrer) {// 判断推荐人是否填写，跳转到填写推荐人
      this.setData({
        is_referrer: true
      })
    } else if (res.name) {// 判断基本信息是否填写，跳转到填写推荐人
      this.setData({
        is_info: true
      })
    } else {// 信息都完整，跳转到首页

    }
  },
  onLoad: function (options) {
    var _this = this
  },
})