<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!c3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>

        <el-table style="width: 100%; margin-top: 10px" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <!-- 使用作用域插槽，子组件不能决定自身的结构和样式，子组件可以进行数据回传 -->
              <el-tag
                type="success"
                style="margin: 5px 20px"
                v-for="attr in row.attrValueList"
                :key="attr.id"
              >
                {{ attr.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
        >
          添加属性值
        </el-button>
        <el-button @click="isShowTable = true"> 取消 </el-button>
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0px"
          border
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="valueName" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-show="row.flag"
                @blur="isValid(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span
                v-show="!row.flag"
                @click="focus(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="
            attrInfo.attrValueList.length == 0 ||
            attrInfo.attrValueList[0].valueName.trim() == ''
          "
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      c1Id: "",
      c2Id: "",
      c3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
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
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { c1Id, c2Id, c3Id } = this;
      let result = await this.$api.attr.reqAttrList(c1Id, c2Id, c3Id);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.c3Id,
        categoryLevel: 3,
      };
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        let index = this.attrInfo.attrValueList.length - 1;
        this.$refs[index].focus();
      });
    },
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    isValid(row) {
      row.valueName = row.valueName.trim();
      if (!row.valueName) {
        this.$message("属性值不能为空！");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("属性值不能重复！");
        return;
      }
      row.flag = false;
    },
    focus(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName.trim() != "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$api.attr.reqAddOrUpdateAttr(this.attrInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功！" });
        this.isShowTable = true;
        this.getAttrList();
      } else {
        alert("保存失败，请重试！");
      }
    },
    async deleteAttr(row) {
      let result = await this.$api.attr.reqDeleteAttr(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "属性删除成功！" });
        this.getAttrList();
      } else {
        alert("删除失败，请重试！");
      }
    },
  },
};
</script>

<style>
</style>