<template>
  <el-card>
    <el-table :data="skuArr" border style="margin: 10px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        show-overflow-tooltip
        width="240px"
      ></el-table-column>
      <el-table-column label="图片" width="140px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            style="width: 100px; height: 100px; background-size: cover"
            alt="SKU图片"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量(g)"
        width="180px"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格($)"
        width="180px"
      ></el-table-column>
      <!-- // - 操作按钮 -->
      <el-table-column label="操作" fixed="right" width="205px">
        <template #="{ row, $index }">
          <el-button
            @click="updateSale(row)"
            :type="row.isSale === 1 ? 'danger' : 'warning'"
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button
            type="success"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <!-- // - 删除按钮 -->
          <el-popconfirm
            width="160px"
            :title="`你确定要删除${row.skuName}品牌吗?`"
            @confirm="removeSku(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"> </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- // - 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />

    <!-- // - 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  style="height: 100%; width: 100%; background-size: cover"
                  alt="品牌图片"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku';
import { ElMessage } from 'element-plus';

// - 分页器当前页码
let pageNo = ref(1);
// - 一页展示多少商品
let pageSize = ref(10);
// - 总数
let total = ref(0);
let skuArr = ref([]);

// - 控制抽屉显示与隐藏
let drawer = ref(false);

// - 商品信息
let skuInfo = ref([]);

// *页码挂载捞一次数据
onMounted(() => {
  getHasSku();
});
async function getHasSku(pager = 1) {
  // .当前分页器的页码  pager是默认接收的参数 --- 当前页码
  pageNo.value = pager;
  let result = await reqSkuList(pageNo.value, pageSize.value);
  console.log(result);
  if (result.code === 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }
}

// *分页器切换一页展示数量的时候触发
function handler() {
  getHasSku();
}

// *商品上架与下架
async function updateSale(row) {
  // .isSale===1 商品是上架状态
  if (row.isSale === 1) {
    // #下架操作
    let result = await reqCancelSale(row.id);
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: '下架成功',
      });
      getHasSku(pageNo.value);
    } else
      ElMessage({
        type: 'error',
        message: '下架失败',
      });
  } else {
    let result = await reqSaleSku(row.id);
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: '上架成功',
      });
      getHasSku(pageNo.value);
    } else
      ElMessage({
        type: 'error',
        message: '上架失败',
      });
  }
}

// *编辑已有SKU
function updateSku() {
  ElMessage({
    type: 'warning',
    message: '暂未开放......',
  });
}

// *查看SKU详情
async function findSku(row) {
  // .抽屉展示出来
  drawer.value = true;
  // .获取商品信息
  let result = await reqSkuInfo(row.id);
  if (result.code === 200) {
    skuInfo.value = result.data;
  }
}

// *删除按钮--删除SKU
async function removeSku(row) {
  let result = await reqDeleteSku(row.id);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    });
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '系统数据不能删除',
    });
  }
}
</script>

<style scoped lang="scss">
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
