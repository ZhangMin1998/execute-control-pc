<template>
  <div class="newMessage">
    <div class="title">
      新消息<span>{{ '（' + total + '）' }}</span>
    </div>
    <div class="message_box">
      <div v-for="(item, index) in msgList" :key="index" class="message_content" @click="itemClick(item.configId)">
        <div class="name">
          <EllipsisPop :content="item.name" :row-num="1" width="140px" :popover-width="'210px'"></EllipsisPop>
        </div>
        <div class="total">
          <el-badge
            :value="item.total"
            :max="999"
            class="badge"
          ></el-badge>
        </div>
      </div>
    </div>
    <div class="footer">
      <span @click="stopTrayTwinkle">忽略全部</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
// import { userStore } from '@/store/userInfo'
// import mitt from 'mitt'

// const store = userStore()
// const emitter = mitt()
const win = window as any
const msgList:any = ref([])
const total = ref(0)

onMounted(async() => {
  window.app.showMessage((e:any, list:any) => {
    // console.log(list.lenght)
    total.value = 0
    list.forEach((item:any) => {
      total.value += item.total
    })
    msgList.value = msgList.value.slice(0, 0)
    nextTick(() => {
      msgList.value = list
      // console.log(msgList.value)
    })
  })
})

const itemClick = (configId:number):void => {
  // console.log(configId, emitter)
  // store.setClickConfigId(configId)
  // emitter.emit('clickConfigId', configId)
  win.app.openWindow(configId)
  msgList.value = msgList.value.slice(0, 0)
}

// 忽略全部 停止闪烁
const stopTrayTwinkle = ():void => {
  // console.log('忽略全部 停止闪烁')
  win.app.stopTrayTwinkle()
  msgList.value = msgList.value.slice(0, 0)
}
// emitter.on('clickConfigId', (e):void => {
//   console.log(66666, e)
// })
</script>

<style lang="less" scoped>
.newMessage {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px 0px 0 0px;
  background: #f5f5f5;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.16);
  -webkit-app-region: no-drag;
  .title{
    height: 36px;
    font-size: 12px;
    padding: 0 11px 0 16px;
    color: #353535;
    font-weight: bold;
  }
  .message_box{
    // height: 235px;
    height: 100%;
    overflow: auto;
    // overflow-y: scroll;
    .message_content{
      padding: 0 11px 0 16px;
      border-bottom:1px solid #ebebeb;
      // background-color: pink;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      -webkit-app-region: no-drag;
      cursor: pointer;
      .name{
        font-size: 12px;
        color: #000000;
        font-weight: bold;
      }
      .total{
        user-select: none;
        .badge{
          margin-top: 12px;
        }
        :deep(.el-badge__content) {
          background: #ff3d3d;
          color: #ffffff;
          font-size: 12px;
          padding: 0 6px;
          border: 0px;
          height: 16px;
        }
      }
    }
    .message_content:hover{
      background-color: #e2e2e2;
    }
  }
  .footer{
    height: 44px;
    font-size: 12px;
    padding: 0 15px 0 16px;
    border-top: 1px solid #dcdcdc;
    color:#409eff;
    display: flex;
    justify-content: end;
    align-items: center;
    span{
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
  }
  // .exe_name {
  //   font-size: 12px;
  //   line-height: 16px;
  //   color: @text-color-2;
  //   margin-bottom: 14px;
  // }
}
</style>