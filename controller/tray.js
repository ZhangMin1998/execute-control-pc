// 创建系统托盘
const { Tray, Menu, ipcMain, nativeImage, screen, BrowserWindow } = require('electron')
const url = require('url')
// const { ipcRenderer } = require('electron')
const path = require('path')

function createTray (app, win, winURL) {
  let tray 
  if (process.env.NODE_ENV === 'development') {
    tray = new Tray(path.join(__dirname, '../public/logo.ico'))
  } else {
    tray = new Tray(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico'))
  }
  tray.setToolTip('公安大数据平台') // 鼠标放在托盘图标上的提示信息

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '退出',
      // icon: './public/logo.ico',
      click: () => {
        // 先把用户的登录状态和用户的登录信息给清楚掉,再退出
        win.webContents.send('close-win-by-tray')
        app.quit()
      }
    }
  ]))

  // 托盘闪烁 + 移入托盘显示消息
  // let informNum = 0
  let timer = null
  let msgFlag = false
  ipcMain.on('have-message-with-show-message', (event, arg) => {
    // 判断主窗口是否在屏幕最前端  不是的话 托盘才会闪烁提醒和消息提醒
    // const sysWin = BrowserWindow.getFocusedWindow()
    // if (sysWin && sysWin.isFocused()) {
    //   return
    // }
    if (win.isMinimized()) {
      // 如果是最小化状态，则恢复窗口
      win.restore()
      return
    }
    win.show()
    // informNum += 1
    // if (informNum === 1) {
    //   timer = setInterval(() => {
    //     msgFlag = !msgFlag
    //     // msgFlag ? tray.setImage(nativeImage.createEmpty()) : tray.setImage('./public/logo.ico')
    //     msgFlag ? tray.setImage(nativeImage.createEmpty())
    //       : (process.env.NODE_ENV === 'development'
    //         ? tray.setImage('./public/logo.ico') : tray.setImage(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico')))
    //     tray.setToolTip('您有新消息')
    //   }, 500)
    // }
    // setTimeout(() => {
    //   // tray.displayBalloon({
    //   //   title: '通知标题',
    //   //   content: '通知内容',
    //   //   iconType: 'info'
    //   // })
    //   // let notification = new Notification({
    //   //   title: 'My App',
    //   //   body: 'Hello, world!'
    //   // })
    //   // notification.show()
    //   win.flashFrame(true) // 任务栏闪烁  true 为闪烁， false为取消
    // }, 1000)
    // menuWin.webContents.send('show-message', arg)
  })
  // 关闭消息提醒列表和停止闪烁
  ipcMain.on('no-message', (event, arg) => {
    // console.log(event, arg)
    // informNum = 0
    if (process.env.NODE_ENV === 'development') { // 防止 win.show() 后系统托盘图标的 空白现象
      tray.setImage('./public/logo.ico')
    } else {
      tray.setImage(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico'))
    }
    // tray.setImage('./public/logo.ico') // 防止 win.show() 后系统托盘图标的 空白现象
    clearInterval(timer)
    tray.setToolTip('公安大数据平台')
    timer = null
    msgFlag = false
    menuWin.hide()
  })
  
  // 完全关闭客户端
  ipcMain.on('window-close-all', () => {
    app.quit()
  })

  tray.on('click', (e) => {
    if (e.shiftKey) {
      app.quit()
    } else {
      // win.isVisible() ? win.hide() : win.show()
      win.show()
      // informNum = 0
      if (process.env.NODE_ENV === 'development') {
        tray.setImage('./public/logo.ico') // 防止 win.show() 后系统托盘图标的 空白现象
      } else {
        tray.setImage(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico'))
      }
      // tray.setImage('./public/logo.ico') // 防止 win.show() 后系统托盘图标的 空白现象
      clearInterval(timer)
      tray.setToolTip('公安大数据平台')
      timer = null
      msgFlag = false
    }
  })

  // const winURL = process.env.NODE_ENV === 'development'
  //   ? 'http://localhost:7070'
  //   : 'http://192.168.1.182:9233' // 打包的时候，改成部署的测试环境

  let menuWin = new BrowserWindow({
    width: 222,
    height: 240,
    resizable: false,
    movable: false,
    show: false,
    alwaysOnTop: true, // 让窗口层级最高
    // parent: win,
    // modal: true,
    // autoHideMenuBar: true,
    // disableAutoHideCursor: true, 
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../electron-preload/index.js')
    }
  })
  // menuWin.loadURL(url.format({
  //   pathname: `${ winURL }/newMessage`
  // }))
  menuWin.loadURL(`${ winURL }/newMessage`)
  // menuWin.webContents.openDevTools({ mode: 'detach' }) // 打开控制台

  // 改变窗口大小
  ipcMain.on('change-small-window-size', (event, width, height) => {
    menuWin.setMinimumSize(width, height)
    menuWin.setSize(width, height)

    const trayBounds = tray.getBounds() // 获取托盘的位置
    const params = {
      x: trayBounds.x - 111,
      y: trayBounds.y - height
    }
    menuWin.setBounds(params)
  })
  
  // 点击消息提醒列表打开页面
  ipcMain.on('open-window-with-click-event', (event, arg) => {
    // console.log('arg', arg)
    win.webContents.send('click-event', arg)
    win.show()
  })

  // const trayBounds = tray.getBounds() // 获取托盘的位置
  // const params = {
  //   x: trayBounds.x - 111,
  //   y: trayBounds.y - 239
  // }
  // menuWin.setBounds(params) // 根据托盘的位置给消息栏设置位置
  menuWin.setSkipTaskbar(true) // 让窗口不在任务栏中显示

  // 检查鼠标是否从托盘离开
  const checkTrayLeave = () => {
    clearInterval(this.leaveInter)
    this.leaveInter = setInterval(() => {
      const trayBounds = tray.getBounds()
      const point = screen.getCursorScreenPoint()
      // 判断是否再托盘内
      if (!(trayBounds.x < point.x && trayBounds.y < point.y && point.x < (trayBounds.x + trayBounds.width) && point.y < (trayBounds.y + trayBounds.height))) {
        // 判断是否在弹出菜单内
        const menuBounds = menuWin.getBounds()
        if (menuBounds.x < point.x && menuBounds.y < point.y && point.x < (menuBounds.x + menuBounds.width) && point.y < (menuBounds.y + menuBounds.height)) {
          // console.log('isOnMenupage')
          return 
        }
        // 触发 mouse-leave
        clearInterval(this.leaveInter)
        menuWin.hide() // 隐藏菜单栏
        isLeave = true
      } else {
        // console.log('isOn')
      }
    }, 100)
  }

  let isLeave = true
  tray.on('mouse-move', (event, point) => {
    // win.hide()
    if (!msgFlag) { // 如果没用新消息  移入托盘就不显示消息列表
      return
    }
    if (isLeave) { // 从其他地方第一次移入菜单时，开始显示菜单页，然后在菜单内移动时不重复再显示菜单
      menuWin.show()
    }
    isLeave = false
    checkTrayLeave()
  })
}
module.exports = createTray