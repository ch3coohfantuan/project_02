<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="scene == 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!c3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的全部sku列表"
                @click="checkAllSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  style="margin-left: 10px"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center; margin-top: 10px"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      @close="close"
    >
      <el-table :data="sku" border style="width=100%" v-loading="loading">
        <el-table-column
          property="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          property="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      c1Id: "",
      c2Id: "",
      c3Id: "",
      page: 1,
      limit: 3,
      spuList: [],
      total: 0,
      scene: 0,
      sku: [],
      spu: {},
      dialogTableVisible: false,
      loading: true,
    };
  },
  methods: {
    getCategoryId({ id, level }) {
      if (level == 1) {
        this.c2Id = "";
        this.c3Id = "";
        this.c1Id = id;
      } else if (level == 2) {
        this.c3Id = "";
        this.c2Id = id;
      } else {
        this.c3Id = id;
        this.getSpuList();
      }
    },
    async getSpuList() {
      const { page, limit, c3Id } = this;
      let result = await this.$api.spu.reqSpuList(page, limit, c3Id);
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.clearData();
      this.$refs.spu.getSpuData(this.c3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpu(row);
    },
    changeScene(val, flag) {
      this.scene = val;
      if (flag == "修改") {
        this.getSpuList();
      } else if (flag == "添加") {
        this.page = 1;
        this.getSpuList();
      }
    },
    async deleteSpu(row) {
      let result = await this.$api.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.page = this.records.length > 1 ? this.page : this.page - 1;
        this.getSpuList();
      }
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.clearData();
      this.$refs.sku.getSkuData(this.c1Id, this.c2Id, row);
    },
    async checkAllSku(row) {
      this.spu = row;
      this.dialogTableVisible = true;
      let result = await this.$api.sku.reqSkuList(row.id);
      if (result.code == 200) {
        this.sku = result.data;
        this.loading = false;
      }
    },
    close() {
      this.loading = true;
      this.sku = [];
    },
  },
};
</script>

<style>
</style>