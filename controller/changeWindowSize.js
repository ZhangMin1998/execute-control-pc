const { ipcMain, BrowserWindow } = require('electron')

// 改变窗口大小
ipcMain.on('change-window-size', (event, width, height, isLogin) => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  // win.setOpacity(0)
  win.setMinimumSize(width, height)
  win.setSize(width, height)
  win.setResizable(isLogin)
  win.setMaximizable(isLogin)
  win.center()
  win.minimize()
  win.show()
  setTimeout(() => {
    // win.setOpacity(1)
    win.focus()
  }, 500)
})

// 最小化
ipcMain.on('window-min', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.minimize()
})

// 最大化
ipcMain.on('window-max', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  // console.log(win.isMaximized())
  if (win.isMaximized()) {
    win.restore()
  } else {
    win.maximize()
  }
})

// 关闭
ipcMain.on('window-close', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.close()
})
// 隐藏
ipcMain.on('window-hide', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.hide()
})

// 显示
ipcMain.on('window-show', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.show()
})

// 显示
ipcMain.on('window-set-opacity', (event, opacity) => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.setOpacity(opacity)
})

// 关于客户端窗口关闭
ipcMain.on('exe-window-close', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.close()
})

// 退出客户端窗口关闭
ipcMain.on('exe-quit-window-close', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.close()
})

// 退出客户端窗口最小化
ipcMain.on('exe-quit-window-min', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.minimize()
})

// 异常退出窗口关闭
ipcMain.on('exe-error-window-close', event => {
  const webContent = event.sender
  const win = BrowserWindow.fromWebContents(webContent)
  win.close()
})
