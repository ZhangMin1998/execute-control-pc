<template>
  <div class="layout_wrap">
    <div class="layout_header" :class="{'layout_header_bg':userInfoStore.isLogin}">
      <!-- 移动区域可点击 -->
      <!-- <div class="layout_header_click"></div> -->
      <div class="button_box">
        <i class="iconfont icon-icon_zuixiaohua" title="最小化" @click="minWindow"></i>
        <i
          v-if="userInfoStore.isLogin"
          :class="isMax ? 'iconfont icon-icon_zuixiaohua1' : 'iconfont icon-icon_zuixiaohua-1'"
          :title="isMax ? '向下还原' : '最大化'"
          @click="maxWindow"
        ></i>
        <i class="iconfont icon-icon_close" title="关闭" @click="closeWindow"></i>
      </div>
    </div>
    <div class="layout_main_content">
      <router-view></router-view>
    </div>
    <div v-if="userInfoStore.isLogin" class="sys_opera" @click="handleOpera"></div>
    <div v-if="isShowOpera" class="sys_opera_lab">
      <div class="base_info">
        <div class="head"></div>
        <div class="info">
          <div class="account_name ellipsis">{{ userInfoStore.userBaseInfo.realName || '--' }}</div>
          <div class="account_info ellipsis">
            账号: {{ userInfoStore.userBaseInfo.username || '--' }}
          </div>
        </div>
      </div>
      <div class="opera_lab">
        <div class="lab" @click="userInfoWin">账号信息</div>
        <div class="lab" @click="aboutExe">关于客户端</div>
      </div>
      <div class="opera_lab">
        <div class="lab" @click="changId">切换账号</div>
        <div class="lab" @click="open">退出客户端</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/userInfo'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { logout, authorityById } from '@/api/login'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const userInfoStore = userStore()
const router = useRouter()
const win = window as any
const showOpera = ref(false)
const isMax = ref(false)

const open = () => {
  userInfoStore.setCloseStatus(true)
  ElMessageBox.confirm(
    '我已阅读退出后将无法收到新的消息，确定退出客户端？',
    '退出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: true,
      autofocus: true
    }
  )
  .then(() => {
    // ElMessageBox.close()
    // userInfoStore.setCloseStatus(false)
    exitWindow()
  })
  .catch(() => {
    
  })
}

/* 计算属性 */
const isShowOpera = computed(() => userInfoStore.isLogin && showOpera.value)

/* 监听 */
watch(() => userInfoStore.closeStatus, () => {
  if (!userInfoStore.closeStatus) {
    ElMessageBox.close()
  }
})

/* 方法 */
function handleOpera(): void {
  // const a = document.querySelector('.layout_header')
  // -webkit-app-region
  showOpera.value = !showOpera.value
}
// 最小化窗口
function minWindow(): void {
  win.app.windowMin()
}
// 窗口最大化
function maxWindow(): void {
  win.app.windowMax()
  isMax.value = !isMax.value
}
// 关闭窗口
function closeWindow(): void {
  // win.app.windowClose()
  if (router.currentRoute.value.path === '/login') {
    win.app.windowCloseAll()
  } else {
    win.app.windowHide()
  }
}
const exitWindow = () => {
  // win.app.windowClose()
  win.app.windowCloseAll()
  userInfoStore.changIsLogin(false)
  userInfoStore.handleUserInfo({})
}
// 关于客户端的点击事件
function aboutExe(): void {
  win.app.openExeAbout()
}
// 点击查看账号信息
function userInfoWin(): void {
  authorityById(userInfoStore.userBaseInfo.id).then((res: any) => {
    let roleStr = ''
    if (res.id == '1') {
      roleStr = '超级管理员'
    } else {
      const arr = res.userRoleList.map((item: any) => item.roleName)
      roleStr = arr.join('；')
    }
    userInfoStore.handleSysRole(roleStr)
    win.app.openExeQuit()
  })
}

