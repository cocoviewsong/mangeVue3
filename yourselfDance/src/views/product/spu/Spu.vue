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
                @click="addSku(row)"
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
                @click="findSku(row)"
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <!-- 删除按钮 -->
              <el-popconfirm
                @confirm="deleteSpu(row)"
                :title="`你确定删除${row.spuName}?`"
                width="200px"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
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

      <!-- // - 添加SPU | 修改SPU   -->
      <SpuForm
        ref="spu"
        @changeIsShow="changeIsShow"
        v-show="isShow === 1"
      ></SpuForm>

      <!-- //- 添加SKU -->
      <SkuForm
        ref="sku"
        v-show="isShow === 2"
        @changeIsShow="changeIsShow"
      ></SkuForm>

      <!-- 对话框:展示已有SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table :data="skuArr" border>
          <el-table-column prop="skuName" label="SKU名字"></el-table-column>
          <el-table-column prop="price" label="SKU价格"></el-table-column>
          <el-table-column prop="weight" label="SKU重量"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; background-size: cover"
                alt="SKU图片"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
// * SPU：代表一个标准化产品单元

import { ref, watch, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import SpuForm from './SpuForm.vue';
import SkuForm from './SkuForm.vue';
import useCategoryStore from '@/stores/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu.js';

let isShow = ref(0);
let categoryStore = useCategoryStore();
let spu = ref();

// -控制对话框的显示与隐藏
let show = ref(false);

// -存储全部的SKU数据
let skuArr = ref([]);

// * 获取子组件sku实例
let sku = ref();

// * 监听三级分类,发请求
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return;
    getHasSpu();
  }
);
// * 得到所有SPU属性
async function getHasSpu(pager = 1) {
  // - 修改当前页码
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

//  * 分页器
let pageNo = ref(1);
let pageSize = ref(3);
let total = ref(0);

// * 下拉菜单发生变化时触发
function changeSize() {
  getHasSpu();
}

// * 添加SPU按钮
function addSpu() {
  isShow.value = 1;

  // - 调用子组件方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id);
}

// * 修改SPU按钮
function EditSpu(row) {
  isShow.value = 1;
  spu.value.initHasSpuData(row);
}

// * 子组件SpuForm绑定的自定义事件
function changeIsShow({ flag, params }) {
  isShow.value = flag;

  // - 再次获取 SPU    修改留在当前页
  if (params === 'update') getHasSpu(pageNo.value);
  // - 添加留在第一页
  else getHasSpu();
}

// * 添加SKU按钮
function addSku(row) {
  //  - 切换为场景2
  isShow.value = 2;
  // - 调用子组件方法初始化SKU数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}

// * 查看SKU列表数据
async function findSku(row) {
  let result = await reqSkuList(row.id);
  if (result.code === 200) {
    skuArr.value = result.data;
    // .对话框显示出来
    show.value = true;
  }
}

// * 删除SPU数据
async function deleteSpu(row) {
  let result = await reqRemoveSpu(row.id);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    // #再捞一次SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    });
  }
}

// * 组件销毁时清空仓库数据
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped lang="scss"></style>
