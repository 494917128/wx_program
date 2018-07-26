const app = getApp()
import util from "../../../utils/util.js";
Page({

  data: {
    nav_list: [
      [{
        name: 'headimgurl',
        image: '/images/image_none.png',
        title: '头像',
      }, {
        name: 'real_name',
        title: '真实姓名',
        text: '姓名',
      }, {
        name: 'user_name',
        title: '用户名',
        text: 'SM123456',
      }, {
          name: 'nickname',
        title: '昵称',
        text: '昵称',
        bindtap: 'updateName',
        right: true
      }, {
        name: 'sex',
        title: '性别',
        text: '男',
        bindtap: 'updateSex',
        right: true
      }, {
        name: 'birthday',
        title: '出身年月',
        text: '1996-08-07',
        bindchange: 'birthday'
      }],
      [{
        url: '/pages/agent/addressList/addressList',
        title: '管理收货地址',
        right: true
      }],
      [{
        title: '账户安全',
        text: '绑定手机、修改密码',
        bindtap: 'gotoSystem',
        right: true
      }],
    ],
    nickname: '昵称',
    modal_show: false,
  },
  // 修改昵称
  updateName(){
    this.setData({
      modal_show: true
    })
  },
  // 昵称输入框
  modalInput(e){
    this.setData({
      nickname: e.detail.value
    })
  },
  confirm() {
    this.dataUpdate("nickname", this.data.nickname)
  },
  // 更新原有数据
  dataUpdate(name,value){
    var _this = this
    this.data.nav_list[0].map((item, index) => {
      if (item.name == name) {
        var data = {}
        if (name == 'headimgurl')
          var key = 'nav_list[0][' + index + '].image'
        else
          var key = 'nav_list[0][' + index + '].text'
        data[key] = value
        _this.setData(data)
      }
    })
  },
  // 修改性别
  updateSex(){
    var _this = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        _this.dataUpdate("sex", res.tapIndex===0?'男':'女')
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 出身年月
  birthday(e){
    console.log(e.detail.value)
    this.dataUpdate("birthday", e.detail.value)
  },
  // 账户安全，需要前往系统修改
  gotoSystem(){
    wx.showModal({
      title: '提示',
      content: '请前往结算系统',
    })
  },
  onLoad: function (options) {
    util.requestIndex(this)
    this.dataUpdate('headimgurl', this.data.user.headimgurl)
    this.dataUpdate('real_name', this.data.user.real_name)
    this.dataUpdate('user_name', this.data.user.user_name)
    this.dataUpdate('nickname', this.data.user.nickname)
    this.setData({ nickname: this.data.user.nickname})
    this.dataUpdate('sex', this.data.user.sex == 1 ? '男' : '女')
    this.dataUpdate('birthday', this.data.user.birthday)
  }
})