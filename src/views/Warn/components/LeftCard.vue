<template>
  <div class="WarnList">
    <!-- <div class="search_box">
      <el-input
        v-model="keyword"
        class="input"
        placeholder="搜索"
        :prefix-icon="Search"
        clearable
        @change="inputSearch"
        @clear="clearInput"
      >
      </el-input>
    </div> -->
    <Loading v-model:isLoading="isLoading">
      <div v-if="isShow" class="warn_box">
        <div v-if="warnList.length">
          <div
            v-for="(item, index) in warnList"
            :id="'listItem-' + index"
            :key="index"
            :class="{ 'list': true, 'isTop': item.isTop, 'isSelected': activeIndex === index }"
            @click="itemClick(index, Number(item.code), Number(item.configId))"
            @contextmenu.prevent.stop="showMenu($event, index, item.configId)"
          >
            <!-- {{ item.name }} -->
            <div
              class="all"
            >
              <div class="left">
                <div class="left_top">
                  <EllipsisPop :content="item.name" :row-num="1" width="180px"></EllipsisPop>
                </div>
                <div class="left_bottom">{{ item.code }}</div>
              </div>
              <div class="right">
                <div class="right_top">{{ filterTime(item.maxCreateTime) }}</div>
                <div
                  v-if="item.untreatedTotal"
                  class="right_bottom"
                >
                  <el-badge
                    :value="item.untreatedTotal"
                    :max="999"
                    class="badge"
                  >
                  </el-badge>
                </div>
              </div>
            </div>
            <!-- <div
              v-else
              class="filter"
            >
              <div class="top">
                <span class="name">{{ item.name }}</span>
                <span class="total">{{ '（' + item.total + '条消息' + ')' }}</span>
              </div>
              <div class="bottom">
                <div class="left">
                  <span class="data">{{ item.number }}</span>
                </div>
                <div class="right">
                  <span class="noApproved">{{ item.untreatedTotal + '条' }}</span>
                  <span class="label">未处理</span>
                </div>
              </div>
            </div> -->
          </div>
          <div v-if="isShowMenu" class="menu_box" :style="{'left': menuLeft + 'px', 'top': menuTop + 'px'}">
            <div class="menu">
              <div v-if="!isNowTop" class="menu_item item_text" @click.stop="stick(true)">置顶</div>
              <div v-else class="menu_item item_text" @click.stop="stick(false)">取消置顶</div>
              <!-- <div class="menu_item item_text" @click.stop="deleteList">删除</div> -->
              <div class="menu_item item_text" @click.stop="openDelete">删除</div>
              
              <!-- <el-popover v-model="showDelPop" placement="top" width="160" trigger="click">
                <div style="text-align: center; margin: 0">
                  <p>请确定是否删除？</p>
                  <el-button size="small" @click="showDelPop = false">取消</el-button>
                  <el-button type="primary" size="small" @click.stop="deleteList">确定</el-button>
                </div>
                <template #reference>
                  <div class="menu-item item_text" @click.stop="()=>{}">删除</div>
                </template>
              </el-popover> -->
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <el-empty description="暂无数据" />
        </div>
      </div>
    </Loading>
  </div>  
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onBeforeUnmount, reactive, getCurrentInstance, watch, computed } from 'vue'
import { userStore } from '@/store/userInfo'
// import { Search } from '@element-plus/icons-vue'
import { getFirstAllUntreatedList, getNotification } from '@/api/warn'
import { filterSTN, filterTime } from '@/utils/timeFilter'
import Loading from '@/components/Loading/index.vue'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import { ElMessageBox } from 'element-plus'
// import mitt from 'mitt'

const { proxy: { $forceUpdate } }: any = getCurrentInstance()

const emit = defineEmits(['openDetail'])
const store = userStore()
// const emitter = mitt()

const activeIndex = ref()
const activeCode = ref()
const isLoading = ref(false)
const isShow = ref(false)
// const isSearch = ref(false)
// let warnList:Array<any> = []
let warnList:any = reactive([])
let all:any[] = []
// let filterList = reactive([])
let allMaxUpdateTime = 0
let interval:any = null
const clickId = ref(0)
// let interval2:any = null
const warnId = ref()

