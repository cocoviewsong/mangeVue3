<template>
  <el-card
    style="
      max-width: 1200px;
      background-color: #666;
      box-shadow: none;
      border: none;
      margin: 0 auto;
    "
  >
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button
      @click="handleTrademark"
      icon="Plus"
      type="warning"
      size="default"
      title="添加品牌"
    >
      添加品牌
    </el-button>

    <!-- 表格组件:展示数据 -->
    <el-table style="margin: 10px 0" border :data="trademarkArr">
      <!-- 默认用div展示数据 -->
      <el-table-column
        align="center"
        label="序号"
        width="80px"
        type="index"
      ></el-table-column>

      <!-- 自定义标签 -->
      <el-table-column label="品牌名称">
        <template #="{ row, $index }">
          <p style="color: #333">{{ row.tmName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img
            style="width: 48px; background-size: cover"
            :src="row.logoUrl"
            alt="品牌LOGO"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            @click="handleTrademarkChange"
            icon="Edit"
            type="danger"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="handleTrademark"
            icon="Delete"
            type="danger"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      分页器
      pagination
        v-model:current-page:设置分页器当前页码
        layout:调整分页器子组件布局
        @current-change: 当前页码发生变化就会触发该函数

    -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total "
      :total="total"
      @current-change="getHasTrademark"
      @size-change="handlerSizeChange"
    />
  </el-card>

  <!-- 对话框组件 -->
  <el-dialog v-model="dialogFormVisible" title="添加品牌">
    <el-form style="width: 80%; padding: 20px">
      <el-form-item label="品牌名称:" label-width="80px">
        <el-input placeholder="请输入品牌名"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO:" label-width="80px">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 具名插槽 -->
    <template #footer>
      <el-button type="primary" size="default" @click="handlerCancel">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="handlerConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { reqHasTrademark } from '@/api/product/trademark.js';
// 当前页码
const currentPage = ref(1);
// 每一页展示多少条数据
const pageSize = ref(3);

// 存储品牌总量
let total = ref(0);

// 存储已有品牌数据
let trademarkArr = ref([]);

// 控制对话框显示与隐藏
let dialogFormVisible = ref(false);

// 处理对话框显示状态
function handleTrademark() {
  dialogFormVisible.value = true;
}

// 修改已有品牌
function handleTrademarkChange() {
  dialogFormVisible.value = true;
}

// 对话框确定取消按钮
function handlerCancel() {
  dialogFormVisible.value = false;
}
function handlerConfirm() {
  dialogFormVisible.value = false;
}

// 获取已有品牌的接口封装为一个函数:在任何情况下获取数据，调用此函数即可
async function getHasTrademark() {
  let result = await reqHasTrademark(currentPage.value, pageSize.value);
  if (result.code === 200) {
    // 存储已有品牌的总个数
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
}

// 当下拉菜单发生变化时触发
// ---返回的参数和 pageSize.value 是一个东西
function handlerSizeChange() {
  currentPage.value = 1;
  getHasTrademark();
}

onMounted(() => {
  getHasTrademark();
});
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
