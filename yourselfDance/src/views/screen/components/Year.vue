<template>
  <div class="year">
    <div class="title">
      <div>年度游客量</div>
      <img src="../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图标容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const charts = ref();
onMounted(() => {
  // .一个容器可以展示多种类型的图表
  let myChart = echarts.init(charts.value);
  myChart.setOption({
    title: {
      text: '散点图',
      left: '50%',
      textStyle: {
        color: '#fff',
        fontSize: '20',
      },
      //   .子标题
      subtext: '各大景区排行',
      //   .子标题的样式
      subtextStyle: {
        color: '#fff',
      },
    },
    xAxis: {
      type: 'category', //. 图形在x轴上均匀分布
      show: false,
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    // .系列 -> 决定你显示的图形是哪一种
    series: [
      {
        symbolSize: 10,
        type: 'scatter',
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68],
        ],
        symbol: 'circle',
        label: {
          show: true,
          // .文字位置
          position: 'insideTop',
          color: '#fff',
        },
        // .是否显示背景颜色
        color: '#13accc',
        showBackground: true,
        symbolSize: 24,
      },
    ],
  });
});
</script>

<style scoped lang="scss">
.year {
  margin-top: 20px;
  background: url('../images/dataScreen-main-cb.png') no-repeat;
  background-size: 115% 105%;
  padding: 0 20px;

  .title {
    font-size: 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    img {
      margin-top: 10px;
      width: 67px;
      height: 7px;
    }
  }
  .charts {
    height: 320px;
  }
}
</style>