onMounted(async() => {
  window.app.clickEvent((e:any, clickConfigId:any) => {
    // console.log(e, clickConfigId)
    clickId.value = clickConfigId
  })

  const dataPath:string = await window.app.windowGetDataPath()
  console.log(dataPath)
  // eslint-disable-next-line
  const path:string = store.userBaseInfo.username + '.data.warn'
  const data = await window.app.windowGetData(path)
  // console.log(data)
  if (data) {
    all = JSON.parse(JSON.stringify(data))
  }
  await getFirstList()
  await getNewFun()
  interval = setInterval(async() => {
    // console.log('轮询')
    getNewFun()
    // eslint-disable-next-line
    // const path:string = store.userBaseInfo.username + '.data.allMaxUpdateTime'
    // allMaxUpdateTime = await window.app.windowGetData(path) || Date.now()
    // getNewNotification(allMaxUpdateTime)
  }, 30000)
})
// emitter.on('clickConfigId', (e):void => {
//   console.log(66666, e)
// })
onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
})

const getNewFun = async() => {
  // eslint-disable-next-line
  const path:string = store.userBaseInfo.username + '.data.allMaxUpdateTime'
  allMaxUpdateTime = await window.app.windowGetData(path) || Date.now()
  getNewNotification(allMaxUpdateTime)
}

// const clickConfigId = computed(() => store.clickConfigId)

// interval2 = setInterval(async() => {
//   console.log(store.clickConfigId)
// }, 1000)

const itemClick = (index:number, id:number, configId:any):void => {
  clickId.value = configId
  activeIndex.value = index
  activeCode.value = id
  clockMenu() // 关闭右键菜单
  emit('openDetail', id)
}
// const activeIdx = ref(null)
// 计算要滚动到的元素
const activeElement = computed(() => {
  if (activeIndex.value) {
    return document.getElementById(`listItem-${ activeIndex.value }`)
  }
  return null
})
// 滚动到指定的列表项
const scrollToIndex = () => {
  if (activeElement.value) {
    activeElement.value.scrollIntoView(false)
  }
}
watch(clickId, async() => {
  // console.log('clickId变化了', clickId)
  // eslint-disable-next-line
  const data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
  let code = 0
  let configId = 0
  const index = data.findIndex((item:any) => (
    item.configId === clickId.value
  ))
  data.forEach((item:any) => {
    if (item.configId === clickId.value) {
      code = Number(item.code)
      configId = Number(item.configId)
    }
  })
  if (index !== -1) {
    itemClick(index, code, configId)
    scrollToIndex()
    setTimeout(() => {
      store.setScrollToId(warnId.value)
    }, 200)
  }
})

