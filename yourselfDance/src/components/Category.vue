<template>
  <el-card class="category">
    <el-form :inline="true">
      <!--  -->
      <el-form-item label="一级分类">
        <el-select
          :disabled="isShow === 1 ? true : false"
          v-model="categoryStore.c1Id"
          @change="handlerCategoryOneUpdate"
          style="min-width: 150px"
        >
          <!-- value属性即为下拉菜单收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :label="c1.name"
            :key="c1.id"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--  -->
      <el-form-item label="二级分类">
        <el-select
          :disabled="isShow === 1 ? true : false"
          v-model="categoryStore.c2Id"
          @change="handlerCategoryTwoUpdate"
          style="min-width: 150px"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :label="c2.name"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--  -->
      <el-form-item label="三级分类">
        <el-select
          :disabled="isShow === 1 ? true : false"
          v-model="categoryStore.c3Id"
          style="min-width: 150px"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :label="c3.name"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { onMounted } from 'vue';
import useCategoryStore from '@/stores/modules/category.js';

defineProps(['isShow']);

const categoryStore = useCategoryStore();
onMounted(() => {
  // 获取一级分类数据
  categoryStore.getC1();
});

// 一级分类选中值的时候触发---保证 c1Id 存在
function handlerCategoryOneUpdate() {
  // 将 二级、三级 分类的数据进行清空
  categoryStore.c2Id = '';
  categoryStore.c3Arr = [];
  categoryStore.c3Id = '';

  categoryStore.getC2();
}

function handlerCategoryTwoUpdate() {
  categoryStore.c3Id = '';
  categoryStore.getC3();
}
</script>

<style scoped lang="scss"></style>
