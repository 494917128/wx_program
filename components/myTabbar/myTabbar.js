Component({
  properties: {
    tabbar_index: Number,
  },

  data: {
    tabbar_list:[
      { icon: 'icon-home', text: '返回首页', url: '/pages/program/index/index' },
      { icon: 'icon-xiaoxi', text: '关于我们', url: '/pages/program/aboutUs/aboutUs' },
      { icon: 'icon-chanpin', text: '产品介绍', url: "/pages/program/product/product" },
      { icon: 'icon-xinwen', text: '公司通告', url: '/pages/program/notice/notice' },
      { icon: "icon-qianmishangxueyuan-", text: "商学院", url: "/pages/program/moments/moments" },
      // { icon: 'icon-iconset0336', text: '我要加盟', url: '/pages/program/join/join' },
    ]
  },

  methods: {
    navigaion(e){
      var index = e.currentTarget.dataset.index;
      // 已选中的点击无效
      if(index==this.data.tabbar_index)
        return
      var list = this.data.tabbar_list
      var url = list[index].url
      wx.redirectTo({
        url: url,
      })
    }
  },
  ready () {

  }
})