const getFirstList = async():Promise<void> => {
  // console.log(store.warnTotal)
  isLoading.value = true
  let res:any
  if (all.length) {
    // console.log('有数据')
    res = JSON.parse(JSON.stringify(all))
    const unTotal = ref(0)
    res.forEach((item:any) => {
      unTotal.value += item.untreatedTotal
    })
    store.setWarnTotal(unTotal.value) // 设置左侧栏未处理数量
    isShow.value = false
    nextTick(() => {
      isShow.value = true
      warnList = [...res]
      // console.log(warnList.length)
    })
  } else {
    console.log('无数据')
    isShow.value = false
    res = await getFirstAllUntreatedList()
    let configIdList:number[] = []
    let allMaxUpdateTime:number|'' = Date.now() // 总的最大更新时间
    res.forEach((item:any) => {
      item.createTimeStamp = filterSTN(item.createTime)
      configIdList.push(item.configId)
      if (filterSTN(item.updateTime) >= allMaxUpdateTime) {
        allMaxUpdateTime = filterSTN(item.updateTime)
      }
    })
    // console.log('allMaxUpdateTime', allMaxUpdateTime)
    // eslint-disable-next-line
    const path = store.userBaseInfo.username + '.data.allMaxUpdateTime'
    window.app.windowStoreData(path, allMaxUpdateTime)
    configIdList = [...new Set(configIdList)]
    // console.log(configIdList)
    interface ITempObj {
      code: string,
      name: string,
      isTop: boolean, // 是否置顶
      maxCreateTime: number, // 最大创建时间
      minCreateTime: number | string, // 已处理最小创建时间
      configId: number,
      treatedList: any[], // 已处理列表
      unTreatedList: any[], // 未处理列表
      untreatedTotal: number, // 未处理数量
      isLast: false // 是否是最后一条
    }
    const tempObj = <ITempObj>{}

    // nextTick(() => {
    let unTotal = 0
    configIdList.forEach((e:number) => {
      let maxCreateTime:number|'' = 0
      let untreated = 0
      const tempList:any[] = []
      // const createTimeList: any[] = []

      res.forEach((item:any) => {
        if (e === item.configId) {
          tempList.push(item)
          // tempObj.list.push(item)
          if (filterSTN(item.createTime) >= maxCreateTime) {
            maxCreateTime = filterSTN(item.createTime)
          }
          // createTimeList.push(filterSTN(item.createTime))
          if (item.handleStatus === 'untreated') untreated++
        }
      })
      tempObj.unTreatedList = tempList
      // tempObj.maxUpdateTime = filterTime(maxUpdateTime)
      tempObj.maxCreateTime = maxCreateTime
      tempObj.minCreateTime = 0
      tempObj.untreatedTotal = untreated
      tempObj.treatedList = []
      tempObj.isTop = false
      unTotal += untreated
      if (tempObj.unTreatedList.length) {
        tempObj.configId = tempObj.unTreatedList[0].configId
        tempObj.code = tempObj.unTreatedList[0].configVO.code + e.toString()
        tempObj.name = tempObj.unTreatedList[0]?.configVO.name
        tempObj.isLast = false
      }
      warnList.push(JSON.parse(JSON.stringify(tempObj)))
    })
    isShow.value = true
    all = JSON.parse(JSON.stringify(warnList))
    store.setWarnTotal(unTotal) // 设置左侧栏未处理数量
    // eslint-disable-next-line
    window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', all)
    // })
  }
  isLoading.value = false
}
// 轮询
const getNewNotification = (updateTime:number):void => {
  const configIdList:number[] = []
  getNotification(updateTime).then(async(res:any) => {
    // console.log(res, 'res')
    if (res && res.length) {
      // window.app.onTrayTwinkle()
      // eslint-disable-next-line
      window.app.windowStoreData(store.userBaseInfo.username + '.data.allMaxUpdateTime', filterSTN(res[0].updateTime))
      // eslint-disable-next-line
      const data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
      let temp:any[] = JSON.parse(JSON.stringify(data))

      // const e = res[0]
      const tempID:any = []
      const tempObj:any = []
      res.forEach((e:any) => {
        if (!tempID.includes(e.configId)) {
          tempID.push(e.configId)
          tempObj.push({
            configId: e.configId,
            name: e.configVO.name
          })
        }
        // console.log('每次的temp', temp)
        e.createTimeStamp = filterSTN(e.createTime)
        // console.log('temp', temp)
        // all = JSON.parse(JSON.stringify(temp))
        temp.forEach((item:any) => {
          configIdList.push(item.configId)
        })
        // console.log(temp, configIdList)
        if (configIdList.includes(e.configId)) { // 如果是现有对话框的
          const unIdList:number[] = []
          const idList:number[] = []
          // let maxCreateTime:number|'' = 0
          temp.forEach((item:any) => {
            if (item.configId === e.configId) {
              if (filterSTN(e.createTime) >= item.maxCreateTime) {
                item.maxCreateTime = filterSTN(e.createTime)
              }
              item.unTreatedList?.forEach((_c:any) => {
                unIdList.push(_c.id)
              })
              item.treatedList?.forEach((_c:any) => {
                idList.push(_c.id)
              })
            }
          })
          // console.log(unIdList, idList)
          if (e.handleStatus === 'untreated') {
            if (!unIdList.includes(e.id)) {
              // 未处理 不存在 就加
              temp.forEach((item:any) => {
                if (item.configId === e.configId) {
                  item.unTreatedList.push(e)
                  item.unTreatedList.sort((a:any, b:any) => (b.createTimeStamp - a.createTimeStamp))
                  item.untreatedTotal++
                }
              })
            } else {
              // 未处理 存在 不加
              return false
            }
          } else if (e.handleStatus === 'processed') {
            if (unIdList.includes(e.id)) {
              // console.log('未处理存在', !idList.includes(e.id))
              temp.forEach((item:any) => {
                if (item.configId === e.configId) {
                  const index = item.unTreatedList.findIndex((_c:any) => (_c.id) === e.id)
                  item.unTreatedList.splice(index, 1)
                  item.untreatedTotal--
                }
              })
            } 
            if (!idList.includes(e.id)) {
              // console.log('已处理不存在 添加进去')
              temp.forEach((item:any) => {
                if (item.configId === e.configId) {
                  item.treatedList.push(e)
                  item.treatedList.sort((a:any, b:any) => (b.createTimeStamp - a.createTimeStamp))
                  // console.log(item)
                }
              })
            }
          }
          // isShow.value = false
          warnList = JSON.parse(JSON.stringify(temp))
        } else {
          // console.log('新数据')
          interface ITempObj {
            code: string,
            name: string,
            isTop: boolean, // 是否置顶
            maxCreateTime: number|'', // 最大创建时间
            minCreateTime: number|'', // 已处理最小创建时间
            configId: number,
            treatedList: any[], // 已处理列表
            unTreatedList: any[], // 未处理列表
            untreatedTotal: number, // 未处理数量
            isLast: false // 是否是最后一条
          }
          const tempObj = <ITempObj>{}
          let untreated = 0
          // let unTotal = 0
          tempObj.configId = e.configId
          tempObj.code = e.configVO.code + e.configId.toString()
          tempObj.name = e.configVO.name
          tempObj.maxCreateTime = filterSTN(e.createTime)
          tempObj.isLast = false
          tempObj.isTop = false
          if (e.handleStatus === 'untreated') {
            untreated++
            tempObj.minCreateTime = 0
            tempObj.unTreatedList = []
            tempObj.unTreatedList.push(e)
            tempObj.treatedList = []
            tempObj.untreatedTotal = untreated
          } else {
            // tempObj.minCreateTime = filterSTN(e.createTime)
            tempObj.treatedList = []
            tempObj.treatedList.push(e)
            tempObj.unTreatedList = []
            tempObj.untreatedTotal = untreated
          }
          // isShow.value = false
          warnList.push(tempObj)
          warnList.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
          temp.push(tempObj)
          temp.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
        }
      }) // forEach
      isShow.value = false
      let unTotal = 0
      temp.forEach((item:any) => {
        unTotal += item.untreatedTotal
        tempObj.forEach((_b:any) => {
          if (item.configId === _b.configId) {
            item.name = _b.name
            item.treatedList.forEach((_e:any) => {
              _e.configVO.name = _b.name
            })
            item.unTreatedList.forEach((_e:any) => {
              _e.configVO.name = _b.name
            })
          }
        })
      })
      // 置顶情况排序
      const topList:any[] = []
      temp.forEach((item:any) => {
        if (item.isTop) {
          topList.push(item)
        }
      })
      topList.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
      temp = temp.filter((item:any) => (item.isTop === false))
      temp.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
      temp = topList.concat(temp)
      warnList = JSON.parse(JSON.stringify(temp))
      $forceUpdate()

      // eslint-disable-next-line
      window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', temp)
      store.setWarnTotal(unTotal) // 设置左侧栏未处理数量
      nextTick(() => {
        isShow.value = true
        emit('openDetail', activeCode.value)
      })
      const warnObj = res.find((item:any) => item.handleStatus === 'untreated')
      // console.log(warnObj)
      if (warnObj) {
        window.app.onTrayTwinkle()
        clickId.value = warnObj.configId
        warnId.value = warnObj.id
        // setTimeout(() => {
        //   store.setScrollToId(warnObj.id)
        // }, 200)
      }

      // 给托盘提醒用
      // const trayList:any[] = []
      // interface ITempObj {
      //   configId: number,
      //   name: string,
      //   total: number
      // }
      // const tempObject = <ITempObj>{}
      // warnList.forEach((item:any) => {
      //   if (item.untreatedTotal > 0) {
      //     tempObject.configId = item.configId
      //     tempObject.name = item.name
      //     tempObject.total = item.untreatedTotal
      //     trayList.push(JSON.parse(JSON.stringify(tempObject)))
      //   }
      // })
      // if (trayList.length) {
      //   if (trayList.length === 1) {
      //     window.app.changeSmallWindowSize(222, 84)
      //   }
      //   if (trayList.length === 2) {
      //     window.app.changeSmallWindowSize(222, 127)
      //   }
      //   if (trayList.length === 3) {
      //     window.app.changeSmallWindowSize(222, 167)
      //   }
      //   if (trayList.length === 4) {
      //     window.app.changeSmallWindowSize(222, 204)
      //   }
      //   if (trayList.length > 4) {
      //     // console.log(trayList.length)
      //     window.app.changeSmallWindowSize(222, 242)
      //   }
      //   window.app.onTrayTwinkle(trayList)
      // }
    }
    // clickId.value = 1
    // const id = 3
    // store.setScrollToId(id)
    // window.app.onTrayTwinkle()
  })
}

