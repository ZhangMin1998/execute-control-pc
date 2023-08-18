import request from '@/utils/request'

// 布控列表查询
export function getControlList (param:string) {
  return request({
    url: `/monitor/mobile/message/config/list?featuresKey=${ param }`,
    method: 'get'
  })
}
// 布控列表-详情查询
export function getControlDetail (param:number) {
  return request({
    url: `/monitor/mobile/message/list?configId=${ param }`,
    method: 'get'
  })
}

// 获取特征下拉框选项
export function getFeatureOptionsApi (params:any) {
  return request({
    url: '/configurable/graph_entity_label/manage/getTraceLabel',
    method: 'get',
    params
  })
}
// 获取数据类型对照表
export function configurableSrcDataAll () {
  return request({
    url: '/configurable/srcData/all',
    method: 'get'
  })
}

// 首次登录-查询所有未处理消息
export function getFirstAllUntreatedList () {
  return request({
    url: '/monitor/mobile/message/untreated/list',
    method: 'get'
  })
}
// 布控状态处理
export function setControlStatus (param:number) {
  return request({
    url: `/monitor/mobile/message/status/switch?messageId=${ param }`,
    method: 'get'
  })
}
// 查找已处理历史数据
export function getHistoryMessage (configId:number, createTime:number) {
  return request({
    url: `/monitor/mobile/message/history/page?configId=${ configId }&createTime=${ createTime }`,
    method: 'get'
  })
}
// 轮询查找最新数据
export function getNotification (param:number) {
  return request({
    url: `/monitor/mobile/message/notification?updateTime=${ param }`,
    method: 'get'
  })
}
