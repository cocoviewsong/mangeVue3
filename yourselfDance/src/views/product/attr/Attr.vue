<template>
  <!-- 三级分类全局组件 -->
  <Category :isShow="isShow"></Category>

  <el-card style="margin: 10px 0">
    <div v-show="isShow === 0">
      <el-button
        type="danger"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="handlerAddAttr"
      >
        添加属性
      </el-button>

      <el-table border style="margin: 10px 0" :data="attrArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>

        <el-table-column
          label="属性名称"
          width="100px"
          prop="attrName"
        ></el-table-column>

        <el-table-column label="属性值名称" type="index" width="620px">
          <template #="{ row, $index }">
            <el-tag v-for="(item, index) in row.attrValueList" :key="item.id">
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Edit"
              @click="updateAttr"
            ></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="isShow === 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input placeholder="请你输入属性的名称"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="danger" icon="Plus">添加属性值</el-button>
      <el-button type="danger" icon="Delete" @click="cancel">取消</el-button>
      <el-table border style="margin: 10px 0">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称"></el-table-column>
        <el-table-column label="属性值操作"></el-table-column>
      </el-table>
      <el-button type="primary" icon="Plus">保存</el-button>
      <el-button type="primary" icon="Delete" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { watch, ref, reactive } from 'vue';
import { reqAttr, reqAddOrEditAttr } from '@/api/product/attr';
import useCategoryStore from '@/stores/modules/category';
const categoryStore = useCategoryStore();

watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上次查询记录
    attrArr.value = [];

    if (!categoryStore.c3Id) return;
    getAttr();
  }
);

let attrArr = ref([]);
async function getAttr() {
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code === 200) attrArr.value = result.data;
  console.log(attrArr.value);
}

/* 
    点击添加按钮，切换显示内容
*/
let isShow = ref(1);
function handlerAddAttr() {
  isShow.value = 1;
}

// 修改按钮的逻辑
function updateAttr() {
  isShow.value = 1;
}

// 取消按钮的逻辑
function cancel() {
  isShow.value = 0;
}

/* 
    添加属性与修改属性逻辑
*/
const attrParams = reactive({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3, // 代表三级分类
});
</script>

<style scoped lang="scss"></style>
