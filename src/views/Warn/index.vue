<template>
  <div class="container">
    <!-- <LeftCard ref="LeftCardRef"></LeftCard> -->
    <LeftCard ref="LeftCardRef" @open-detail="openDetail"></LeftCard>
    <RightCard :id="id" ref="RightCardRef" @get-newlist="getNewList" @close-left-menu="closeLeftMenu"></RightCard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { userStore } from '@/store/userInfo'
import LeftCard from '@/views/Warn/components/LeftCard.vue'
import RightCard from '@/views/Warn/components/RightCard.vue'

const store = userStore()
const id = ref(0)
const LeftCardRef = ref()
const RightCardRef = ref()

const openDetail = (e:number):void => {
  id.value = e
  RightCardRef.value?.getDetail(id.value)
}
const getNewList = async():Promise<void> => {
  // eslint-disable-next-line
  const allMaxUpdateTime = await window.app.windowGetData(store.userBaseInfo.username + '.data.allMaxUpdateTime')
  // console.log(allMaxUpdateTime)
  LeftCardRef.value?.getNewNotification(allMaxUpdateTime)
}
const closeLeftMenu = async():Promise<void> => {
  LeftCardRef.value?.clockMenu()
}
</script>

<style lang="less" scoped>
.container {
  // background: #F1F2F3;
  height: 100%;
  display: flex;
  // overflow: hidden;
  // overflow-y: scroll;
}
</style>