// const inputSearch = (value:any):void => {
//   if (value) {
//     isSearch.value = true
//     isLoading.value = true
//     getControlList(keyword.value).then((res: any) => {
//       res.forEach((item:any) => {
//         item.time = filterTime(item.lastMessageCreateTime)
//         item.number = item.code + item.id
//       })
//       filterList = JSON.parse(JSON.stringify(res))
//     }).catch(err => {
//       console.log(err)
//     }).finally(() => {
//       warnList = JSON.parse(JSON.stringify(filterList))
//       isLoading.value = false
//     })
//   } else {
//     clearInput()
//   }
// }
// const clearInput = ():void => {
//   // console.log('clear', keyword.value)
//   isSearch.value = false
//   isLoading.value = true
//   nextTick(() => {
//     warnList = JSON.parse(JSON.stringify(all))
//     isLoading.value = false
//   })
// }
// 右键菜单
const isShowMenu = ref(false) // 控制是否显示右键菜单
const menuLeft = ref(0)
const menuTop = ref(0)
const openMenuConfigId = ref(0) // 打开右键菜单的那一行的configId
const isNowTop = ref(false) // 是否已置顶
const showMenu = async(e:any, index:number, configId:number):Promise<void> => {
  // console.log(e, index, configId)
  window.app.stopTrayTwinkle() // 关闭托盘提示
  isShowMenu.value = false
  // eslint-disable-next-line
  const data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
  data.forEach((item:any) => {
    if (item.configId === configId) {
      if (item.isTop) {
        isNowTop.value = true
      } else {
        isNowTop.value = false
      }
    }
  })
  openMenuConfigId.value = configId
  isShowMenu.value = true
  menuLeft.value = e.pageX
  menuTop.value = e.pageY - 35
}
// 置顶
const stick = async(status:boolean):Promise<void> => {
  // eslint-disable-next-line
  let data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
  data.forEach((item:any) => {
    if (item.configId === openMenuConfigId.value) {
      item.isTop = status
    }
  })
  const topList:any[] = []
  data.forEach((item:any) => {
    if (item.isTop) {
      topList.push(item)
    }
  })
  topList.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
  data = data.filter((item:any) => (item.isTop === false))
  data.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
  data = topList.concat(data)

  warnList = JSON.parse(JSON.stringify(data))
  // console.log(activeCode.value, warnList.findIndex((item:any) => (Number(item.code) === activeCode.value)))
  activeIndex.value = warnList.findIndex((item:any) => (Number(item.code) === activeCode.value))

  $forceUpdate()
  // eslint-disable-next-line
  window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', data)
  clockMenu()
}
// 取消置顶
// const cancelStick = async():Promise<void> => {
//   console.log(openMenuConfigId.value)
//   // eslint-disable-next-line
//   let data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
//   data.forEach((item:any) => {
//     if (item.configId === openMenuConfigId.value) {
//       item.isTop = false
//     }
//   })
//   const topList:any[] = []
//   data.forEach((item:any) => {
//     if (item.isTop) {
//       topList.push(item)
//     }
//   })
//   topList.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
//   data = data.filter((item:any) => (item.isTop === false))
//   data.sort((a:any, b:any) => (b.maxCreateTime - a.maxCreateTime))
//   data = topList.concat(data)

