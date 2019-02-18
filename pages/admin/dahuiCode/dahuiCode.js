
const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    url: app.url,
    image_url: app.image_url,
    image: '',
    title: '请扫码',
    prize_name: '',
    is_status:'',
  },
  redeem_code: '',
  scan(){
    var _this = this
    this.redeem_code = ''
    this.setData({
      image: '',
      title: '请扫码',
      prize_name: '',
      is_status: '',
    })
    wx.scanCode({
      success(res) {
        console.log(res.result)
        _this.redeem_code = res.result
        _this.pageData()
      }
    })
  },
  prizeSure(){
    var _this = this
    util.request2({
      url: 'v1/nianhui/up-redeem-code',
      type: 'form',
      data: {
        redeem_code: this.redeem_code
      },
      success: function (res) {
        _this.redeem_code = '' // 清空二维码
        wx.showToast({
          title: '核销成功',
          icon: 'none',
          mask: true,
        })
        _this.setData({
          is_status: '1',
        })
      }
    })
  },
  pageData(code){
    var _this = this
    util.request2({
      url: 'v1/nianhui/get-redeem-code',
      type: 'form',
      data: {
        redeem_code: this.redeem_code
      },
      success: function (res) {
        _this.setData({
          image: res.data.data.list.image,
          title: '恭喜中奖',
          prize_name: res.data.data.list.prize_name,
          is_status: res.data.data.is_status
        })
      }
    })
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: e.title
    })
    this.setData({
      para: e.para || '',
    })
  },
});
