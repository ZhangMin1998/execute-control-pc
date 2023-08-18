const { ipcMain } = require('electron')
const Store = require('electron-store')

const store = new Store()
console.log('path', store.path)
// 存储数据
ipcMain.handle('window-store-data', (event, key, value) => {
  store.set(key, value)
})
// 取出数据
ipcMain.handle('window-get-data', (event, key) => {
  const value = store.get(key)
  // console.log(store.path) // 获取存储文件的路径
  return value
})
// 查找数据路径
ipcMain.handle('window-get-data-path', (event, key) => {
  const value = store.path
  return value
})
