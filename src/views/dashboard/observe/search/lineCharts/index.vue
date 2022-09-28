<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <el-button style="border: 0px" icon="el-icon-info"></el-button>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
    <div class="footer">
      <div class="echarts" ref="echarts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/index.js";
export default {
  mounted() {
    let lineCharts = echarts.init(this.$refs.echarts);
    lineCharts.setOption({
      xAxis: { show: false, type: "category" },
      yAxis: { show: false },
      series: [
        {
          type: "line",
          data: [10, 7, 33, 25, 15, 48, 9, 29, 19],
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "blue",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
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
  },
};
</script>

<style scoped>
.header {
  display: flex;
  line-height: 38px;
  text-align: center;
}
.echarts {
  width: 100%;
  height: 50px;
}
</style>