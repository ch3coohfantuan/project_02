<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <el-button style="border: 0px" icon="el-icon-info"></el-button>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-echarts">
      <slot name="echarts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  color: gray;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-echarts {
  height: 40px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>