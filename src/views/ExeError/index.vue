<template>
  <div class="exe_Error">
    <div class="header">
      <div class="title">提示</div>
      <div class="opera">
        <!-- <i class="iconfont icon-icon_zuixiaohua" title="最小化" @click="minWindow"></i> -->
        <i class="iconfont icon-icon_close" title="关闭" @click="closeWindow"></i>
      </div>
    </div>
    <div class="content">
      <div class="info">
        <span>您的账号在其他地点登录，本次登录已失效。</span>
      </div>
      <div class="button_box">
        <div class="button" @click="closeWindow">
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

function closeWindow(): void {
  window.app.exeErrorClose()
}
// function minWindow(): void {
//   win.app.exeQuitWinClose()
// }
</script>

<style lang="less" scoped>
.exe_Error {
  width: 100%;
  height: 100%;
  background: @background-color-1;
  -webkit-app-region: no-drag;
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 4px 8px;
    line-height: 14px;
    color: @text-color-3;
    .opera {
      display: flex;
      -webkit-app-region: no-drag;
      i {
        font-size: 12px;
        color: @text-color-4;
        cursor: pointer;
        margin-left: 12px;
      }
    }
  }
  .content {
    width: 100%;
    padding: 36px 30px 40px;
    .info {
      display: flex;
      width: 100%;
      // padding: 18px;
      font-size: 14px;
      text-align: center;
      
    }
    .button_box{
      margin-top: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      .button{
        cursor: pointer;
        color: #ffffff;
        padding: 4px 18px 4px 18px;
        background-color: #409eff;
      }
    }
  }
}
</style>