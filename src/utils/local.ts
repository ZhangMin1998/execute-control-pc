// 保存
function setLocal (value:string, key = 'token') {
  window.localStorage.setItem(key, value)
}

// 获取
function getLocal (key = 'token') {
  return window.localStorage.getItem(key)
}

// 删除
function removeLocal (key = 'token') {
  window.localStorage.removeItem(key)
}

export { setLocal, getLocal, removeLocal }
