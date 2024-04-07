<template>
  <div>
    <el-card style="height: 75px">
      <el-form class="form" :inline="true">
        <el-form-item label="用户名:">
          <el-input v-model="keyword" placeholder="请你输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="search"
            :disabled="keyword ? false : true"
            type="primary"
          >
            搜索
          </el-button>
          <el-button @click="reset" type="danger">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <!-- //- 添加用户与批量删除 -->
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button
        @click="deleteSelectUser"
        :disabled="selectIdArr.length ? false : true"
        type="danger"
      >
        批量删除
      </el-button>

      <!-- //- 展示用户的信息 -->
      <el-table
        show-overflow-tooltip
        style="margin: 10px 0"
        border
        :data="userArr"
        @selection-change="selectChange"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column
          align="center"
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="真实姓名"
          prop="username"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户网名"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户职位"
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

        <!--//- 操作列表:操作按钮 -->
        <el-table-column align="center" label="操作" width="270px">
          <template #="{ row, $index }">
            <el-button
              size="small"
              type="primary"
              icon="User"
              @click="setSale(row)"
            >
              分配角色
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              width="160px"
              :title="`你确定要删除${row.username}吗?`"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!--//- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11, 13]"
        :background="true"
        layout="prev, pager, next,jumper,->,sizes,total"
        :total="total"
        @current-change="getHasUser"
        @size-change="handler"
      />
    </el-card>

    <!-- // - 抽屉1:完成添加新的用户账号/更新已有的账号信息 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请您输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请您输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请您输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button type="danger" @click="cancel">取消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- // - 抽屉2:进行职位的分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配用户职位</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input disabled :placeholder="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- // - 可选职位的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="confirmClick">确定</el-button>
          <el-button type="danger" @click="drawer1 = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user';
import useHomeStore from '@/stores/modules/setting.js';
import { ElMessage } from 'element-plus';

// -默认页码
let pageNo = ref(1);
// -一页展示几条数据
let pageSize = ref(5);
// -控制抽屉的显示与隐藏
let drawer = ref(false);
let drawer1 = ref(false);

// -获取form组件实例
let formRef = ref();

// -需要存的数据
let total = ref(0);
let userArr = ref([]);
let userParams = reactive({
  username: '',
  name: '',
  password: '',
});
// #收集用户进行搜索的关键字
let keyword = ref('');

// #全部职位数据
let allRole = ref([]);
// #当前用户的职位
let userRole = ref([]);
// #存储批量删除的用户ID
let selectIdArr = ref([]);

// -职位分配 全选框 | 单选框 的状态管理
// .全选框的全选状态
let checkAll = ref(false);
// .全选框的 - 状态  量子态 ：勾与不勾的叠加态
let isIndeterminate = ref(true);
// .全选框的change事件
const handleCheckAllChange = (value) => {
  console.log(value); //  . value => boolean 全选的状态
  userRole.value = value ? allRole.value : [];
  isIndeterminate.value = false;
};
// .全部复选框的change事件
const handleCheckedCitiesChange = (value) => {
  console.log(value); // #当前选中的职位数组
  checkAll.value = value.length === allRole.value.length;
  isIndeterminate.value = value.length !== allRole.value.length;
};

// *获取用户信息
async function getHasUser(pager = 1) {
  pageNo.value = pager;
  let result = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
  if (result.code === 200) {
    total.value = result.data.total;
    userArr.value = result.data.records;
  } else ElMessage({ type: 'error', message: '用户信息获取失败' });
}
onMounted(() => {
  getHasUser();
});

// *搜索按钮的方法
const search = async () => {
  getHasUser();
  // 清空关键字
  keyword.value = '';
};

// *重置按钮的回调
let homeStore = useHomeStore();
const reset = () => {
  homeStore.reload = !homeStore.reload;
  console.log('页面被重置了');
};

// *添加用户按钮的方法
const addUser = () => {
  // .抽屉显示出来
  drawer.value = true;
  // .清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  });
  // .清空遗留的表单验证信息
  nextTick(() => {
    formRef.value.clearValidate();
  });
};

// *批量删除按钮的逻辑
// .当复选框发生变化时会触发该事件
const selectChange = (value) => {
  selectIdArr.value = value;
  console.log(selectIdArr.value);
};
// .批量删除按钮
const deleteSelectUser = async () => {
  // #整理批量删除的参数
  let idsList = selectIdArr.value.map((item) => item.id);
  // #批量删除的请求
  let result = await reqSelectUser(idsList);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功',
    });
    getHasUser();
  }
};

// *分配角色按钮的方法
const setSale = async (row) => {
  // .存储已有的用户信息
  Object.assign(userParams, row);
  // .获取全部职位的数据 + 当前用户职位的数据
  let result = await reqAllRole(row.id);
  console.log(result);
  if (result.code === 200) {
    // #存储全部的职位
    allRole.value = result.data.allRolesList;
    // #存储当前用户的职位
    userRole.value = result.data.assignRoles;
    // .抽屉显示出来
    drawer1.value = true;
  }
};

// *分配职位的方法
const confirmClick = async () => {
  // .设置参数
  let data = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => item.id),
  };
  let result = await reqSetUserRole(data);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配职位成功',
    });
    drawer1.value = false;
    // #更新完毕留在当前页
    getHasUser(pageNo.value);
  }
};

// *Edit按钮的方法
const updateUser = (row) => {
  // .抽屉显示出来
  drawer.value = true;
  // .清空数据
  Object.assign(userParams, {
    username: '',
    name: '',
    password: '',
  });
  // .清空遗留的表单验证信息
  nextTick(() => {
    formRef.value.clearValidate();
  });

  // .存储已有的账号信息
  Object.assign(userParams, row);
};

// *Delete按钮的方法
const deleteUser = async (userId) => {
  let result = await reqRemoveUser(userId);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getHasUser(userArr.value.length > 1 ? pageNo.value : 1);
  }
};

// *抽屉的确认按钮
const save = async () => {
  // .等待表单校验通过
  await formRef.value.validate();

  // .添加新用户/更新已有的用户信息
  let result = await reqAddOrUpdateUser(userParams);
  console.log(result);

  if (result.code === 200) {
    // .关闭抽屉
    drawer.value = false;
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    });
    getHasUser(userParams.id ? pageNo.value : 1);
    // #修改用户信息后,浏览器自动刷新一次,重新登录,得到新的用户名
    if (userParams.id) window.location.reload();
  } else {
    // .关闭抽屉
    drawer.value = false;
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    });
  }
};

// *抽屉的取消按钮
const cancel = () => {
  // .关闭抽屉
  drawer.value = false;
};

// *分页器下拉菜单事件
const handler = () => {
  getHasUser();
};

// *表单校验规则
const validatorUsername = (rule, value, callBack) => {
  // .用户名字长度至少5位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error('用户姓名至少五位'));
  }
};
const validatorName = (rule, value, callBack) => {
  // .用户昵称至少5位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error('用户昵称至少五位'));
  }
};
const validatorPassword = (rule, value, callBack) => {
  // .用户密码至少6位
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error('用户密码至少六位'));
  }
};
const rules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorUsername,
    },
  ],
  name: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorName,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorPassword,
    },
  ],
};
</script>

<style scoped lang="scss">
.form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
