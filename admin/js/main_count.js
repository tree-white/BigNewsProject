// 函数封装
// 1.折线图
function lineGraph(data,date) {
  // 初始化需要传入3个数据
  const myChart = echarts.init($('#curve_show')[0]);  // 需要原生dom元素盒子
  // data;     // 每日新增文章的数据
  // date;     // 每日新增文章的日期

  // 设置的样式
  option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    // 标题
    title: {
      left: 'center',
      text: '日新增文章数',
    },

    xAxis: {
      name: '日',
      type: 'category',
      boundaryGap: false,
      data: date
    },
    legend: {
      data: ['新增文章'],
      top: '40'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {
          readOnly: false
        },
        magicType: {
          type: ['line', 'bar']
        },
        restore: {},
        saveAsImage: {}
      },
      right: 50
    },
    yAxis: {
      name: '数量',
      type: 'value',
      boundaryGap: [0, '100%']
    },
    series: [{
      // 需要传入的y轴数据
      data: data,

      name: '新增文章',
      type: 'line',
      smooth: true,
      // symbol: 'none',
      sampling: 'average',
      itemStyle: {
        color: '#f80'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(255,136,0,0.39)'
        }, {
          offset: .34,
          color: 'rgba(255,180,0,0.25)'
        },
        {
          offset: 1,
          color: 'rgba(255,222,0,0.00)'
        }
        ])
      },
    }],
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 2.环形图
function doughnutChart(arr) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init($('#pie_show')[0]);
  // 数据
  const seriesData = arr.map(item => {
    return { value: item.articles, name: item.name }
  })

  option = {
    title: {
      text: '各类文章数据统计',
      left: 'center',
      top: '2%'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        name: '文章类型',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
};

// 3.柱状图
function histogram(date, quantity) {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById('column_show'));

  option = {
    title: {
      left: 'center',
      text: '日文章访问量',
      top: '5%'
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: quantity,
      type: 'line',
      areaStyle: {}
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
};

// 入口函数
$(function () {

  // 进入首页刷新数据
  // 1、获取统计数据
  $.ajax({
    type: "get",
    url: bigNews.data_info,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      // totalArticle - 总文章数
      // dayArticle - 日文章数
      // totalComment - 总评论数
      // dayComment - 日评论数
      $('.spannel_list .spannel').eq(0).children('em').text(response.totalArticle)
      $('.spannel_list .spannel').eq(1).children('em').text(response.dayArticle)
      $('.spannel_list .spannel').eq(2).children('em').text(response.totalComment)
      $('.spannel_list .spannel').eq(3).children('em').text(response.dayComment)
      
    }
  });

  // 2、日新增文章数量统计 - 折线图 - 月新增文章数
  $.ajax({
    type: "get",
    url: bigNews.data_article,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response.code === 200) {
        // 获取说有日期
        const dateArr = response.date.map(item => {
          return item.date;
        })
        // 获取所有新增数量
        const dataArr = response.date.map(item => {
          return item.count;
        })
        // 调用日新增文章折线图
        lineGraph(dataArr, dateArr)

      }
    }
  });

  // 3、各类型文章数量统计 - 环形图 - 分类文章数量比
  $.ajax({
    type: "get",
    url: bigNews.data_category,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code === 200) {
        doughnutChart(response.date)
      }
    }
  });

  // 4、日文章访问量- 面积图
  $.ajax({
    type: "get",
    url: bigNews.data_visit,
    dataType: "json",
    success: function (response) {
      // console.log(response);
      if (response.code === 200) {
        const newDate = []
        const quantity = []
        for (let key in response.data) {
          newDate.unshift(key)
          quantity.unshift(response.data[key])
        }
        // console.log(newDate, quantity);
        histogram(newDate, quantity);
      }
    }
  });

})