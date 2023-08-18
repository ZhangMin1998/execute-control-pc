<template>
  <Loading v-model:isLoading.sync="isLoading">
    <div v-if="true" id="container" class="container" @scroll="scrollevent">
      <message-list name="unTreatedList" :content-list="state.showList" @search="reSearchList"></message-list>
      <!-- <div>------------这是一条分界线------------</div> -->
      <!-- <message-list name="treatedList" :content-list="state.treatedList"></message-list> -->
      <!-- <div v-if="loading" class="loading">
        <div v-loading="loading" style="height:20px;margin: 20px 0;"></div>
      </div> -->
    </div>
    <div v-else class="empty">
      <el-empty description="暂无数据" />
    </div>
  </Loading>  
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { getHistoryMessage } from '@/api/warn'
import { filterSTN, filterTime } from '@/utils/timeFilter'
import { userStore } from '@/store/userInfo'
import MessageList from '@/views/Warn/components/MessageList.vue'
import Loading from '@/components/Loading/index.vue'
// import { ElMessage } from 'element-plus'
const { proxy: { $forceUpdate } }: any = getCurrentInstance()
const props = defineProps({
  id: {
    type: Number,
    default: 1
  }
})
// console.log(props.id, 111)
const emit = defineEmits(['getNewlist', 'closeLeftMenu'])

const store = userStore()
// const emit = defineEmits(['reSearchList'])

const isLoading = ref(false)
const state = reactive({
  unTreatedList: [], // 未处理列表
  treatedList: [], // 已处理列表
  all: [], // 全部的
  showList: [] // 显示的
})
const pageData = reactive({
  curPage: 1,
  pageSize: 30,
  total: 0
})
// let unTreatedList:any[] = reactive([]) // 未处理列表
// let treatedList:any[] = reactive([]) // 已处理列表
let allList:any[] = [] // 左边对话框列表
let configId = 0
let createTime = 0
// let allMaxUpdateTime = 0 // 172行用
const isLast = ref(false)
const loading = ref(false)

onMounted(async () => {
  document.addEventListener('click', () => {
    // console.log(e)
    emit('closeLeftMenu')
  })
  if (props.id) getDetail(props.id)
  // const data = await window.app.windowGetData('data.warn')
  // allMaxUpdateTime = await window.app.windowGetData('data.allMaxUpdateTime')
  // // console.log(data)
  // if (data) {
  //   allList = JSON.parse(JSON.stringify(data))
  // }
})

// 数据处理成前端需要的
const dataHandle = (list:any[]):any[] => {
  list.forEach((obj:any) => {
    obj.isHandle = obj.handleStatus === 'processed'
    obj.belongPolice = `${ obj.contactPolice }/${ obj.contactPolicePhone }`
    obj.createTimeCn = filterTime(filterSTN(obj.createTime))
    obj.createTimeStamp = filterSTN(obj.createTime)

    store.traceLabelList.forEach((e:any) => {
      if (e.labelNameEn === obj.triggerLabelNameEn) {
        // eslint-disable-next-line
        obj.triggerLabelNameCn = e.labelNameEn === 'avatar_url' ? e.labelName :   e.labelName + '/' + obj.triggerAttr
        // obj.triggerLabelNameCn = e.labelName + obj.id // 先拼接上id 方便查找 后面再把id删了
      }
    })
    store.dataTypeList.forEach((e:any) => {
      if (e.srcNameEn === obj.triggerDataSource) {
        obj.triggerDataSourceCn = e.srcNameCn
      }
    })
    const levelList = [
      {
        label: '一般',
        value: 'general'
      },
      {
        label: '普通',
        value: 'normal'
      },
      {
        label: '严重',
        value: 'serious'
      }
    ]
    // const timeList = [
    //   {
    //     label: '长期有效',
    //     value: 'all'
    //   },
    //   {
    //     label: '指定时间',
    //     value: 'specific'
    //   }
    // ]
    levelList.forEach((e:any) => {
      if (obj.configVO.level === e.value) {
        obj.configVO.levelCn = e.label
      }
    })
    // timeList.forEach((e:any) => {
    //   if (obj.configVO.timeSelectFlag === e.value) {
    //     obj.configVO.timeSelectFlagCn = e.label
    //   }
    // })
    if (obj.configVO.timeSelectFlag === 'all') {
      obj.configVO.timeSelectFlagCn = '长期有效'
    } else if (obj.configVO.timeSelectFlag === 'specific') {
      // eslint-disable-next-line
      obj.configVO.timeSelectFlagCn = obj.configVO.timeStart + '至' + obj.configVO.timeEnd
    }
    obj.configVO.regionSelectFlagCn = (obj.configVO.regionSelectFlag === 'all') ? '全区域' : (obj.configVO.regionAccessType === 'inner' ? '指定区域-禁止进入（布控区域内部）' : '指定区域-禁止离开（布控区域外部）')
    if (obj.configVO.dataTypeSelectFlag === 'specific') {
      const dataTypeList:any = []
      obj.configVO.dataTypeList?.forEach((_c:string) => {
        store.dataTypeList.forEach((e:any) => {
          if (_c === e.srcNameEn) {
            dataTypeList.push(e.srcNameCn)
          }
        })
      })
      obj.configVO.dataTypeSelectFlagCn = dataTypeList.join(',')
    } else if (obj.configVO.dataTypeSelectFlag === 'all') {
      obj.configVO.dataTypeSelectFlagCn = '全部数据'
    }
  })
  return list
}

