<template>
  <div>
    <el-table
      :data="permissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row, $index }">
          <el-button
            :disabled="row.level === 4 ? true : false"
            size="small"
            icon="Plus"
            type="primary"
            @click="handlerAddPermission(row)"
          >
            {{ row.level === 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            :disabled="row.level === 1 ? true : false"
            size="small"
            icon="Edit"
            type="warning"
            @click="handlerEditPermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            @confirm="removeMenu(row)"
            :title="`你确定要删除${row.name}吗?`"
          >
            <template #reference>
              <el-button
                :disabled="row.level === 1 ? true : false"
                size="small"
                icon="Delete"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- //- 对话框组件:添加/编辑菜单数据 -->
    <el-dialog
      v-model="dialogVisible"
      :title="menuDate.id ? '更新菜单' : '添加菜单'"
    >
      <!-- //. 收集新增与已有的菜单数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input
            placeholder="请你输入菜单的名称"
            v-model="menuDate.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input
            placeholder="请你输入权限值"
            v-model="menuDate.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="savePermission"> 确认 </el-button>
          <el-button type="danger" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqDeleteMenu,
} from '@/api/acl/menu';
import { ElMessage } from 'element-plus';

// -存储菜单数据
let permissionArr = ref([]);

// -添加菜单请求所需要携带的参数
let menuDate = reactive({
  id: 0,
  code: '',
  level: 0,
  name: '',
  pid: 0,
});

// *获取全部菜单数据
const getHasPermission = async () => {
  let result = await reqAllPermission();
  if (result.code === 200) {
    permissionArr.value = result.data;
  }
};
onMounted(() => getHasPermission());

// *添加菜单按钮
const handlerAddPermission = (row) => {
  // .清空上一次遗留的数据
  Object.assign(menuDate, {
    code: '',
    level: 0,
    name: '',
    pid: 0,
  });

  dialogVisible.value = true;

  menuDate.level = row.level + 1;
  menuDate.pid = row.id;
};

// *菜单的编辑按钮
const handlerEditPermission = (row) => {
  dialogVisible.value = true;

  Object.assign(menuDate, row);
};

// *菜单的删除按钮---通过气泡框确认触发
const removeMenu = async (row) => {
  let result = await reqDeleteMenu(row.id);
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getHasPermission();
  } else {
    ElMessage({ type: 'error', message: '删除失败' });
  }
};

// *对话框组件的数据及逻辑
let dialogVisible = ref(false);
// *确认按钮的函数表达式
const savePermission = async () => {
  let result = await reqAddOrUpdateMenu(menuDate);
  if (result.code === 200) {
    dialogVisible.value = false;
    ElMessage({
      type: 'success',
      message: menuDate.id ? '修改成功' : '添加成功',
    });
    getHasPermission();
  } else {
    ElMessage({
      type: 'error',
      message: menuDate.id ? '修改失败' : '添加失败',
    });
  }
};
</script>

<style scoped lang="scss"></style>
