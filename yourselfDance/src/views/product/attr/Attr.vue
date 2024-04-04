<template>
  <div>
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
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="danger"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`确定删除吗${row.attrName}吗?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <!-- 删除按钮 -->
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="isShow === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrParams.attrName"
              placeholder="请你输入属性的名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="danger"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="danger" icon="Delete" @click="cancel">取消</el-button>

        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row 当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                v-model="row.valueName"
                type="text"
                placeholder="请你输入属性值名称"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                @click="attrParams.attrValueList.splice($index, 1)"
                type="danger"
                icon="Delete"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          @click="saveButton"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          size="default"
          type="primary"
          icon="Plus"
        >
          保存
        </el-button>
        <el-button type="primary" icon="Delete" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import { reqAttr, reqAddOrEditAttr, reqRemoveAttr } from '@/api/product/attr';
import { ElMessage } from 'element-plus';
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
    点击添加按钮，切换显示内容  *********************记得改这里
*/
let isShow = ref(0);
function handlerAddAttr() {
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3, // 代表三级分类
  });

  isShow.value = 1;

  // 收集三级分类ID
  attrParams.categoryId = categoryStore.c3Id;
}

// 修改按钮的逻辑
function updateAttr(row) {
  isShow.value = 1;

  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
  console.log(attrParams);
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

// “添加属性值 ”---按钮的逻辑
function addAttrValue() {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每个属性值编辑与查看模式的观看
  });

  // 获取最后的el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  });
}

// 保存按钮
async function saveButton() {
  let result = await reqAddOrEditAttr(attrParams);
  console.log(result);

  if (result.code === 200) {
    isShow.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    });
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    });
  }
}

/*
    控制编辑模式与查看模式的切换
*/
function toLook(row, $index) {
  if (row.valueName.trim() === '') {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    });
    return;
  }

  let repeat = attrParams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName;
    }
  });

  if (repeat) {
    attrParams.attrValueList.splice($index, 1);

    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    });
    return;
  }

  row.flag = false;
}
function toEdit(row, $index) {
  row.flag = true;

  nextTick(() => inputArr.value[$index].focus());
}

/*
   输入框聚焦功能
*/
let inputArr = ref([]);

/* 
    删除已有属性的逻辑
*/
async function deleteAttr(attrId) {
  console.log(attrId);

  let result = await reqRemoveAttr(attrId);
  console.log(result);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    // 再获取一次属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    });
  }
}

/* 
    组件销毁时清空仓库数据的逻辑
*/
onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset();
});
</script>

<style scoped lang="scss"></style>
