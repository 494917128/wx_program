Component({
  relations: {

  },
  properties: {
    show: Boolean,
    title: String,
    confirm_text: String,
    cancel_text: String,
    no_cancel: Boolean,
  },

  data: {

  },

  methods: {
    confirm: function () {
      this.cover()
      this.triggerEvent('confirm')
    },
    cancel: function () {
      this.cover()
      this.triggerEvent('cancel')
    },
    // 阻止冒泡
    stop(){},
    cover(){
      var _this = this
      this.setData({
        show: false
      })
    },
  },
  ready() {

  }
})
