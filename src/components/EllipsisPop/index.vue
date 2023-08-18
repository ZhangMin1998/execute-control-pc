<template>
  <div class="value_box" :style="{ width: width }">
    <el-popover 
      :placement="placement"
      :trigger="trigger"
      :content="content"
      :disabled="showColumnTip"
      :width="popoverWidth"
    >
      <template #reference>
        <div
          class="value"
          :class="{'line_clamp': rowNum > 1}"
          :style="lineNumStyle"
          @mouseover="mouseOn($event,rowNum)"
        >
          {{ content || '--' }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

defineProps({
  content: {
    type: [String, Number],
    default: ''
  },
  rowNum: {
    type: Number,
    default: 1
  },
  placement: {
    type: String,
    default: 'top-start'
  },
  trigger: {
    type: String,
    default: 'hover'
  },
  width: {
    type: String,
    default: '100%'
  },
  popoverWidth: {
    type: String,
    default: '300px'
  }
})
const showColumnTip = ref(false)

const lineNumStyle = computed((rowNum) => {
  if (rowNum === 1) {
    return ''
  }
  if (rowNum > 1) {
    return {
      '-webkit-line-clamp': rowNum,
      'line-clamp': rowNum
    }
  }
  return ''
})

const mouseOn = (e:any, rowNum:number):void => {
  if (rowNum === 1) {
    if (e.target.scrollWidth > e.target.clientWidth) {
      showColumnTip.value = false
    } else {
      showColumnTip.value = true
    }
  }
  if (rowNum > 1) {
    if (e.target.scrollHeight > e.target.clientHeight) {
      showColumnTip.value = false
    } else {
      showColumnTip.value = true
    }
  }
}
</script>

<style lang='less' scoped>
.value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: var(--base-text-color-1);
}
.line_clamp{
  white-space: normal;
  display: -webkit-box;			//特别显示模式
  -webkit-box-orient: vertical;	//盒子中内容竖直排列
}
</style>
