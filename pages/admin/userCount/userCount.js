import * as echarts from '../../../components/ec-canvas/echarts.simple.min';

const app = getApp()
import util from "../../../utils/util.js";

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    start_date: '2018-09-01',
    end_date: '2018-10-01',
    array: [
      { name: '日', type: 'day' },
      { name: '月', type: 'month' },
      { name: '年', type: 'year' },
    ],
    index: 0,
    max_length: 5,
    list: [],
    list_title: [],
    list_date: [],
  },
  bindDateChange: function (e) {
    var value = e.detail.value,
      type = e.currentTarget.dataset.type
    this.setData({
      [type]: value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  more() {
    this.setData({
      max_length: '',
    })
  },
  pageData(){
    var _this = this

    this.setData({ list_title: [], list_date: [], list: [] })
    this.ajax = util.request2({
      url: 'v1/statistics/user-count',
      type: 'form',
      data: {
        type: this.data.array[this.data.index].type,
        start_time: this.data.start_date,
        end_time: this.data.end_date,
      },
      success: function (res) {
        _this.setData({
          list_title: res.data.data.name,
          list_date: res.data.data.times,
          list: res.data.data.data,
          max_length: 5,
        })
        _this.init()
        
      }
    })
  },
  init: function () {
    var _this = this
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      _this.echartInit(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  echartInit(chart) {
    var list_title = this.data.list_title,
      list_date = this.data.list_date,
      list = this.data.list,
      data = []
     
    for (var index = 0, len = list_title.length; index < len; index++) {
      var item_data = []
      list.map((item, idx) => {
        list.map((item, i) => {
          if (index == i) {
            item_data.push(list[idx][i])
          }
        })
      })
      data.push({
        name: list_title[index],
        type: 'line',
        smooth: true,
        data: item_data
      })
    }

    var option = {
      title: {
        text: '测试下面legend的红色区域不应被裁剪',
        left: 'center'
      },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8", "#000000", "#000000"],
      legend: {
        data: list_title,
        top: 50,
        left: 'center',
        backgroundColor: 'red',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: list_date,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: data
    };
    console.log(chart)
    chart.setOption(option);
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },
  onLoad(e) {
    wx.setNavigationBarTitle({
      title: e.title
    })
    this.setData({
      para: e.para || '',
      start_date: util.formatTime(new Date(new Date() - 30 * 24 * 3600 * 1000)),
      end_date: util.formatTime(new Date),
    })
    this.pageData()
  },
});
