<template>
  <div>
    <ElButton type="danger" :icon="Delete">删除按钮</ElButton>
    <ElButton type="primary" :icon="Plus">添加按钮</ElButton>
    <ElButton type="success" :icon="Edit">编辑按钮</ElButton>

    <!-- 分页器组件 -->
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { Delete, Plus, Edit } from '@element-plus/icons-vue';

const currentPage4 = ref(4);
const pageSize4 = ref(100);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style scoped lang="scss"></style>
