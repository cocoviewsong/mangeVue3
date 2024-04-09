<template>
  <div class="container">
    <div class="screen" ref="screen">
      <!-- 顶部文字介绍 -->
      <div class="top">
        <div class="top__left">
          <span class="top__left__btn" @click="goHome">首页</span>
        </div>
        <div class="top__center">
          <div class="top__center__title">数据展示</div>
        </div>
        <div class="top__right">
          <span class="top__right__btn">统计报告</span>
          <span class="top__right__time">当前时间:{{ time }}</span>
        </div>
      </div>

      <!-- 展示区 -->
      <div class="main">
        <div class="left">
          <!-- 第一行 -->
          <div class="row1">
            <div class="row1__title">实时游客统计</div>
            <div class="row1__img"></div>
            <div class="row1__text">
              可预约总量
              <span>9999</span>人
            </div>
            <div class="row1__number">
              <span v-for="(number, index) in people" :key="index">
                {{ number }}
              </span>
            </div>
            <div
              class="row1__waterImg"
              style="height: 245px"
              ref="charts"
            ></div>
          </div>

          <!-- 第二行 -->
          <div class="row2">
            <div class="title">
              男女比例
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="gender__ratio">
              <div class="man">
                <img src="./images/man.png" alt="男人" />
              </div>
              <div class="women">
                <img src="./images/woman.png" alt="女人" />
              </div>
            </div>
            <div class="rate">
              <p>男士58%</p>
              <p>女士42%</p>
            </div>
            <div class="charts" ref="chartsGender"></div>
          </div>

          <!-- 第三行 -->
          <div class="row3">
            <div class="age__ratio">
              年龄比例
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <!-- 饼图 -->
            <div class="pie__chart" ref="pieChart"></div>
          </div>
        </div>

        <div class="center">
          <!-- 地图 -->
          <div class="map">我最帅</div>
          <!-- 折线图 -->
          <div class="line-chart">w78456</div>
        </div>
        <div class="right">右边</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import * as echarts from 'echarts';
// .水球图扩展插件
import 'echarts-liquidfill';

let people = ref('29511人');
// -当前时间
let time = ref(moment().format('YYYY年MM月DD日 HH:mm:ss'));
let timer = ref(0);

// !构建的时候需要复原
// onMounted(() => {
//   timer.value = setInterval(() => {
//     time.value = moment().format('YYYY年MM月DD日 HH:mm:ss');
//   }, 1000);
// });
// // .销毁计时器
// onBeforeUnmount(() => {
//   clearInterval(timer.value);
// });

const router = useRouter();

// -获取DOM元素
const screen = ref(); //. 数据大屏
const charts = ref(); //. 水球图
const chartsGender = ref(); //. 比例图片
const pieChart = ref(); //. 饼图
// .缩放比例
const getScale = (width = 1920, height = 1080) => {
  let newWidth = window.innerWidth / width;
  let newHeight = window.innerHeight / height;
  return newWidth < newHeight ? newWidth : newHeight;
};

// *监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};

// *回到首页
const goHome = () => {
  router.push('./');
};

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
  // -水球图
  let myCharts = echarts.init(charts.value);
  myCharts.setOption({
    // .标题组件
    // title: {
    //   text: '水球图',
    // },
    // .X | Y轴组件
    // xAxis: {},
    // yAxis: {},
    // .系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill',
      data: [0.6, 0.4, 0.3],
    },
    // .布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });

  // -柱状图
  let myCharts2 = echarts.init(chartsGender.value);
  myCharts2.setOption({
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, type: 'category' },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 3,
        itemStyle: {
          color: '#4263eb',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: '#f7777f',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });

  // -饼图
  let myCharts3 = echarts.init(pieChart.value);
  myCharts3.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '35',
      right: '32',
      orient: 'vertical',
      textStyle: {
        color: '#fff',
        fontSize: '15',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'inside',
          color: '#fff',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Emai' },
          { value: 484, name: 'Union' },
          { value: 300, name: 'Video' },
        ],
      },
    ],

    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });
});
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png') no-repeat;
  background-size: cover;
}
.screen {
  width: 1920px;
  height: 1080px;
  position: fixed;
  transform-origin: left top;
  left: 50%;
  top: 50%;
  .top {
    width: 100%;
    height: 40px;
    display: flex;
    &__left {
      flex: 1;
      background: url('./images/dataScreen-header-left-bg.png') no-repeat;
      background-size: cover;
      &__btn {
        width: 100px;
        height: 40px;
        color: #29fffc;
        float: right;
        background: url('./images/dataScreen-header-btn-bg-l.png');
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
    }
    &__center {
      flex: 2;
      &__title {
        width: 100%;
        height: 74px;
        color: #29fffc;
        line-height: 74px;
        font-size: 30px;
        text-align: center;
        background: url('./images/dataScreen-header-center-bg.png') no-repeat;
        background-size: cover;
      }
    }
    &__right {
      flex: 1;
      background: url('./images/dataScreen-header-left-bg.png') no-repeat;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &__btn {
        width: 100px;
        height: 40px;
        color: #29fffc;
        background: url('./images/dataScreen-header-btn-bg-r.png');
        background-size: 100% 100%;
        text-align: center;
        line-height: 40px;
      }
      &__time {
        color: #29fffc;
        font-size: 18px;
        padding-right: 50px;
      }
    }
  }
  .main {
    display: flex;
    height: 1040px;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      .row1 {
        flex: 1;
        background: url('./images/dataScreen-main-lb.png') no-repeat;
        background-size: 100% 100%;
        margin-top: 15px;
        padding: 0 20px;
        &__title {
          color: #fff;
          font-size: 20px;
          margin-bottom: 10px;
        }
        &__img {
          width: 68px;
          height: 7px;
          background: url('./images/dataScreen-title.png') no-repeat;
        }
        &__text {
          float: right;
          color: #fff;
          font-size: 18px;
          span {
            color: #29fffc;
          }
        }

        &__number {
          color: #29fffc;
          display: flex;
          margin-top: 40px;
          gap: 3px;
          span {
            margin-top: 15px;
            font-size: 24px;
            flex: 1;
            width: 30px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: url('./images/total.png') no-repeat;
          }
        }

        &__waterImg {
          width: 100%;
          height: 280px;
        }
      }
      .row2 {
        flex: 1;
        margin-top: 10px;
        background: url('./images/dataScreen-main-cb.png') no-repeat;
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

        .gender__ratio {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 45px;
          .man {
            width: 111px;
            height: 115px;
            background: url('./images/man-bg.png') no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .women {
            width: 111px;
            height: 115px;
            background: url('./images/woman-bg.png') no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .rate {
          color: #fff;
          font-size: 20px;
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          margin: 20px 20px 0;
        }

        .charts {
          font-size: 0;
          height: 50px;
          margin-bottom: 25px;
          // background-color: #ff7777;
        }
      }
      .row3 {
        flex: 1;
        margin-top: 25px;
        background: url('./images/dataScreen-main-cb.png') no-repeat;
        background-size: 100% 100%;
        padding: 0 20px;
        margin-bottom: 10px;
        .age__ratio {
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

        .pie__chart {
          height: 210px;
        }
      }
    }

    .center {
      flex: 2;

      .map {
        background-color: #f77777;
      }

      .line-chart {
        background-color: #f77777;
      }
    }

    .right {
      flex: 1;
    }
  }
}
</style>
