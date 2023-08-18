const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const url = require('url')
const createTray = require('../controller/tray.js')
const singleOpenApp = require('../controller/singleOpenApp.js')
// 调整窗口大小以及窗口的最大化，最小化和关闭窗口
require('../controller/changeWindowSize.js')
require('../controller/store.js')

let exeInfoBrowserWindow: typeof BrowserWindow | null
let exeQuitBrowserWindow: typeof BrowserWindow | null
let exeErrorBrowserWindow: typeof BrowserWindow | null
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:7070'
  : 'http://192.168.1.182:9233' // 打包的时候，改成部署的测试环境

// 防止应用多开问题
let myWindow:any = null
singleOpenApp(app, myWindow)

let browserWindowPosition:any
let browserWindowSize:any

app.commandLine.appendSwitch('wm-window-animations-disabled')

function createWindow () {
  const browserWindow = new BrowserWindow({
    width: 360,
    height: 480,
    resizable: false,
    // transparent: true,
    maximizable: false,
    frame: false,
    webPreferences: {
      // CSP 设置
      // contentSecurityPolicy: 'default-src \'self\'; font-src \'self\' data:',
      preload: path.join(__dirname, '../electron-preload/index.js')
      // partition: String(+new Date()) // 缓存处理
    },
    show: false
  })
  browserWindow.setMenu(null)
  // browserWindow.focus() // 将焦点设置回主窗口
  
  // 关于客户端的窗口
  ipcMain.on('exe-window', () => {
    if (!exeInfoBrowserWindow) {
      exeInfoBrowserWindow = new BrowserWindow({
        width: 256,
        height: 202,
        resizable: false,
        // modal: true,
        // transparent: true,
        maximizable: false,
        frame: false,
        parent: browserWindow,
        webPreferences: {
          preload: path.join(__dirname, '../electron-preload/index.js')
        }
      })
      // 让主窗口移动后，小窗口也跟着主窗口
      const exeInfoBrowserWindowWidth = exeInfoBrowserWindow.getSize()[0]
      const exeInfoBrowserWindowHeight = exeInfoBrowserWindow.getSize()[1]

      const newX = Math.round(browserWindowPosition[0] + (browserWindowSize[0] / 2) - (exeInfoBrowserWindowWidth / 2))
      const newY = Math.round(browserWindowPosition[1] + (browserWindowSize[1] / 2) - (exeInfoBrowserWindowHeight / 2))
      
      exeInfoBrowserWindow.setPosition(newX, newY)
      exeInfoBrowserWindow.loadURL(url.format({
        pathname: `${ winURL }/exeWindow`
      }))
      // exeInfoBrowserWindow.webContents.openDevTools({ mode: 'detach' })
      exeInfoBrowserWindow.on('closed', () => {
        exeInfoBrowserWindow = null
      })
    }
  })

  // 账号信息的窗口
  ipcMain.on('exe-quit-window', () => {
    if (!exeQuitBrowserWindow) {
      exeQuitBrowserWindow = new BrowserWindow({
        width: 342,
        height: 210,
        resizable: false,
        // modal: true,
        // transparent: true,
        maximizable: false,
        frame: false,
        parent: browserWindow,
        webPreferences: {
          preload: path.join(__dirname, '../electron-preload/index.js')
        }
      })
      // 让主窗口移动后，小窗口也跟着主窗口
      const exeQuitBrowserWindowWidth = exeQuitBrowserWindow.getSize()[0]
      const exeQuitBrowserWindowHeight = exeQuitBrowserWindow.getSize()[1]

      const newX = Math.round(browserWindowPosition[0] + (browserWindowSize[0] / 2) - (exeQuitBrowserWindowWidth / 2))
      const newY = Math.round(browserWindowPosition[1] + (browserWindowSize[1] / 2) - (exeQuitBrowserWindowHeight / 2))
      
      exeQuitBrowserWindow.setPosition(newX, newY)
      exeQuitBrowserWindow.loadURL(url.format({
        pathname: `${ winURL }/exeQuitWindow`
      }))
      // exeQuitBrowserWindow.webContents.openDevTools({ mode: 'detach' })
      exeQuitBrowserWindow.on('closed', () => { exeQuitBrowserWindow = null })
    }
  })

  // 异常退出的窗口
  ipcMain.on('exe-error-window', () => {
    if (!exeErrorBrowserWindow) {
      exeErrorBrowserWindow = new BrowserWindow({
        width: 342,
        height: 210,
        resizable: false,
        // modal: true,
        // transparent: true,
        maximizable: false,
        frame: false,
        parent: browserWindow,
        webPreferences: {
          preload: path.join(__dirname, '../electron-preload/index.js')
        }
      })
      // 让主窗口移动后，小窗口也跟着主窗口
      const exeErrorBrowserWindowWidth = exeErrorBrowserWindow.getSize()[0]
      const exeErrorBrowserWindowHeight = exeErrorBrowserWindow.getSize()[1]

      const newX = Math.round(browserWindowPosition[0] + (browserWindowSize[0] / 2) - (exeErrorBrowserWindowWidth / 2))
      const newY = Math.round(browserWindowPosition[1] + (browserWindowSize[1] / 2) - (exeErrorBrowserWindowHeight / 2))
      
      exeErrorBrowserWindow.setPosition(newX, newY)
      exeErrorBrowserWindow.loadURL(url.format({
        pathname: `${ winURL }/exeErrorWindow`
      }))
      // exeErrorBrowserWindow.webContents.openDevTools({ mode: 'detach' })
      exeErrorBrowserWindow.on('closed', () => { exeErrorBrowserWindow = null })
    }
  })
  ipcMain.on('relaunch-app', () => {
    // console.log(1111)
    app.relaunch()
    app.exit()
  })
  // 载入的文件，可以是本地文件地址或者是URL
  browserWindow.loadURL(url.format({
    pathname: winURL
  }))
  browserWindow.on('maximize', () => {
    browserWindow.webContents.send('set-maxminicon', 'max')
    const sizeData = browserWindow.getContentBounds()
    sizeData.isMax = true
    browserWindow.webContents.send('resize-event', sizeData)
  })
  browserWindow.on('unmaximize', () => {
    browserWindow.webContents.send('set-maxminicon', 'unMax')
    const sizeData = browserWindow.getContentBounds()
    sizeData.isMax = false
    browserWindow.webContents.send('resize-event', sizeData)
  })
  // 窗口改变时，记录窗口的大小，下次登录还是这个大小
  browserWindow.on('resized', () => {
    const sizeData = browserWindow.getContentBounds()
    sizeData.isMax = false
    browserWindow.webContents.send('resize-event', sizeData)
  })
  browserWindow.on('move', () => {
    // browserWindow.focus() // 将焦点设置回主窗口
    browserWindowPosition = browserWindow.getPosition()
    browserWindowSize = browserWindow.getSize()
    // console.log(browserWindowPosition, browserWindowSize)
  })

  browserWindow.on('closed', () => {
    exeInfoBrowserWindow = null
    exeQuitBrowserWindow = null
    app.quit()
  })
  if (process.env.NODE_ENV === 'development') {
    browserWindow.webContents.openDevTools({ mode: 'detach' })
  }

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
  })
  createTray(app, browserWindow, winURL) // 系统托盘
}

// 浏览器开发公安大数据实战平台
ipcMain.on('open-url', (event:any, url:string) => {
  // 打开系统默认浏览器到指定的url
  shell.openExternal(url)
})

// 准备完成的时候，加载视口
app.whenReady().then(() => {
  myWindow = createWindow()
  // 监听当前app的打开的窗口数，如果打开的窗口数为0，重新打开一个视口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 监听app全部视口被关闭的时候
app.on('window-all-closed', () => {
  // 当前app如果不是macOS系统，停止app
  if (process.platform !== 'darwin') app.quit()
})
export {}