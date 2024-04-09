<template>
  <div class="couter">
    <div class="title">
      <div>数据统计</div>
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
  let option = {
    radar: {
      indicator: [
        { name: '人数' },
        { name: '流量' },
        { name: '规模' },
        { name: '消费' },
        { name: '服务' },
        { name: '物流' },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
});
</script>

<style scoped lang="scss">
.couter {
  margin-top: 25px;
  background: url('../images/dataScreen-main-cb.png') no-repeat;
  background-size: 110% 100%;
  padding: 0 20px;
  margin-bottom: 10px;
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
    height: 210px;
  }
}
</style>
