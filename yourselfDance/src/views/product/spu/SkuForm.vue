<template>
  <el-form lable-width="120px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(￥)">
      <el-input
        v-model="skuParams.price"
        placeholder="价格(￥)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        v-model="skuParams.weight"
        placeholder="重量(g)"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        v-model="skuParams.skuDesc"
        placeholder="SKU描述"
        type="textarea"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <!-- // ! 内联样式会导致宽度显示异常 -->
          <el-select v-model="item.attrIdAndValueId" style="width: 120px">
            <el-option
              v-for="attrValue in item.attrValueList"
              :value="`${item.id}:${attrValue.id}`"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId" style="width: 120px">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :value="`${item.id}:${saleAttrValue.id}`"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table ref="table" :data="imgArr" border>
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>

        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img
              :src="row.imgUrl"
              style="width: 100px; background-size: cover"
              alt="品牌图片"
            />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>

        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button @click="handler(row)" type="primary" size="small">
              设置为默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button @click="save" type="primary">保存</el-button>
      <el-button @click="cancel" type="danger">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { reqAttr } from '@/api/product/attr';
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu';
import { ElMessage } from 'element-plus';

// -获取table组件实例
let table = ref();

// - 平台属性
let attrArr = ref([]);
// - 销售属性
let saleArr = ref([]);
// - 照片墙数据
let imgArr = ref([]);

// - 收集SKU参数
let skuParams = reactive({
  // #通过父组件传递过来的数据收集
  category3Id: 0, // .三级分类ID
  spuId: 0, // .已有SPU的ID
  tmId: 0, // . SPU品牌ID

  // #通过v-model收集
  skuName: '', // .SKU名字
  price: 0, // .sku价格
  weight: '', // .SKU重量
  skuDesc: '', // .SKU描述

  skuAttrValueList: [
    // {
    //   attrId: 0,  // .平台属性ID
    // valueId: 0,  // .属性值ID
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: 0, // .属性ID
    //   saleAttrValueId: 0, // .属性值ID
    // },
  ],
  skuDefaultImg: '', // .SKU图片地址
});

// * 设置默认图片按钮的逻辑
function handler(row) {
  // .复选框选中
  imgArr.value.forEach((item) => table.value.toggleRowSelection(item, false));
  table.value.toggleRowSelection(row, true);

  // .收集图片地址
  skuParams.skuDefaultImg = row.imgUrl;
}

// - 自定义事件的方法
let emit = defineEmits(['changeIsShow']);
function cancel() {
  emit('changeIsShow', { flag: 0, params: '' });
}

// * 保存按钮的方法
async function save() {
  console.log(666);

  // .平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev, next) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':');
      prev.push({ attrId, valueId });
    }
    return prev;
  }, []);

  // .销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
      prev.push({ saleAttrId, saleAttrValueId });
    }
    return prev;
  }, []);

  // #添加SKU请求
  let result = await reqAddSku(skuParams);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: 'SKU添加成功',
    });
    // #切换界面
    emit('changeIsShow', { flag: 0, params: '' });
  } else
    ElMessage({
      type: 'error',
      message: 'SKU添加失败',
    });
}

// * 当前子组件对外暴露的方法
async function initSkuData(c1Id, c2Id, spu) {
  // #收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;

  // .获取平台属性
  let result = await reqAttr(c1Id, c2Id, spu.category3Id);
  // .获取对应的销售属性
  let result1 = await reqSpuHasSaleAttr(spu.id);
  // .获取照片墙的数据
  let result2 = await reqSpuImageList(spu.id);

  // #存储平台属性
  attrArr.value = result.data;
  // #存储销售属性
  saleArr.value = result1.data;
  // #存储照片墙数据
  imgArr.value = result2.data;
}
defineExpose({ initSkuData });
</script>

<style scoped lang="scss"></style>