//   warnList = JSON.parse(JSON.stringify(data))
//   $forceUpdate()
//   // eslint-disable-next-line
//   window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', data)
//   clockMenu()
// }

// 打开删除确认弹框
const openDelete = () => {
  store.setCloseStatus(true)
  ElMessageBox.confirm(
    '删除后将无法查看，确定删除?',
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false,
      autofocus: true
    }
  )
  .then(() => {
    deleteList()
  })
  .catch(() => {
    isShowMenu.value = false
  })
}

// 删除
// const showDelPop = ref(false)
const deleteList = async():Promise<void> => {
  // eslint-disable-next-line
  let data = await window.app.windowGetData(store.userBaseInfo.username + '.data.warn')
  data = data.filter((item:any) => (item.configId !== openMenuConfigId.value))

  warnList = JSON.parse(JSON.stringify(data))
  let unTotal = 0
  warnList.forEach((item:any) => {
    unTotal += item.untreatedTotal
  })
  activeIndex.value = -1
  emit('openDetail', -1)
  store.setWarnTotal(unTotal) // 设置左侧栏未处理数量
  $forceUpdate()
  // eslint-disable-next-line
  window.app.windowStoreData(store.userBaseInfo.username + '.data.warn', data)
  clockMenu()
}
// 关闭菜单
const clockMenu = ():void => {
  isShowMenu.value = false
}
defineExpose({
  getNewNotification,
  clockMenu
})
</script>

