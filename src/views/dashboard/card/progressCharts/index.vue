<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import * as echarts from "echarts/index.js";
export default {
  name: "progressCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.echarts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          barWidth: 10,
          color: "skyblue",
          showBackground: true,
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
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