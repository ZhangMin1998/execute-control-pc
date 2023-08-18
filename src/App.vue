<script lang="ts" setup>
import { onMounted } from 'vue'
import { userStore } from '@/store/userInfo'

const userInfoStore = userStore()
onMounted(() => {
  window.app.onCloseWin(() => {
    userInfoStore.LogoutSys()
  })
  window.app.onResizeEvent((e: any, b: any) => {
    // console.log(e)
    // console.log(b)
    // eslint-disable-next-line
    const path = userInfoStore.userBaseInfo.username + '.windowLastBounds'
    window.app.windowStoreData(path, b)
  })
  document.addEventListener('click', () => { // 点击主窗口获取焦点的时候 关闭托盘提示
    // console.log('获取焦点')
    window.app.stopTrayTwinkle()
  })
})
</script>

<template>
  <router-view></router-view>
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden; // 防止滚动和元素溢出窗口
  border-radius: 0px !important;
}

@import url('./assets/css/common.less');
</style>