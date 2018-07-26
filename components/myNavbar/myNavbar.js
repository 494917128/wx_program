Component({
  relations: {

  },
  properties: {
    list: Array,
    list_index: Number,
    prompt: Array,
    border_bottom_width: String,
  },

  data: {

  },

  methods: {
    navbar(e){
      this.triggerEvent('_myNavbar',e)
    }
  },
  ready () {

  }
})
