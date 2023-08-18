/*
 * 预加载文件：
 * 1.在主进程之后，渲染进程之前执行;
 * 2.预加载进程主要用于暴露Node.js或者Electron的API到渲染进程;
 * 3.在渲染进程中，通过window.对象名进行访问
 * */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  changeWindowSize: (width, height, isLogin) => {
    ipcRenderer.send('change-window-size', width, height, isLogin)
  },
  // 最小化
  windowMin: () => {
    ipcRenderer.send('window-min')
  },
  // 最大化
  windowMax: () => {
    ipcRenderer.send('window-max')
  },
  // 关闭窗口
  windowClose: () => {
    ipcRenderer.send('window-close')
  },
  windowHide: () => {
    ipcRenderer.send('window-hide')
  },
  windowShow: () => {
    ipcRenderer.send('window-show')
  },
  windowSetOpacity: opacity => {
    ipcRenderer.send('window-set-opacity', opacity)
  },
  // 跳转到系统首页
  windowToUrl: () => {
    ipcRenderer.send('open-url', `http://192.168.1.182:21888/ol/SuperSearch?token=${ localStorage.getItem('token') }`)
  },
  // 打开防空预警
  windowToControlWarn: (item) => {
    ipcRenderer.send('open-url', `http://192.168.1.182:21888/ol/controlWarn?token=${ localStorage.getItem('token') }&item=${ item }`)
  },
  // 打开关于客户端的窗口
  openExeAbout: () => {
    ipcRenderer.send('exe-window')
  },
  // 关闭关于客户端的窗口
  exeInfoWinClose: () => {
    ipcRenderer.send('exe-window-close')
  },
  // 打开退出客户端的窗口
  openExeQuit: () => {
    ipcRenderer.send('exe-quit-window')
  },
  // 退出客户端窗口关闭
  exeQuitClose: () => {
    ipcRenderer.send('exe-quit-window-close')
  },
  // 退出客户端窗口最小化
  exeQuitWinClose: () => {
    ipcRenderer.send('exe-quit-window-min')
  },
  // 打开异常退出窗口
  openExeError: () => {
    ipcRenderer.send('exe-error-window')
  },
  // 关闭异常退出窗口
  exeErrorClose: () => {
    ipcRenderer.send('exe-error-window-close')
  },
  windowStoreData: (key, value) => {
    ipcRenderer.invoke('window-store-data', key, value)
  },
  windowGetData: async key => {
    const data = await ipcRenderer.invoke('window-get-data', key)
    return data
  },
  windowGetDataPath: async () => {
    const data = await ipcRenderer.invoke('window-get-data-path')
    return data
  },
  onCloseWin: callback => ipcRenderer.on('close-win-by-tray', callback),
  onResizeEvent: callback => {
    ipcRenderer.on('resize-event', callback)
  },

  // 通过拖拽&双击最大化后、取消最大化后修改按钮图标
  onSetMaxMinIcon: callback => ipcRenderer.on('set-maxminicon', callback),

  // 退出前保存窗口大小
  saveWindowBounds: async () => {
    const data = await ipcRenderer.invoke('save-window-bounds')
    return data
  },
  // 完全关闭退出客户端
  windowCloseAll: () => {
    ipcRenderer.send('window-close-all')
  },

  // 新消息提醒触发托盘闪烁
  onTrayTwinkle: (arg) => {
    ipcRenderer.send('have-message-with-show-message', arg)
  },
  // 停止托盘闪烁
  stopTrayTwinkle: () => {
    ipcRenderer.send('no-message')
  },
  // 打开主窗口
  openWindow: (configId) => {
    console.log('configId', configId)
    ipcRenderer.send('open-window-with-click-event', configId)
  },
  // toTray:(arg) => {
  //   console.log(arg)
  //   ipcRenderer.send('show-message', arg)
  // },
  clickEvent: callback => ipcRenderer.on('click-event', callback),
  showMessage: callback => ipcRenderer.on('show-message', callback),
  // 改变消息提醒窗口大小
  changeSmallWindowSize: (width, height) => {
    ipcRenderer.send('change-small-window-size', width, height)
  },
  // 退出时关闭除主窗口外的其他窗口
  relaunchApp: () => {
    ipcRenderer.send('relaunch-app')
  }
})
