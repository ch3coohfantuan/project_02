<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import * as echarts from "echarts/index.js";
export default {
  name: "barCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.echarts);
    lineCharts.setOption({
      xAxis: { show: false, type: "category" },
      yAxis: { show: false },
      series: [
        {
          type: "bar",
          data: [10, 16, 33, 25, 15, 68, 19, 29, 19, 59, 22, 28],
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      tooltip: {},
    });
  },
};
</script>

<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>