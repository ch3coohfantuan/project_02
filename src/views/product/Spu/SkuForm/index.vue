<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="sku.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="sku.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                v-for="item in attr.attrValueList"
                :key="item.id"
                :label="item.valueName"
                :value="`${item.attrId}:${item.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="sale.saleAttrName"
            v-for="sale in spuSaleList"
            :key="sale.id"
          >
            <el-select placeholder="请选择" v-model="sale.attrIdAndValueId">
              <el-option
                :label="item.saleAttrValueName"
                :value="`${sale.id}:${item.id}`"
                v-for="item in sale.spuSaleAttrValueList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSkuInfo">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleList: [],
      attrInfoList: [],
      spu: {},
      sku: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      imageList: [],
    };
  },
  methods: {
    async getSkuData(c1Id, c2Id, row) {
      this.sku.category3Id = row.category3Id;
      this.sku.tmId = row.tmId;
      this.sku.spuId = row.id;
      this.spu = row;
      let result = await this.$api.sku.reqSpuImageList(row.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      let result1 = await this.$api.sku.reqSpuSaleList(row.id);
      if (result1.code == 200) {
        this.spuSaleList = result1.data;
      }
      let result2 = await this.$api.sku.reqAttrInfoList(
        c1Id,
        c2Id,
        row.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.sku.skuDefaultImg = row.imgUrl;
    },
    async addSkuInfo() {
      const { attrInfoList, sku, spuSaleList, imageList } = this;
      attrInfoList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          sku.skuAttrValueList.push({
            attrId,
            valueId,
          });
        }
      });
      spuSaleList.forEach((item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          sku.skuSaleAttrValueList.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
      });
      let arr = []
      imageList.forEach((item) => {
        const { imgName, imgUrl, isDefault, id } = item;
        arr.push({
          imgName,
          imgUrl,
          isDefault,
          spuImgId: id,
        });
      });
      sku.skuImageList = arr;
      let result = await this.$api.sku.reqAddSku(sku);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScene", 0);
      }
    },
    clearData() {
      this.sku = {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      };
    },
  },
};
</script>

<style>
</style>