<template>
  <div class="container">
    <div
      v-for="(item, index) in pages"
      :key="index"
      :class="{ item: true }"
      @click="changeIndex(index)"
    >
      <div class="inner-container">
        <i class="iconfont icon-icon_selected_message"></i>
        <el-badge
          v-if="userInfoStore.warnTotal && userInfoStore.hasPermission"
          :value="userInfoStore.warnTotal"
          :max="999"
          class="badge"
        >
        </el-badge>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/userInfo'

const userInfoStore = userStore()
const emit = defineEmits(['selected'])
defineProps({
  pages: {
    type: Array,
    default: () => []
  }
})
const changeIndex = (index: any):void => {
  // activeIndex.value = index
  emit('selected', index)
}
// console.log(pages)
</script>

<style lang="less" scoped>
.container {
  -webkit-app-region: no-drag;
  user-select: none;

  .item {
    cursor: pointer;
    .inner-container{
      position: relative;
      width: 30px;
      text-align: center;
      // background-color: pink;
      .badge {
        position: absolute;
        margin-top: -5px;
        margin-right: -5px;
        right: 0;
      }

      :deep(.el-badge__content) {
        // position: absolute;
        background: #ff3d3d;
        color: #ffffff;
        font-size: 8px;
        padding: 0 4px;
        border: 0px;
        height: 12px;
        right: 0;
        top: 0;
        // margin-right: 7px;
        // margin-top: 3px;
      }

      .iconfont {
        font-size: 26px;
        color: #0f8fff;
      }
    }
  }
}
</style>
