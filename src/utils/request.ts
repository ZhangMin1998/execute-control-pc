import axios from 'axios'
// import vm from '@/main'
import router from '../routers/index.js'
import { userStore } from '@/store/userInfo'
import { ElMessage } from 'element-plus'
import { isIE11 } from '@/utils/index'
import { enByDES, deByDES } from '@/utils/encryp'
import { obtainKey } from './index'

const store = userStore()
const preJava = '/police'
const prePython = '/py'
const preWarning = '/police/warning'

const request = (args: any) => {
  let { url } = args
  url = args.py ? prePython + url : args.warning ? preWarning + url : preJava + url
  return service({ ...args, url })
}

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000 // request timeout
})
const notTimeOut = [
  '/police/dc_wifi/pager',
  '/police/dc_fence/pager',
  '/police/case/insert',
  '/police/analysis/queryTimeTrack',
  '/police/analysis/getStartAndEnd',
  '/police/analysis/allData',
  '/police/analysis/spaceCrash',
  '/police/dc_audit/pager',
  '/police/excel/import/excel',
  '/police/device_details',
  '/police/device_list',
  '/police/analysis/peerRelevance/ax',
  '/police/sparkTask/save',
  '/police/fr/search',
  '/police/configurable/srcData/create',
  '/police/configurable/srcData/update'
]
const disEnByDES = [
  '/police/login/oauth/token',
  '/police/fr/search',
  '/police/suspects/searchCriminalByPage',
  '/police/suspects/queryNexus'
]
const reqMethod = ['put', 'post']
// request interceptor

const loading: any = false
// function openLoading(loadingDom: string, loadingBg: string, text: string) {
//   loading = Vue.prototype.$loading({
//     lock: true,
//     text: text,
//     spinner:'el-icon-loading',
//     background: loadingBg,
//     target: loadingDom || 'body'
//   })
// }
function closeLoading() {
  loading && loading.close()
}

service.interceptors.request.use(
  (config: any) => {
    if (config.loading) {
      // openLoading(
      //   config.loadingDom,
      //   config.loadingBg ? config.loadingBg : 'rgba(25, 32, 53, 1)',
      //   config.loadingText ? config.loadingText : '数据正在加载中'
      // )
    }
    if (config.method == 'get') {
      if (isIE11()) {
        config.params = {
          _t: Date.parse(new Date().toString()) / 1000,
          ...config.params
        }
      }
    }

    // 请求参数 加密 排除py接口
    if (localStorage.getItem('encOpen') === 'true' && !config.py && !config.warning) {
      /**  post/put请求统一加密参数 排除白名单  */
      console.log('====================================')
      // console.log('请求url' + config.url + ' ,请求参数：' + JSON.stringify(config.data))
      console.log(`请求url${ config.url },请求参数:${ JSON.stringify(config.data) }`)
      console.log('====================================')

      // post 和 put 请求加密   以及个别例外接口
      if (reqMethod.includes(config.method) && !disEnByDES.includes(config.url)) {
        config.data = enByDES(JSON.stringify(config.data))
      }

      /**  强制设置请求头  */
      if (config.url == '/police/oauth/token' || reqMethod.includes(config.method)) {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
      if (config.formUpload) {
        config.headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      }
    }

    const token = localStorage.getItem('token')

    const isLong = notTimeOut.some(element => element === config.url)

    /** 设置白名单不超时 */
    if (isLong || config.py) {
      config.timeout = 10000000000000
    }

    if (token) {
      // 将token放到请求头发送给服务器,将tokenkey放在请求头中
      config.headers.token = token
      // config.headers.withCredentials = true
      // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    } else {
      // config.headers.withCredentials = false
    }

    return config
  },

  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const codeMessage = {
  500: '服务器发生错误，请稍后刷新重试。'
}
const codeMessageStr = ['500']

const responseAll = ['/police/table/insertUserOrRoleOrMenuData']
// response interceptor
service.interceptors.response.use(
  (response: any) => {
    if (response.config.loading) {
      closeLoading()
    }
    let res = response.data
    /** 后台加密 拿到加密返回数据 解密再去显示 */
    if (localStorage.getItem('encOpen') == 'true') {
      if (typeof response.data == 'string') {
        //  将 localStorage 中PrivateKey 用固定字符串解密后 再去解密返回数据
        const key = deByDES(localStorage.getItem('PrivateKey'), obtainKey())
        res = JSON.parse(deByDES(response.data, key))
        console.log('====================================')
        console.log(response.config.url, res)
        console.log('====================================')
      }
    }

    // 通过 meta 中的 all 配置来取决后台是否返回所有数据
    const isAll = response.config.meta && response.config.meta.all
    if (isAll || responseAll.includes(response.config.url)) {
      return res
    }
    if (res.code == 1) {
      return res.data
    }
    if (res.code == '401' || res.code == '403') {
      // ElMessage.warning('登录已失效,请重新登录 !')
      // store.LogoutSys()
      store.changIsLogin(false)
      store.handleUserInfo({})
      store.setCloseStatus(false)
      router.push({ path: '/login' })
      window.app.stopTrayTwinkle() // 托盘停止闪烁提醒
      window.app.changeWindowSize(360, 480, true)
      window.app.openExeError()
      return
    }
    if (res.code == 2) {
      return res
    }
    if (res.msg === '账号或者密码错误' || res.msg === '验证码有误！') {
      // vm.$store.commit('Common/setPasswordErrorTimes', Number(res.data))
      store.setPasswordErrorTimes(Number(res.data))
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    console.log('====================================')
    console.log(res.msg)
    console.log('====================================')
    ElMessage.error(res.msg)
    return Promise.reject(new Error(res.msg || 'Error'))
  },
  (error: string) => {
    closeLoading()
    // const str = 'err' + error
    const str = `err${ error }`
    const code = str.substring(str.length - 3, str.length)

    if (codeMessageStr.includes(code)) {
      // ElMessage.error(codeMessage[code])
      ElMessage.error(codeMessage[500])
      return Promise.reject(error)
    }

    if (str.indexOf('timeout') !== -1) {
      ElMessage.error('请求超时,请刷新重试！')
    }
    return Promise.reject(error)
  }
)

export default request
