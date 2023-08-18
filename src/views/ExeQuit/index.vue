<template>
  <div class="exe_quit_wrap">
    <div class="header">
      <div class="title">账号信息</div>
      <div class="opera">
        <!-- <i class="iconfont icon-icon_zuixiaohua" title="最小化" @click="minWindow"></i> -->
        <i class="iconfont icon-icon_close" title="关闭" @click="closeWindow"></i>
      </div>
    </div>
    <div class="content">
      <div class="user_info">
        <img src="@/assets/images/head-picture.jpeg" alt="" />
        <div class="info">
          <div class="item">
            <div class="label">用户账号：</div>
            <div class="value ellipsis">{{ userInfoStore.userBaseInfo.username || '--' }}</div>
          </div>
          <div class="item">
            <div class="label">警员编号：</div>
            <div class="value ellipsis">{{ userInfoStore.userBaseInfo.jobNumber || '--' }}</div>
          </div>
          <div class="item">
            <div class="label">真实姓名：</div>
            <div class="value ellipsis">{{ userInfoStore.userBaseInfo.realName || '--' }}</div>
          </div>
          <div class="item">
            <div class="label">系统角色：</div>
            <div class="value ellipsis">{{ userInfoStore.sysRole || '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/userInfo'

const win = window as any
const userInfoStore = userStore()

function closeWindow(): void {
  win.app.exeQuitClose()
}
// function minWindow(): void {
//   win.app.exeQuitWinClose()
// }
</script>

<style lang="less" scoped>
.exe_quit_wrap {
  width: 100%;
  height: 100%;
  background: @background-color-2;
  -webkit-app-region: drag;
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
    padding: 36px 40px 40px;
    .user_info {
      display: flex;
      width: 100%;
      padding: 18px;
      background: @background-color-1;
      img {
        width: 38px;
        height: 38px;
        margin-right: 12px;
        flex: none;
      }
      .info {
        flex: 1;
        width: calc(100% - 50px);
        font-size: 12px;
        line-height: 16px;
        color: @text-color-2;
        margin-top: 2px;
        .item {
          display: flex;
          width: 100%;
          margin-bottom: 12px;
          .label {
            width: 65px;
            margin-right: 4px;
            color: @text-color-5;
          }
          .value {
            width: calc(100% - 55px);
          }
        }
        .item:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
