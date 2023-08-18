<template>
  <div v-if="list.length" id="list-box">
    <div
      v-for="(item, index) in list"
      :id="'item-' + item.id"
      :key="index"
      :class="{ 'content_box': true, 'processed': item.ok }"
    >
      <div class="time_box">
        <span>{{ item.createTimeCn }}</span>
      </div>
      <div class="card">
        <img
          v-if="item.handleStatus === 'processed'"
          src="@/assets/images/yichuli.png"
          alt="已处理"
          class="handleImg"
        >
        <div v-if="item.triggerAttr.startsWith('image/')" class="left">
          <el-image
            class="img"
            :src="baseUrl + item.triggerAttr"
            :zoom-rate="1.2"
            :preview-src-list="[baseUrl + item.triggerAttr]"
            fit="cover"
            :lazy="true"
          >
          <!-- <div slot="error" class="image-slot">
            <img :src='$themeColor("--person-default-pic")' alt=''>
          </div> -->
          </el-image>
        </div>
        <div class="right">
          <div
            v-for="(e, index1) in labelList1"
            :key="index1"
            class="flex"
          >
            <div class="label">{{ e.label }}</div>
            <div
              v-if="e.key === 'triggerAddress'"
              class="address"
            >
              <i
                v-if="item.latitude && item.longitude"
                class="iconfont icon-icon_zuobiao youzuobiaoColor"
                title="有经纬度"
              ></i>
              <i
                v-else
                class="iconfont icon-icon_wujingweizuobiao wuzuobiaoColor"
                title="无经纬度"
              ></i>
              <span class="addressValue" @click="toControlWarn(item)">
                <EllipsisPop
                  :content=" item[e.key]"
                  :row-num="1"
                  :width="item.triggerAttr.startsWith('image/') ? '180px' : '240px'"
                  :title="item.handleStatus === 'processed' ? '已处理无法跳转' : '' "
                >
                </EllipsisPop>
              </span>
            </div>
            <div
              v-else-if="e.key === 'isHandle'"
              class="switch"
            >
              <el-switch
                v-model="item[e.key]"
                :disabled="item[e.key]"
                size="small"
                @change="handleStatuChange(item)"
              />
            </div>
            <div
              v-else
              class="value"
            >
              {{ item[e.key] }}
            </div>
          </div>

          <div class="splitLine"></div>

          <div
            v-for="(e, index2) in labelList2"
            :key="index2"
            class="flex"
          >
            <div class="label">{{ e.label }}</div>
            <div
              v-if="e.key === 'levelCn'"
              :class="{level: true, general: item.configVO.level === 'general', normal: item.configVO.level === 'normal', serious: item.configVO.level === 'serious'}"
            >
              <span>{{ item.configVO[e.key] }}</span>
            </div>
            <div
              v-else
              class="value"
            >
              <EllipsisPop :content="item.configVO[e.key]" :row-num="1" :width="item.triggerAttr.startsWith('image/') ? '180px' : '250px' "></EllipsisPop>
              <!-- {{ item.configVO[e.key] }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script lang="ts" setup>
import { reactive, watch, computed, onBeforeUnmount } from 'vue'
import { userStore } from '@/store/userInfo'
import { setControlStatus } from '@/api/warn'
import EllipsisPop from '@/components/EllipsisPop/index.vue'
import scrollIntoView from 'scroll-into-view-if-needed'

const props = defineProps({
  contentList: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['search'])
const store = userStore()

let list:any[] = reactive([])

// eslint-disable-next-line
// watchEffect(() => {
//   list = props.contentList
// })

const activeElement = computed(() => document.getElementById(`item-${ store.scrollToId }`))

watch(
  () => props.contentList,
  () => {
    list = props.contentList
  },
  { immediate: true }
)
watch(
  () => store.scrollToId,
  () => {
    // console.log('store.scrollToId', store.scrollToId)
    const node = activeElement.value
    if (node) {
      setTimeout(() => {
        // node?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        scrollIntoView(node, {
          behavior: 'auto', // smooth
          scrollMode: 'if-needed', // if-needed always
          block: 'end',
          inline: 'nearest'
        })
      }, 50)
    }
  }
)
// eslint-disable-next-line
const baseUrl = computed(function() {
  // eslint-disable-next-line
  return 'http://192.168.1.182:21888' + '/'
  // eslint-disable-next-line
  // return window.location.origin + '/'
})

