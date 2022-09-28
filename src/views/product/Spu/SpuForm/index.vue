<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="trade.tmName"
            :value="trade.id"
            v-for="trade in tradeMarkList"
            :key="trade.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          rows="4"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unselected.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            v-for="item in unselected"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                @close="handleClose(row, $index)"
                :disable-transitions="false"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row, $index)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteSaleAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleattrIdAndName: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleattrIdAndName: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [],
      imageList: [],
      saleAttrList: [],
      attrIdAndName: "",
    };
  },
  computed: {
    unselected() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.imageList = fileList;
      } else {
        alert("图片上传失败，请重试！");
      }
    },
    async initSpu(row) {
      let spuResult = await this.$api.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$api.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let imageResult = await this.$api.spu.reqSpuImageList(row.id);
      if (imageResult.code == 200) {
        let arr = imageResult.data;
        arr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.imageList = arr;
      }
      let saleAttrResult = await this.$api.spu.reqSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    addAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrIdAndName = "";
    },
    addSaleAttrValue(row, $index) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs[$index].focus();
      });
    },
    handleInputConfirm(row) {
      row.inputVisible = false;
      const { baseSaleAttrId, inputValue } = row;
      const saleAttrValueName = inputValue.trim();
      if (saleAttrValueName == "") {
        this.$message("属性值不能为空");
        return;
      }
      const isRepeat = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != saleAttrValueName;
      });
      if (!isRepeat) {
        this.$message("属性值不能重复");
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName,
      });
      row.inputValue = "";
    },
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    deleteSaleAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    async addOrUpdateSpu() {
      this.imageList.forEach((item) => {
        this.$set(item, "imgName", item.name);
        this.$set(
          item,
          "imgUrl",
          (item.response && item.response.data) || item.url
        );
      });
      this.spu.spuImageList = this.imageList;
      let result = await this.$api.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        this.$emit("changeScene", 0, this.spu.id ? "修改" : "添加");
      }
    },
    async getSpuData(c3Id) {
      let tradeMarkResult = await this.$api.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let saleAttrResult = await this.$api.spu.reqSaleAttrList();
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
      this.spu.category3Id = c3Id;
    },
    clearData() {
      this.spu = {
        category3Id: 0,
        description: "",
        tmId: "",
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: [],
      };
      this.imageList = [];
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>