function changId(): void {
  logout({ type: 'client' }).then(() => {
    showOpera.value = false
    userInfoStore.changIsLogin(false)
    userInfoStore.handleUserInfo({})
    window.app.relaunchApp()
    // 把关于客户端和账号信息的窗口关闭一下
    // win.app.changeWindowSize(360, 480, true)
    // router.push({ path: '/login' })
  })
}
function handlerClick(event: any) {
  const isSelf = document.querySelector('.sys_opera_lab')?.contains(event.target) // 这个是自己的区域
  if (!isSelf && event.target.className !== 'sys_opera') {
    showOpera.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handlerClick) // 监听 document 点击事件

  window.app.onSetMaxMinIcon((e: any, b: any) => {
    if (b === 'max') isMax.value = true
    else isMax.value = false
  })
})
onUnmounted(() => {
  document.removeEventListener('click', handlerClick)
})
</script>

<style lang="less" scoped>
.layout_wrap {
  position: relative;
  width: 100%;
  height: 100%;
  .layout_header {
    display: flex;
    height: 35px;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    line-height: 35px;
    -webkit-app-region: drag;
    position: relative;
    // .layout_header_click {
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   bottom: 0;
    //   -webkit-app-region: no-drag;
    // }
    .button_box {
      -webkit-app-region: no-drag;
      i {
        font-size: 14px;
        color: @text-color-1;
        margin-left: 16px;
        cursor: pointer;
        line-height: 1;
      }
    }
  }
  .layout_header_bg{
    background: #f1f2f3;
  }
  .layout_main_content {
    height: calc(100% - 35px);
  }
  .sys_opera {
    position: absolute;
    top: 7px;
    left: 18px;
    width: 21px;
    height: 21px;
    border-radius: 2px;
    cursor: pointer;
    background-image: url('@/assets/images/head-picture.jpeg');
    background-size: 100% 100%;
    -webkit-app-region: no-drag;
  }
  .sys_opera_lab {
    position: absolute;
    top: 32px;
    left: 6px;
    width: 180px;
    height: 226px;
    padding: 20px 10px 2px;
    background: @background-color-1;
    box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    -webkit-app-region: no-drag;
    .base_info {
      display: flex;
      margin-bottom: 20px;
      width: 100%;
      .head {
        width: 40px;
        height: 40px;
        background-image: url('@/assets/images/head-picture.jpeg');
        background-size: 100% 100%;
        margin-right: 9px;
        flex: none;
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% - 39px);
        padding: 2px 0;
        .account_name {
          width: 100%;
          font-size: 14px;
          color: @text-color-2;
        }
        .account_info {
          width: 100%;
          font-size: 12px;
          color: @text-color-3;
        }
      }
    }
    .opera_lab {
      padding: 12px 8px 12px;
      font-size: 12px;
      line-height: 18px;
      color: @text-color-2;
      border-top: 1px solid @border-color-1;
      .lab {
        cursor: pointer;
      }
      .lab:first-child {
        margin-bottom: 11px;
      }
    }
  }
}
</style>
<style style="less">
  .el-message-box {
    width: 427px !important;
    height: 164px !important;
    border-radius: 0 !important;
    padding-bottom: 4px !important;
  }
  .el-message-box__header {
    padding-left: 24px !important;
    padding-right: 16px !important;
  }
  .el-message-box__status+.el-message-box__message {
    padding-left: 26px !important;
  }
  .el-message-box .el-message-box__content{
    padding-left: 19px;
    padding-right: 0 !important;
    color: #171A1D;
  }
  .el-message-box .el-message-box__btns {
    padding-top: 26px !important;
    padding-right: 24px;
    /* padding: 27px 15px 0 !important; */
  }
  .el-message-box .el-message-box__title {
    color: #171A1D;
    font-weight: bold;
  }
  .el-icon svg {
    width: 16px !important;
    height: 16px !important;
  }
  .el-button{
    color: #171A1D !important;
    width: 74px !important;
    height: 32px !important;
  }
  .el-button--primary{
    color: #FFFFFF !important;
    background: #0089FF !important;
    width: 74px !important;
    height: 32px !important;
  }
</style>