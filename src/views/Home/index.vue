<template>
  <div class="home">
    <el-container>
      <el-container>
        <el-aside class="el_aside">
          <Navigator
            class="navigator"
            :pages="pages"
            @selected="changePage"
          ></Navigator>
          <img
            class="imgToUrl"
            src="@/assets/images/logo.png"
            alt="公安大数据实战平台"
            title="公安大数据实战平台"
            @click="toUrl"
          >
        </el-aside>
        <el-main v-if="hasPermission" key="111" class="el_main">
          <router-view></router-view>
        </el-main>
        <el-main v-else key="222" class="el_main">
          <div class="no_permission">
            <img src="@/assets/images/lock.png" alt="">
            <span>权限不足，请联系管理员</span>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSysMenu } from '@/api/login'
import Navigator from '@/views/Home/components/Navigator.vue'
import { userStore } from '@/store/userInfo'

const store = userStore()
const router = useRouter()
const hasPermission = ref()
const pages = reactive([
  {
    name: '预警',
    icon: 'warn',
    path: '/home'
  }
  // {
  //   name: '菜单2',
  //   icon: 'warn',
  //   path: '/home2'
  // }
])
const changePage = (pageIndex:any):void => {
  router.push(pages[pageIndex].path)
}
// const toUrl = () => {
//   let a = document.createElement('a')
//   a.setAttribute('href', 'http://192.168.1.182:21992/')
//   a.setAttribute('target', '_blank')
//   //给个id,可以在触发点击事件后移除这个a链接元素
//   a.setAttribute('id', 'openPDF')
//   // 防止反复添加
//   if (document.getElementById('openPDF')) {
//     document.body.removeChild(document.getElementById('openPDF'))
//   }
//   document.body.appendChild(a)
//   //触发点击事件
//   a.click()
// }
onMounted(() => {
  getSysMenu().then((res: any) => {
    const Permission = res.menuList.filter((item: any) => item.itemName === '防控预警' && item.list.length)
    hasPermission.value = !!Permission.length
    // console.log(hasPermission.value)
    store.setHasPermission(hasPermission.value)
  })
  setTimeout(() => {
    window.app.windowSetOpacity(1)
  }, 500)
})
function toUrl ():void {
  // window.open('https://www.baidu.com')
  window.app.windowToUrl()
}
</script>

<style lang="less" scoped>
.home{
  height: calc(100% - 35px);
  border-top: 1px solid #e3e4e5;
  .el_aside{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: calc(100vh - 35px);
    width: 56px;
    padding: 9px 0 20px 0;
    background: #F0F0F0;
    -webkit-app-region: drag;
    .navigator {
      -webkit-app-region: no-drag;
    }
    img{
      width: 18px;
      height: 18px;
      cursor:pointer;
      -webkit-app-region: no-drag;
    }
  }
  .el_main{
    height: 100vh;
    width: calc(100vw - 56px);
    padding: 0 !important;
    overflow: hidden;
    .no_permission{
      height: calc(100% - 35px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 16px;
      img{
        width: 157px;
        height: 176px;
      }
      span{
        margin-top: 24px;
      }
    }
  }
}
</style>