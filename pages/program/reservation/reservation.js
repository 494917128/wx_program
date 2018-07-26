Page({

  data: {
    region: ['北京市', '北京市', '东城区'],
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad: function (options) {
  
  },

})