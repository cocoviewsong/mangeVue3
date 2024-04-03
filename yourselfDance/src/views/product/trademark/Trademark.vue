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
            @click="handleTrademarkChange(row)"
            icon="Edit"
            type="danger"
            size="small"
          >
            修改
          </el-button>

          <el-popconfirm
            width="200px"
            icon="Delete"
            :title="`您确定要删除${row.tmName}?`"
            @confirm="removeTrademark(row.id)"
          >
            <template #reference>
              <el-button icon="Delete" type="danger" size="small">
                删除
              </el-button>
            </template>
          </el-popconfirm>
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
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParms.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%; padding: 20px"
      :model="trademarkParms"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item prop="tmName" label="品牌名称:" label-width="90px">
        <el-input
          v-model="trademarkParms.tmName"
          placeholder="请输入品牌名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="logoUrl" label="品牌LOGO:" label-width="90px">
        <!-- 拖动上传 -->
        <el-upload
          class="upload-demo"
          drag
          multiple
          action="/api/admin/product/fileUpload"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <div v-if="!trademarkParms.logoUrl">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </div>
          <div v-else>
            <img
              :src="trademarkParms.logoUrl"
              style="width: 210px; height: 150px; background-size: cover"
              alt="品牌LOGO"
            />
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png/gif/webp files with a size less than 10MB
            </div>
          </template>
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
import { ref, onMounted, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';

// 请求函数
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark.js';

// 当前页码
const currentPage = ref(1);
// 每一页展示多少条数据
const pageSize = ref(3);

// 存储品牌总量
let total = ref(0);

// 控制对话框显示与隐藏
let dialogFormVisible = ref(false);

/*
    按钮操作相关逻辑
*/

// 存储已有品牌数据
let trademarkArr = ref([]);

// 收集新增品牌数据
let trademarkParms = reactive({
  tmName: '',
  logoUrl: '',
});

// 限制上传文件的大小 (在上传文件之前触发的函数)
const beforeAvatarUpload = (loadingFile) => {
  // 上传文件类型 png|jpg|gif  10M
  if (
    loadingFile.type === 'image/png' ||
    loadingFile.type === 'image/jpeg' ||
    loadingFile.type === 'image/gif' ||
    loadingFile.type === 'image/webp'
  ) {
    if (loadingFile.size / 1024 / 1024 < 10) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件不能大于10MB',
      });
    }
  } else {
    ElMessage({
      type: 'error',
      message: '文件格式必须为PNG|JPG|GIF|webp',
    });
    return false;
  }
};

// 品牌LOGO图片上传成功执行
const handleAvatarSuccess = (response, uploadFile) => {
  trademarkParms.logoUrl = response.data;
  // 图片上传成功,清除图片校验信息
  formRef.value.clearValidate('logoUrl');
};

// 处理对话框显示状态
function handleTrademark() {
  dialogFormVisible.value = true;

  // 清空填写的数据
  trademarkParms.id = 0;
  trademarkParms.tmName = '';
  trademarkParms.logoUrl = '';

  // 清空校验信息
  formRef.value?.clearValidate();
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
}

// 修改已有品牌 --- row 当前的品牌
async function handleTrademarkChange(row) {
  // 清空校验规则的提示信息
  formRef.value?.clearValidate();

  dialogFormVisible.value = true;
  Object.assign(trademarkParms, row);
}

// 对话框确定取消按钮
function handlerCancel() {
  dialogFormVisible.value = false;
}
async function handlerConfirm() {
  // 在发请求之前,对整个表单进行校验
  // 如果校验全部通过,再执行后面的语句
  await formRef.value.validate();

  let result = await reqAddOrUpdateTrademark(trademarkParms);
  // 品牌添加/修改成功
  if (result.code === 200) {
    dialogFormVisible.value = false;
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParms.id ? '品牌修改成功' : '品牌添加成功',
    });
    // 再次获取品牌列表
    if (trademarkParms.id) {
      currentPage.value;
      getHasTrademark();
    } else getHasTrademark();
  } else {
    dialogFormVisible.value = false;
    // 品牌添加/修改失败
    ElMessage({
      type: 'error',
      message: trademarkParms.id ? '品牌修改失败' : '品牌添加失败',
    });
  }
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

// 当下拉菜单发生变化时触发---每页显示的数据个数
function handlerSizeChange() {
  currentPage.value = 1;
  getHasTrademark();
}

// 页面挂载时获取品牌数据
onMounted(() => {
  getHasTrademark();
});

/* 
   表单校验规则
*/

// 获取el-from组件实例
let formRef = ref();

function validatorTmName(rule, value, callBack) {
  // 'blur'触发时被调用
  if (value.trim().length >= 2) {
    callBack();
  } else {
    // 校验未通过返回的错误信息
    callBack(new Error('品牌名称的长度少于两位'));
  }
}

function validatorLogoUrl(rule, value, callBack) {
  // console.log(value); // 是图片地址
  if (value) {
    callBack();
  } else {
    callBack(new Error('品牌LOGO图片未上传'));
  }
}

// 校验对象
const rules = {
  tmName: [
    {
      // required 表示字段务必校验
      required: true,
      // 触发校验规则的时机，blur失去焦点 change文本发生变化
      trigger: 'blur',
      // 校验方法
      validator: validatorTmName,
    },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};

/* 
    删除品牌
*/

const removeTrademark = async (id) => {
  console.log(666);

  // 点击确认按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id);
  console.log(result);

  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    });
    // 删除后再次获取品牌数据
    getHasTrademark();
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    });
  }
};
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
