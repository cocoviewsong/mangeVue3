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
        <el-select style="width: 120px; margin-right: 10px">
          <el-option
            v-for="(item, index) in saleAttr"
            :key="index"
            :label="item.saleAttrName"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="Plus">添加属性值</el-button>

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
                closable
                style="margin: 0 5px"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-button size="small" icon="Plus" type="primary"></el-button>
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
        <el-button type="primary">保存</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu';

let emit = defineEmits(['changeIsShow']);
// 取消按钮
function cancel() {
  emit('changeIsShow', 0);
}

// 存储已有的品牌数据
let AllTradeMark = ref([]);
// 存放品牌图片
let imgList = ref([]);
// 已有品牌的销售属性
let saleAttr = ref([]);
// 全部销售属性
let allSaleAttr = ref([]);

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

defineExpose({ initHasSpuData });
</script>

<style scoped lang="scss"></style>
