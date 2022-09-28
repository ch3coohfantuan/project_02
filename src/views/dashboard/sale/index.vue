<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!--  @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane
            label="销售额"
            name="sale"
            style="font-size: 40px"
          ></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row>
          <el-col :span="18">
            <div class="echarts" ref="echarts"></div>
          </el-col>
          <el-col :span="6">
            <div class="">
              <div>
                <h3>门店{{ title }}排名</h3>
              </div>
              <ul>
                <li v-for="order in rank" :key="order.no">
                  <span class="rindex">{{ order.no }}</span>
                  <span>{{ order.name }}</span>
                  <span class="rvalue">{{ order.money }}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listData: (state) => {
        return state.home.list;
      },
    }),
    rank() {
      return this.activeName == "sale"
        ? this.listData.orderRank
        : this.listData.userRank;
    },
  },
  watch: {
    activeName() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.activeName == "sale"
              ? this.listData.orderFullYearAxis
              : this.listData.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.activeName == "sale"
                ? this.listData.orderFullYear
                : this.listData.userFullYear,
            color: "green",
          },
        ],
      });
    },
    listData() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data: this.listData.orderFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listData.orderFullYear,
            color: "green",
          },
        ],
      });
    },
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.echarts);
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "green",
        },
      ],
    });
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style>
.el-card__header {
  border-bottom: none;
}
</style>
<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0px 10px;
}
.date {
  width: 250px;
  margin: -10px 20px;
}
.echarts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
ul li span {
  margin: 0px 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>