// eslint-disable-next-line
// console.log(list)
const labelList1 = reactive([
  { label: '触警对象：', key: 'triggerLabelNameCn' },
  { label: '触警时间：', key: 'triggerTime' },
  { label: '触警地址：', key: 'triggerAddress' },
  { label: '触警数据：', key: 'triggerDataSourceCn' },
  { label: '归属警员：', key: 'belongPolice' },
  { label: '触警处理：', key: 'isHandle' }
])
const labelList2 = reactive([
  { label: '预警名称：', key: 'name' },
  { label: '布控级别：', key: 'levelCn' },
  { label: '布控时间：', key: 'timeSelectFlagCn' },
  { label: '预警区域：', key: 'regionSelectFlagCn' },
  { label: '预警数据：', key: 'dataTypeSelectFlagCn' }
])

let interval:any = null
const handleStatuChange = async(item:any):Promise<void> => {
  await setControlStatus(item.id)
  item.ok = true
  // box.classList.add('processed')
  // const res = await setControlStatus(item.id)
  emit('search')
  // interval = setTimeout(async() => {
  //   emit('search')
  // }, 600)
}
function toControlWarn (item:any):void { // 打开防控预警页面
  item.triggerTrait = item.triggerLabelNameCn
  item.triggerRecord = item.triggerDataSourceCn
  const info = encodeURIComponent(JSON.stringify(item))
  if (item.handleStatus === 'untreated') window.app.windowToControlWarn(info) // 未处理才跳转
}
onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
})
</script>

<style lang="less" scoped>
.processed {
  transform: scale(0);
  opacity: 0;
}
.content_box{
  padding: 0 0 20px 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
  .time_box{
    font-size: 9px;
    color: #A3A4A6;
    text-align: center;
  }
  .card{
    position: relative;
    margin-top: 3px;
    width: 352px;
    height: 263px;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 8px 10px;
    display: flex;
    // -webkit-app-region: no-drag;
    .handleImg{
      width: 40.71px;
      height: 35.64px;
      position:absolute;
      right:10px;
      top:10px;
    }
    .left{
      .img{
        width: 64px;
        height: 64px;
      }
    }
    .right{
      margin-left: 8px;
      font-size: 12px;
      // line-height: 13px;
      color: #171A1D;
      .flex{
        margin-bottom: 9px;
        display: flex;
        // .label{

        // }
        // .value{

        // }
        .address{
          display: flex;
          .addressValue{
            margin-left: 4px;
            color: #0F8FFF;
            font-size: 12px;
            cursor: pointer;
          }
          .youzuobiaoColor{
            color: #0F8FFF;
          }
          .wuzuobiaoColor{
            color: #6d6e70;
          }
        }
        .iconfont{
          font-size: 12px;
        }
        .level{
          width: 32px;
          height: 16px;
          color: #FFFFFF;
          text-align: center;
          line-height: 16px;
          margin-top: -3px;
        }
        .general{
          background: #0F8FFF;
        }
        .normal{
          background: #FFC53D;
        }
        .serious{
          background: #FF3D3D;
        }
        :deep(.el-switch.is-disabled) {
          opacity: 1;
        }
        :deep(.el-switch--small) {
          height: 10px;
        }
        :deep(.el-switch--small .el-switch__core) { 
          min-width: 23px;
          height: 12px;
          margin-top: -1px;
        }
        // :deep(.el-switch__core::after) { width: 10px; height: 10px; margin-top: -1px; }
        // :deep(.el-switch.is-checked .el-switch__core::after){ margin-left: -15px; }
        :deep(.el-switch--small .el-switch__core .el-switch__action){
          width: 10px;
          height: 10px;
        }
        :deep(.el-switch--small.is-checked .el-switch__core .el-switch__action){
          left: calc(100% - 11px);
        }
      }
      .splitLine{
        width: 187px;        
        height: 1px;
        margin-bottom: 8px;
        background: #ECEDEE;
      }
    }
  }
}
// }
// :deep(.el-loading-mask){
//   width: calc(100vw - 333px);
// }
</style>