<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          v-model="SpuParams.spuName"
          placeholder="请你输入SPU名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU品牌">
        <el-select v-model="SpuParams.tmId">
          <el-option
            v-for="item in AllTradeMark"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          v-model="SpuParams.description"
          type="textarea"
          placeholder="请你输入SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU照片">
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            style="width: 100%; height: 100%"
            alt="Preview Image"
          />
        </el-dialog>
      </el-form-item>

      <el-form-item label="SPU销售属性">
        <el-select
          v-model="saleAttrAndValueName"
          :placeholder="
            unSelectSaleAttr.length
              ? `还未选择${unSelectSaleAttr.length}个`
              : '暂无数据可选择'
          "
          style="width: 150px; margin-right: 10px"
        >
          <el-option
            v-for="item in unSelectSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button
          @click="addSaleAttr"
          :disabled="saleAttrAndValueName ? false : true"
          type="primary"
          icon="Plus"
        >
          添加属性
        </el-button>

        <!-- 展示销售属性与属性值的地方 -->
        <el-table :data="saleAttr" border style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-tag
                v-for="item in row.spuSaleAttrValueList"
                :key="row.id"
                @close="row.spuSaleAttrValueList.splice($index, 1)"
                closable
                style="margin: 0 5px"
              >
                {{ item.saleAttrValueName }}
              </el-tag>

              <el-input
                v-if="row.flag === true"
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                placeholder="请你输入属性值"
                size="small"
                style="width: 100px"
              ></el-input>
              <el-button
                v-else
                @click="toEdit(row)"
                size="small"
                icon="Plus"
                type="primary"
              ></el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                @click="saleAttr.splice($index, 1)"
                type="danger"
                size="small"
                icon="Delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saleAttr.length > 0 ? false : true"
          @click="save"
          type="primary"
        >
          保存
        </el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu';
import { ElMessage } from 'element-plus';

let emit = defineEmits(['changeIsShow']);
// 取消按钮
function cancel() {
  emit('changeIsShow', { flag: 0, params: 'update' });
}

// 属性值按钮的点击事件
function toEdit(row) {
  // 进入编辑模式
  row.flag = true;
  // 收集用户填写的销售属性值
  row.saleAttrValue = '';
}

// input框失去焦点,收集用户填写的销售属性
function toLook(row) {
  // 整理成服务器需要的数据格式
  const { baseSaleAttrId, saleAttrValue } = row;
  console.log('**********', row);
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  };

  // bug处理 --- 空串
  if (saleAttrValue.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    });
    return;
  }

  // bug处理 --- 属性值是否重复
  let repeat = row.spuSaleAttrValueList.find(
    (item) => item.saleAttrValueName === saleAttrValue
  );
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    });
    return;
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue);

  // 切换为查看模式
  row.flag = false;
}

// 存储已有的品牌数据
let AllTradeMark = ref([]);
// 存放品牌图片
let imgList = ref([]);
// 已有品牌的销售属性
let saleAttr = ref([]);
// 全部销售属性
let allSaleAttr = ref([]);

// 当前 SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name !== item1.saleAttrName;
    });
  });
  return unSelectArr;
});

// 收集还未选择的销售属性的 ID与属性值
let saleAttrAndValueName = ref('');

// 添加销售属性
function addSaleAttr() {
  console.log(666);

  const [baseSaleAttrId, saleAttrName] = saleAttrAndValueName.value.split(':');

  let newSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };

  // 追加到数组当中
  saleAttr.value.push(newSaleAttr);

  // 清空收集的数据
  saleAttrAndValueName.value = '';
}

// 存储已有的 SPU对象
let SpuParams = ref({
  category3Id: 0,
  spuName: '',
  description: '', // SPU 描述
  tmId: 0, // 品牌 ID
  spuImageList: [],
  spuSaleAttrList: [],
});

async function initHasSpuData(spu) {
  //   spu 父组件传递过来的已有的 spu对象
  SpuParams.value = spu;

  //   全部品牌的数据
  let result = await reqAllTradeMark();
  console.log(result);

  //   某个品牌的图片
  let tradeMarkImg = await reqSpuImageList(spu.id);
  console.log(tradeMarkImg);

  //   获取销售属性
  let result2 = await reqSpuHasSaleAttr(spu.id);
  console.log(result2);

  //   获取全部销售属性
  let result3 = await reqAllSaleAttr();
  console.log(result3);

  //   存储数据
  AllTradeMark.value = result.data;
  imgList.value = tradeMarkImg.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  saleAttr.value = result2.data;
  allSaleAttr.value = result3.data;
}

// 照片墙预览时执行的函数
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}
// 照片墙删除时执行的函数
function handleRemove() {
  console.log(666);
}
// 预览框
let dialogVisible = ref(false);
// 预览的图片
let dialogImageUrl = ref('');

// 保存按钮
async function save() {
  // 整理参数
  // 1-照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  console.log(SpuParams.value.spuImageList);

  // 2-销售属性数据
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  console.log(SpuParams.value.spuSaleAttrList);

  // 发请求
  let result = await reqAddOrUpdateSpu(SpuParams.value);

  // 成功 | 失败
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    });

    emit('changeIsShow', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    });
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    });
  }
}

// 添加一个新的 SPU 初始化请求
async function initAddSpu(c3Id) {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: 0,
    spuName: '',
    description: '', // SPU 描述
    tmId: 0, // 品牌 ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  // 清空照片墙
  imgList.value = [];
  // 清空销售属性
  saleAttr.value = [];
  saleAttrAndValueName.value = '';

  // 存储三级分类的 ID
  SpuParams.value.category3Id = c3Id;

  // 获取全部品牌的数据
  let result = await reqAllTradeMark();
  // 获取所有销售属性的数据
  let result1 = await reqAllSaleAttr();

  // 存储数据
  AllTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
}

defineExpose({ initHasSpuData, initAddSpu });
</script>

<style scoped lang="scss"></style>
