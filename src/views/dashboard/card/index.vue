<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="echarts">
              <span>周同比&nbsp;&nbsp;56.67%</span>
              <span style="float: right">日同比&nbsp;&nbsp;19.96%</span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="echarts">
              <lineCharts> </lineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card></el-col
      >
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="echarts">
              <barCharts> </barCharts>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template></Detail
          >
        </el-card></el-col
      >
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="echarts">
              <progressCharts></progressCharts>
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;12%</span>
              <span style="float: right">日同比&nbsp;&nbsp;11%</span>
            </template></Detail
          >
        </el-card></el-col
      >
    </el-row>
  </div>
</template>

<script>
import Detail from "./detail";
import lineCharts from "./linecharts";
import barCharts from "./barCharts";
import progressCharts from "./progressCharts";
export default {
  name: "Card",
  components: { Detail, lineCharts, barCharts, progressCharts },
};
</script>

<style>
</style>