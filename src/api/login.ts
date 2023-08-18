import request from '@/utils/request'
// 用户登录
export function loginsys(param: object) {
  return request({
    url: '/login/oauth/token',
    method: 'post',
    data: param
  })
}
// 用户退出系统
export function logout(params:object) {
  return request({
    url: '/login/oauth/logout',
    method: 'get',
    params
  })
}

// 个人信息 信息查询
export function authorityById(id: number) {
  return request({
    url: `/authority/${ id }`,
    method: 'get'
  })
}

// 查询账户的菜单
export function getSysMenu() {
  return request({
    url: '/login/auth/menu/nav',
    method: 'get'
  })
}