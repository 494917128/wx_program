import * as echarts from '../../../components/ec-canvas/echarts.simple.min';

const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    province_array: [{ name: '请选择', type: '0' }],
    city_array: [{ name: '请选择', type: '0' }],
    area_array: [{ name: '请选择', type: '0' }],
    province_index: 0,
    city_index: 0,
    area_index: 0,
    list: [],

  },
  bindPickerChange: function (e) {
    var value = e.detail.value,
      type = e.currentTarget.dataset.type,
      id = this.data[type+'_array'][value].type
    this.setData({
      [type+'_index']: value
    })
    this.getRegion(id, type)
  },
  search(){
    var _this = this
    var province_id = this.data.province_array[this.data.province_index].type
    var city_id = this.data.city_array[this.data.city_index].type
    var area_id = this.data.area_array[this.data.area_index].type
    var region_id = (area_id == 0 ? '' : area_id) || (city_id == 0 ? '' : city_id) || (province_id == 0 ? '' : province_id)

    this.setData({ list: [] })
    util.request2({
      url: 'v1/statistics/is-region',
      type: 'form',
      data: {
        region_id: region_id,
      },
      success: function (res) {
        var data = res.data.data

        _this.setData({
          data: data
        })
        console.log(data)
      }
    })
  },
  getRegion(region_id, type){
    var _this = this

    if (type == 'area') { return }
    util.request2({
      url: 'v1/statistics/get-region',
      type: 'form',
      data: {
        region_id: region_id,
      },
      success: function (res) {
        var data = res.data.data,
          list = []
        for (var key in data) {
          list.push({
            name: data[key],
            type: key,
          })
        }

        if (region_id == 0) { list = [{ name: '请选择', type: '0' }] }
        if (type == 'province') {
          _this.setData({ 
            city_array: list, 
            city_index: 0,
            area_array: [{ name: '请选择', type: '0' }], 
            area_index: 0,            
          })
        } else if (type == 'city') {
          _this.setData({ 
            area_array: list, 
            area_index: 0
          })
        } else {
          _this.setData({ 
            province_array: list, 
            province_index: 0,
            city_array: [{ name: '请选择', type: '0' }], 
            city_index: 0,
            area_array: [{ name: '请选择', type: '0' }], 
            area_index: 0
          })
        }
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
    this.getRegion(1)
  },
});
