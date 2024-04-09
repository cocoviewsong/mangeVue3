<template>
  <div class="rank">
    <div class="title">
      男女比例
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
      text: '景区排行',
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
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        label: {
          show: true,
          // .文字位置
          position: 'insideTop',
          color: '#fff',
        },
        // .是否显示背景颜色
        showBackground: true,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#f7777f', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#333', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          //. 逐条颜色
          color: '#13dc',
        },
      },
      {
        type: 'line',
        data: [10, 26, 34, 25, 17, 56, 49],
      },
    ],
  });
});
</script>

<style scoped lang="scss">
.rank {
  margin-top: 20px;
  background: url('../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;

  .title {
    font-size: 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    img {
      margin-top: 10px;
      width: 68px;
      height: 7px;
    }
  }
  .charts {
    height: 320px;
  }
}
</style>
