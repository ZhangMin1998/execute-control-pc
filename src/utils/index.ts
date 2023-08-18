// 获取加密 key
export function obtainKey() {
  const jsonObj: any = JSON.parse(sessionStorage.getItem('vuex') || '')
  return jsonObj?.User?.privateKeyStr
}

// 判断IE11
export function isIE11() {
  if (/Trident\/7\./.test(navigator.userAgent)) return true
  return false
}
