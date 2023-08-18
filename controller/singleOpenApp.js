const singleOpenApp = (app, myWindow) => {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      // 输出从第二个实例中接收到的数据
      // 有人试图运行第二个实例，我们应该关注我们的窗口
      if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore()
        myWindow.focus()
      }
    })
  }
}
module.exports = singleOpenApp
