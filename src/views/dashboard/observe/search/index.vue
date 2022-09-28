<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="body">
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts>
              <template slot="main">
                <div class="main">
                  <span class="main-left">13688</span>
                  <span class="main-right"
                    >1.78 <i class="el-icon-caret-top"></i
                  ></span>
                </div> </template></LineCharts
          ></el-col>
          <el-col :span="12"
            ><LineCharts>
              <template slot="main">
                <div class="main">
                  <span class="main-left">12490</span>
                  <span class="main-right"
                    >1.45 <i class="el-icon-caret-bottom"></i
                  ></span>
                </div>
              </template> </LineCharts
          ></el-col>
        </el-row>
        <el-table :data="listData" style="width: 100%" border class="table">
          <el-table-column type="index" label="排名" width="80">
          </el-table-column>
          <el-table-column prop="word" label="搜索关键字" width="180">
          </el-table-column>
          <el-table-column prop="user" label="用户数" sortable>
          </el-table-column>
          <el-table-column prop="count" label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :total="listData.length"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LineCharts from "./lineCharts";

export default {
  components: { LineCharts },
  computed: {
    ...mapState({
      listData: (state) => {
        let arr = state.home.list.searchWord || [];
        return arr.splice(0, 3);
      },
    }),
  },
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 5px 0px;
  display: flex;
  justify-content: space-between;
}
.el-card__header {
  padding: 10px 20px;
}
.el-icon-caret-top {
  color: red;
}
.el-icon-caret-bottom {
  color: green;
}
.main {
  margin-top: 10px;
}
.main-left {
  font-size: 26px;
}
.main-right {
  float: right;
  margin-right: 80px;
  margin-top: 7px;
}
.pagination {
  float: right;
  margin-top: 10px;
}
.table {
  margin-top: 10px;
}
</style>
