<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.c1Id" placeholder="请选择" :disabled="!isShow">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.c2Id" placeholder="请选择" :disabled="!isShow">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.c3Id" placeholder="请选择" :disabled="!isShow">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        c1Id: "",
        c2Id: "",
        c3Id: "",
      },
    };
  },
  props:['isShow'],
  methods: {
    async getCategory1List() {
      let result = await this.$api.attr.reqCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
        return "ok";
      }
    },
    async getCategory2List(id) {
      let result = await this.$api.attr.reqCategory2List(id);
      if (result.code === 200) {
        this.list2 = result.data;
        return "ok";
      }
    },
    async getCategory3List(id) {
      let result = await this.$api.attr.reqCategory3List(id);
      if (result.code === 200) {
        this.list3 = result.data;
        return "ok";
      }
    },
  },
  mounted() {
    this.getCategory1List();
  },
  watch: {
    "cForm.c1Id"() {
      this.list2 = [];
      this.list3 = [];
      this.cForm.c2Id = "";
      this.cForm.c3Id = "";
      this.getCategory2List(this.cForm.c1Id);
      this.$emit("getCategoryId", { id: this.cForm.c1Id, level: 1 });
    },
    "cForm.c2Id"() {
      this.list3 = [];
      this.cForm.c3Id = "";
      if (this.cForm.c2Id != "") {
        this.getCategory3List(this.cForm.c2Id);
        this.$emit("getCategoryId", { id: this.cForm.c2Id, level: 2 });
      }
    },
    "cForm.c3Id"() {
      if (this.cForm.c3Id != "") {
        this.$emit("getCategoryId", { id: this.cForm.c3Id, level: 3 });
      }
    },
  },
};
</script>

<style>
</style>