<style lang="less" scoped>
.WarnList{
  min-width: 277px;
  padding: 5px 5px 40px 5px;
  background: #FFFFFF;
  border-left: 1px solid #e3e4e5;
  border-right: 1px solid #e3e4e5;
  // overflow: hidden;
  // overflow-y: scroll;
  -webkit-app-region: drag;
  // .search_box{
  //   // height: 22px;
  //   position: relative;
  //   -webkit-app-region: no-drag;
  //   :deep(.el-input__wrapper){
  //     height: 22px;
  //     background: #EAEAEA;
  //     border-radius: 2px;
  //     padding: 1px 4px 1px 7px;
  //     font-size: 11px; // placeholder
  //   }
  //   :deep(.el-input__icon) {
  //     font-size: 12px;
  //     color: #656565;
  //   }
  // }
  .warn_box{
    // height: 100%;
    height: calc(100vh - 45px);
    // margin-top: 8px;
    padding-bottom: 5px;
    overflow: hidden;
    overflow-y: auto;
    -webkit-app-region: no-drag;
    .list{
      width: 265px;
      height: 55px;
      border-radius: 4px;
      padding: 8px 6px 9px 10px;
      cursor: pointer;
      .all{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left{
          .left_top{
            height: 16px;
            font-size: 12px;
            color: #171A1D;
            line-height: 16px;
          }
          .left_bottom{
            margin-top: 4px;
            color: #A3A4A6;
            font-size: 11px;
            line-height: 16px;
          }
        }
        .right{
          .right_top{
            float: right;
            height: 10px;
            font-size: 11px;
            margin-top: 1px;
            color: #A3A4A6;
          }
         
          .right_bottom{
            .badge{
              float: right;
              margin-top: 11px;
            }
            :deep(.el-badge__content) {
              background: #ff3d3d;
              color: #ffffff;
              font-size: 8px;
              padding: 0 4px;
              border: 0px;
              height: 12px;
            }
          }
        }
      }
      .filter{
        .top{
          font-size: 12px;
          .name{
            color: #171A1D;
          }
          .total{
            color: #A3A4A6;
          }
        }
        .bottom{
          font-size: 11px;
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          .left{
            color: #0F8FFF;
          }
          .right{
            .noApproved{
              color: #FF3D3D;
            }
            .label{
              color: #A3A4A6;
            }
          }
        }
      }
    }
    .isTop{
      background-color: #F0F1F2;
    }
    .isSelected{
      background: #EBECED;
      transition: 0.3s;
    }
    
    .menu_box {
      position: fixed;
      z-index: 1004;
      background-color: #fff;
      // border-radius: 5px;
      .menu{
        width: 100px;
        text-align: left;
        // padding: 5px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        .menu_item{
          height: 24px;
          line-height: 22px;
          // margin-top: 5px;
        }
        .item_text{
          color: #171A1D;
          cursor: pointer;
          padding: 1px 20px;
          // border-radius: 3px;
          transition: all .2s ease-in;
        }
        .item_text:hover {
          background-color: #E9EAEC;
        }
      }
    }
    .empty{
      // width: calc(100vw - 333px);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .toLogin{
    margin-top:30px;
    -webkit-app-region: no-drag;
  }
}
::-webkit-scrollbar{ // 隐藏滚动条
  display: none;
  // width: 0;
}
</style>