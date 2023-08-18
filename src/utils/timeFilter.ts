import dayjs from 'dayjs'

// 时间戳转 YYYY/MM/DD HH:mm:ss
function filterNTS (value:any) {
  if (!value) return ''
  if (typeof value == 'string') {
    value = parseInt(value)
  }
  return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
}

// YYYY/MM/DD HH:mm:ss 转 时间戳
function filterSTN (value:string) {
  if (!value) return ''
  /* eslint-disable */
  const timeString:string = value.replace(new RegExp('-', 'gm'), '/')
  return (new Date(timeString)).getTime()
}

// 时间戳判断  今天？ 本周几？ 本周前日期？
function filterTime (value:any) {
  if (!value) return ''
  if (typeof value == 'string') {
    value = parseInt(value)
  }
  // const nowTime = new Date().getTime() // 当前时间
  const zeroDate = new Date(new Date().toLocaleDateString()).getTime() // 获取当前0点的时间戳
  const day = new Date().getDay() > 0 ? new Date().getDay() : 7 // 表示当前是周几
  const oneDayTime = 24 * 60 * 60 * 1000 // 一天的总ms
  const MondayZeroTime = zeroDate - (day - 1) * oneDayTime // 本周一0点时间戳
  const yesterday = zeroDate - oneDayTime // 昨天0点时间戳

  if (value > zeroDate) { // 今天之内的
    return dayjs(value).format('HH:mm')
  }
  if (value > yesterday && value < zeroDate) { // 昨天之内的
    return '昨天'
  }
  if (value > MondayZeroTime && value < yesterday) { // 在本周和昨天0点之间的
    // return new Date(value).getDay()
    switch (new Date(value).getDay()) {
      case 0:
        return '周日'
      case 1:
        return '周一'
      case 2:
        return '周二'
      case 3:
        return '周三'
      case 4:
        return '周四'
      case 5:
        return '周五'
      case 6:
        return '周六'
    }
  }
  return dayjs(value).format('YY/MM/DD')
}

export { filterNTS, filterSTN, filterTime }