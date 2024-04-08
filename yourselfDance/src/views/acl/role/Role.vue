<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input
            v-model="keyword"
            placeholder="请你输入搜索职位的关键字"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="search"
            :disabled="keyword ? false : true"
            type="primary"
          >
            搜索
          </el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" @click="handlerAddRole">
        添加职位
      </el-button>
      <el-table
        :data="allRole"
        show-overflow-tooltip
        border
        style="margin: 10px 0"
      >
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="职位名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="updateTime"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="265px">
          <template #="{ row, $index }">
            <el-button
              @click="setPermisstion(row)"
              size="small"
              type="primary"
              icon="User"
            >
              分配权限
            </el-button>
            <el-button
              size="small"
              icon="Edit"
              type="warning"
              @click="handlerUpdateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定要删除${row.roleName}吗?`"
              width="200px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <el-button size="small" icon="Delete" type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- //- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total "
        :total="total"
        @current-change="getHasRole"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!--//- 添加职位与更新已有职位的结构:对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="RoleParams.id ? '更新职位' : '添加职位'"
      width="500"
    >
      <el-form ref="form" :model="RoleParams" :rules="rules">
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            v-model="RoleParams.roleName"
            placeholder="请你输入职位的名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handlerSave">确定</el-button>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- //- 抽屉组件:用来分配用户权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <!--
          //- 树形控件 
              //. default-expanded-keys --- 默认展开的节点(传数组)
              //. default-checked-keys  --- 默认勾选的节点
              //. props ---配置对象
              //. default-expand-all  ---默认展开所有子节点
        -->
        <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectArr"
          :props="defaultProps"
          default-expand-all="true"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="handler">确定</el-button>
          <el-button type="danger" @click="drawer = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue';
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqDeleteRole,
} from '@/api/acl/role';
import useHomeStore from '@/stores/modules/setting';
import { ElMessage } from 'element-plus';

// -仓库数据
const homeStore = useHomeStore();

// -获取form组件实例
let form = ref();

// -搜索职位的关键字
let keyword = ref('');

// -将请求返回的数据进行存储
let allRole = ref([]); //. 存储全部已有的职位
let total = ref(0); //. 职位的总个数
const menuArr = ref([]); //. 存储用户权限的数据

// *搜索按钮的方法
const search = () => {
  getHasRole();
  keyword.value = '';
};
// *重置按钮的方法
const reset = () => {
  homeStore.reload = !homeStore.reload;
  console.log('页面被刷新了');
};

// *添加职位按钮的方法  第一个卡片组件的
const handlerAddRole = () => {
  dialogVisible.value = true;
  // .清空数据
  Object.assign(RoleParams, {
    id: 0,
    roleName: '',
  });
  // .清空遗留的校验信息
  nextTick(() => {
    form.value.clearValidate();
  });
};

// *分配权限按钮的函数表达式  第二个卡片组件的
// .树形控件配置对象
const defaultProps = {
  children: 'children', //. 指定子树为节点对象的某个属性值
  label: 'name', //. 指定节点标签为节点对象的某个属性值
};
const setPermisstion = async (row) => {
  drawer.value = true;

  // .收集当前要分类权限的职位的数据
  Object.assign(RoleParams, row);

  let result = await reqAllMenuList(RoleParams.id);
  if (result.code === 200) {
    menuArr.value = result.data;
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
};

// *编辑按钮的方法  第二个卡片组件的
const handlerUpdateRole = (row) => {
  dialogVisible.value = true;
  // .存储已有的职位
  Object.assign(RoleParams, row);
  // .清空遗留的校验信息
  nextTick(() => {
    form.value.clearValidate();
  });
};

// *删除按钮的表达式  第二个卡片组件的
const deleteRole = async (roleId) => {
  let result = await reqDeleteRole(roleId);
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '职位删除成功' });
    getHasRole(
      allRole.value.length > 1
        ? pageNo.value
        : pageSize.value > 1
        ? pageNo.value - 1
        : 1
    );
  }
};

// -分页器相关数据及逻辑
const pageNo = ref(1); //. 当前页码
const pageSize = ref(10); //. 一页几条数据
// #获取全部用户信息
const getHasRole = async (pager = 1) => {
  pageNo.value = pager;
  let result = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value
  );
  if (result.code === 200) {
    allRole.value = result.data.records;
    total.value = result.data.total;
  }
};
// #下拉菜单变化时触发,返回第一页
const handleSizeChange = () => {
  getHasRole();
};

onMounted(() => {
  getHasRole();
});

// *对话框数据及逻辑
//. 控制对话框的显示状态
let dialogVisible = ref(false);
//. 收集新增的岗位数据
let RoleParams = reactive({
  roleName: '',
});
// .弹出的对话框的确定按钮的方法
const handlerSave = async () => {
  // #表单校验通过再发请求
  await form.value.validate();
  // #添加 | 更新职位的请求
  let result = await reqAddOrUpdateRole(RoleParams);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '职位更新成功' : '职位添加成功',
    });
    dialogVisible.value = false;
    getHasRole(RoleParams.id ? pageNo.value : 1);
  } else {
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '职位更新失败' : '职位添加失败',
    });
  }
};

// !抽屉组件的相关数据及逻辑 ---用户权限分配
// -控制抽屉的显示与隐藏
const drawer = ref(false);
// -存储勾选的节点ID(第四层的)
const selectArr = ref([]);
// *通过递归获取四级数据
const filterSelectArr = (allData, initArr) => {
  allData.forEach((item) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id);
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  });
  return initArr;
};
// *抽屉组件的确认按钮
const handler = async () => {
  // .职位ID
  const roleId = RoleParams.id;
  // .选中节点的ID
  let arr = tree.value.getCheckedKeys();
  // .半选的节点ID
  let arr1 = tree.value.getHalfCheckedKeys();
  let permissionId = [...arr, ...arr1];
  let result = await reqSetPermission(roleId, permissionId);
  if (result.code === 200) {
    drawer.value = false;
    ElMessage({ type: 'success', message: '分配权限成功' });
    // .页面刷新
    window.location.reload();
  } else {
    ElMessage({ type: 'error', message: '分配权限失败' });
  }
};
// #获取树形控件的组件实例
const tree = ref();

// *职位数据校验规则
// .自定义校验规则的方法
const validatorRoleName = (rule, value, callBack) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error('职位名称至少两位'));
  }
};
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
};
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
