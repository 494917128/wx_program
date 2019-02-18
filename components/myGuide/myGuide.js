const app = getApp()
import util from "../../utils/util.js";
Component({
  properties: {
    guide: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        console.log(app.globalData.mini_float)
        this.setData({
          guide_img: app.globalData.mini_float.img || '',
          url: app.globalData.mini_float.url || ''
        })
      }
    },
  },

  data: {
    guide_img: '',
    url: '',
  },

  methods: {
    guideClose() {
      this.setData({
        guide: false
      })
    },
    stop(){},
  },
  ready () {
  }
})
