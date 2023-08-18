import { defineStore } from 'pinia'

const userBaseInfo: {
  [key: string]: any
} = {
  username: '',
  realName: ''
}

export const userStore = defineStore({
  id: 'userInfo', // 命名，唯一
  state: () => ({
    info: {
      username: 'admin',
      password: '12345678'
    },
    infostring: 'asdfghjkl',
    isLogin: false,
    userBaseInfo,
    sysRole: '',
    hasPermission: false, // 有无权限
    closeStatus: false, // 退出账号确认框的状态
    warnTotal: 0, // 左侧栏未处理数量
    traceLabelList: [], // 触警对象对照表
    dataTypeList: [], // 所有数据类型对照表
    clickConfigId: 0, // 从托盘消息列表点击的configId
    scrollToId: 0 // 轮询接口的数据里第一条未处理的id
  }),
  actions: {
    setUsername(val: string) {
      this.info.username = val
    },
    LogoutSys() {
      window.app.windowClose()
      this.isLogin = false
      this.userBaseInfo = {}
    },
    setPasswordErrorTimes(val?: number) {
      console.log(val)
    },
    changIsLogin(val: boolean) {
      this.isLogin = val
    },
    handleUserInfo(val: object) {
      // eslint-disable-next-line
      this.userBaseInfo = val
    },
    handleSysRole(val: string) {
      this.sysRole = val
    },
    setWarnTotal(val: number) {
      // 赋值左侧栏未处理数量
      this.warnTotal = val
    },
    setTraceLabelList(val: any) {
      // 赋值触警对象对照表
      this.traceLabelList = val
    },
    setDataTypeList(val: any) {
      // 赋值数据类型对照表
      this.dataTypeList = val
    },
    setClickConfigId(val: number) {
      // 赋值从托盘消息列表点击的configId
      this.clickConfigId = val
    },
    setScrollToId(val: number) {
      // 赋值轮询接口的数据里第一条未处理的id
      this.scrollToId = val
    },
    // 改变退出确认提示框状态
    setCloseStatus(val: boolean) {
      // eslint-disable-next-line
      this.closeStatus = val
    },
    // 赋值有无权限
    setHasPermission(val: boolean) {
      // eslint-disable-next-line
      this.hasPermission = val
    }
  }
})
