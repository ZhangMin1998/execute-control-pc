<template>
  <div class="exe_info_wrap">
    <i
      class="iconfont icon-icon_close"
      title="关闭"
      @click="closeExeInfoWindow"
    ></i>
    <img
      src="@/assets/images/logo.png"
      alt=""
    >
    <div class="exe_name">触警消息客户端</div>
    <div class="version">版本：1.0.0-Release/01110001</div>
    <!-- <div class="notice">版权公告：2022-2023 广道数字 版权所有</div> -->
  </div>
</template>

<script lang="ts" setup>
function closeExeInfoWindow (): void {
  (window as any).app.exeInfoWinClose()
}
</script>

<style lang="less" scoped>
.exe_info_wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: @background-color-2;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.16);
  -webkit-app-region: drag;
  .icon-icon_close {
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 12px;
    color: @text-color-4;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
  img {
    width: 48px;
    height: 48px;
    margin-bottom: 15px;
  }
  .exe_name {
    font-size: 14px;
    line-height: 16px;
    color: @text-color-2;
    margin-bottom: 14px;
  }
  .version {
    font-size: 14px;
    color: @text-color-2;
    line-height: 14px;
    margin-bottom: 6px;
  }
  .notice {
    font-size: 12px;
    line-height: 12px;
    color: @text-color-5;
  }
}
</style>