const getDetail = async(id:number):Promise<void> => {
  if (id === -1) {
    state.showList = []
    return
  }
  // eslint-disable-next-line
  const data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
  // eslint-disable-next-line
  // allMaxUpdateTime = await window.app.windowGetData(store.userBaseInfo.username + '.data.allMaxUpdateTime')
  if (data) {
    allList = JSON.parse(JSON.stringify(data))
  }
  
  // 每次切换对话框的时候让滚动条还原
  const scrollDom = document.getElementById('container')
  if (scrollDom !== null) {
    scrollDom.scrollTop = 0
  }
  // console.log(props.id, id)
  isLoading.value = true
  nextTick(() => {
    allList.forEach((item:any) => {
      if (Number(item.code) === id) {
        // console.log(item)
        configId = item.configId
        createTime = item.minCreateTime > 0 ? item.minCreateTime : Date.now()
        isLast.value = false
        state.unTreatedList = []
        state.treatedList = []
        state.all = []
        state.showList = []
        pageData.curPage = 1
        pageData.total = 0
        if (item.unTreatedList.length) {
          item.unTreatedList = dataHandle(item.unTreatedList)
          // nextTick(() => {
          state.unTreatedList = JSON.parse(JSON.stringify(item.unTreatedList))
          $forceUpdate()
          // })
        }
        if (item.treatedList.length) {
          item.treatedList = dataHandle(item.treatedList)
          // nextTick(() => {
          state.treatedList = JSON.parse(JSON.stringify(item.treatedList))
          $forceUpdate()
          // })
        }
      }
    })
    state.all = state.unTreatedList.concat(state.treatedList)
    pageData.total = state.all.length
    // 先给30条显示
    state.showList = state.all.slice(
      (pageData.curPage - 1) * pageData.pageSize,
      pageData.curPage * pageData.pageSize
    )
    isLoading.value = false
  })
}
const scrollevent = async(e:any):Promise<void> => {
  if ((e.srcElement.scrollTop) + e.srcElement.clientHeight === e.srcElement.scrollHeight) {
    console.log('已滚动到最底部', isLast.value)
    if (state.showList.length < pageData.total) {
      state.showList = state.showList.concat(state.all.slice((pageData.curPage) * 30, (pageData.curPage + 1) * 30))
      pageData.curPage++
    } else {
      const flag = ref(true)
      if (flag.value) {
        setTimeout(() => {
          allList.forEach((item:any) => {
            if (item.configId === configId && !item.isLast) { // 判断有没有历史记录了
              // console.log(item, item.isLast)
              getHistoryList()
            }
            // if (item.configId === configId && item.isLast) {
            //   ElMessage('没有历史记录')
            // }
          })
        }, 1200)
      }
      flag.value = false
    }
  }
}
// 查询历史记录
const getHistoryList = async():Promise<void> => {
  loading.value = true
  getHistoryMessage(configId, createTime).then((res:any) => {
    // console.log(res)
    let temp:any = reactive([])
    temp = dataHandle(res.content)
    
    if (res.content.length) {
      state.treatedList = JSON.parse(JSON.stringify(temp))
      state.all = state.unTreatedList.concat(state.treatedList)
      state.showList = state.showList.concat(temp)
      allList.forEach((item:any) => {
        if (item.configId === configId) {
          item.minCreateTime = filterSTN(res.content[res.content.length - 1].createTime)
          createTime = item.minCreateTime
          item.treatedList = item.treatedList.concat(res.content)
          if (res.totalSize <= 10) {
            item.isLast = true
            isLast.value = true
          } else {
            item.isLast = false
            isLast.value = false
          }
        }
      })
      // eslint-disable-next-line
      window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', allList)
    }
    if (res.totalSize === 0) {
      allList.forEach((item:any) => {
        if (item.configId === configId) {
          item.isLast = true
          isLast.value = true
        }
      })
      // eslint-disable-next-line
      window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', allList)
      // ElMessage('没有历史记录')
    }
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
}

const reSearchList = ():void => {
  emit('getNewlist')
}
defineExpose({
  getDetail
})
</script>

<style lang="less" scoped>
.container{
  width: calc(100vw - 333px);
  height: calc(100vh - 35px);
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  background-color: #F1F2F3;
  // background-image: url('@/assets/images/logo-grey.png');
  background-repeat: no-repeat;
  background-position: center center;
  overflow: hidden;
  overflow-y: scroll;
  padding: 9px 33px 0px 26px;
  // -webkit-app-region: drag;
  // .content_box{
  //   padding: 0 0 20px 0;
  //   .time_box{
  //     font-size: 9px;
  //     color: #A3A4A6;
  //     text-align: center;
  //   }
  //   .card{
  //     position: relative;
  //     margin-top: 3px;
  //     width: 352px;
  //     height: 263px;
  //     background: #FFFFFF;
  //     border-radius: 4px;
  //     padding: 8px 10px;
  //     display: flex;
  //     // -webkit-app-region: no-drag;
  //     .handleImg{
  //       width: 40.71px;
  //       height: 35.64px;
  //       position:absolute;
  //       right:10px;
  //       top:10px;
  //     }
  //     // .left{
  //     //   .img{
  //     //     width: 64px;
  //     //     height: 64px;
  //     //   }
  //     // }
  //     .right{
  //       margin-left: 8px;
  //       font-size: 12px;
  //       // line-height: 13px;
  //       color: #171A1D;
  //       .flex{
  //         margin-bottom: 9px;
  //         display: flex;
  //         // .label{

  //         // }
  //         // .value{

  //         // }
  //         .address{
  //           .addressValue{
  //             margin-left: 4px;
  //             color: #0F8FFF;
  //             font-size: 12px;
  //             cursor: pointer;
  //           }
  //           .youzuobiaoColor{
  //             color: #0F8FFF;
  //           }
  //           .wuzuobiaoColor{
  //             color: #6d6e70;
  //           }
  //         }
  //         .iconfont{
  //           font-size: 12px;
  //         }
  //         .level{
  //           width: 32px;
  //           height: 16px;
  //           color: #FFFFFF;
  //           text-align: center;
  //           line-height: 16px;
  //           margin-top: -3px;
  //         }
  //         .general{
  //           background: #0F8FFF;
  //         }
  //         .normal{
  //           background: #FFC53D;
  //         }
  //         .serious{
  //           background: #FF3D3D;
  //         }
  //         :deep(.el-switch--small) {
  //           height: 10px;
  //         }
  //         :deep(.el-switch--small .el-switch__core) { 
  //           min-width: 23px;
  //           height: 12px;
  //           margin-top: -1px;
  //         }
  //         // :deep(.el-switch__core::after) { width: 10px; height: 10px; margin-top: -1px; }
  //         // :deep(.el-switch.is-checked .el-switch__core::after){ margin-left: -15px; }
  //         :deep(.el-switch--small .el-switch__core .el-switch__action){
  //           width: 10px;
  //           height: 10px;
  //         }
  //         :deep(.el-switch--small.is-checked .el-switch__core .el-switch__action){
  //           left: calc(100% - 11px);
  //         }
  //       }
  //       .splitLine{
  //         width: 187px;        
  //         height: 1px;
  //         margin-bottom: 8px;
  //         background: #ECEDEE;
  //       }
  //     }
  //   }
  // }
}
.empty{
  width: calc(100vw - 333px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
// :deep(.el-loading-mask){
//   width: calc(100vw - 333px);
// }
</style>