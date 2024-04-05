<template>
  <div>
    <Category :isShow="isShow"></Category>

    <el-card style="margin: 10px 0">
      <div v-show="isShow === 0">
        <el-button
          :disabled="categoryStore.c3Id ? false : true"
          type="primary"
          icon="Plus"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table :data="records" style="margin: 10px 0" border>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="SPU描述"
            prop="description"
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                @click="EditSpu(row)"
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>

      <!-- 添加SPU | 修改SPU -->
      <SpuForm
        ref="spu"
        @changeIsShow="changeIsShow"
        v-show="isShow === 1"
      ></SpuForm>

      <!-- 添加SKU -->
      <SkuForm v-show="isShow === 2"></SkuForm>
    </el-card>
  </div>
</template>

<script setup>
// SPU：代表一个标准化产品单元
import { ref, watch } from 'vue';
import SpuForm from './SpuForm.vue';
import SkuForm from './SkuForm.vue';
import useCategoryStore from '@/stores/modules/category';
import { reqHasSpu } from '@/api/product/spu.js';

let isShow = ref(0);
let categoryStore = useCategoryStore();
let spu = ref();
// 监听三级分类,发请求
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return;
    getHasSpu();
  }
);
async function getHasSpu(pager = 1) {
  // 修改当前页码
  pageNo.value = pager;

  let result = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id
  );
  console.log(result);

  if (result.code === 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
}
let records = ref([]);
/* 
    分页器
*/
let pageNo = ref(1);
let pageSize = ref(3);
let total = ref(0);

// 下拉菜单发生变化时触发
function changeSize() {
  getHasSpu();
}

//  添加SPU按钮
function addSpu() {
  isShow.value = 1;
}

// 修改SPU按钮
function EditSpu(row) {
  isShow.value = 1;
  spu.value.initHasSpuData(row);
}

// 子组件SpuForm绑定的自定义事件
function changeIsShow(isShow) {
  isShow.value = isShow;
}
</script>

<style scoped lang="scss"></style>
