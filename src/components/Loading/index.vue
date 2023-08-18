<template>
  <div
    v-if="loadingdom"
    v-loading="isLoading"
    element-loading-text="数据正在加载中"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// const emit = defineEmits(['selected'])
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

// const changeIndex = (index) => {
//   // activeIndex.value = index
//   emit('selected', index)
// }
const loadingdom = ref(true)
</script>

<style lang="less" scoped>
.el-loading-parent--relative {
  height: 100% !important;
}
:deep(.el-loading-spinner .el-loading-text){
  font-size: 12px;
}
</style>
