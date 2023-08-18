import { createRouter, createWebHistory } from 'vue-router'

const routes: any = [
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/login',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
        children: [
          {
            path: '/home',
            component: () => import('@/views/Warn/index.vue')
          },
          {
            path: '/home2',
            component: () => import('@/views/Warn/index2.vue')
          }
        ]
      },
      {
        path: '/login',
        component: () => import('@/views/Login/index.vue')
      }
    ]
  },
  {
    path: '/exeWindow',
    name: 'ExeWindow',
    component: () => import('@/views/ExeInfo/index.vue'),
    meta: {
      title: '关于客户端'
    }
  },
  {
    path: '/exeQuitWindow',
    name: 'ExeQuitWindow',
    component: () => import('@/views/ExeQuit/index.vue')
  },
  {
    path: '/exeErrorWindow',
    name: 'ExeErrorWindow',
    component: () => import('@/views/ExeError/index.vue')
  },
  {
    path: '/newMessage',
    name: 'NewMessage',
    component: () => import('@/views/NewMessage/index.vue'),
    meta: {
      title: '新消息提醒'
    }
  }
]

// 如果没匹配上路由则自动跳转到 404
routes.push({
  path: '/*',
  redirect: '/404'
})

// 路由实例
const router: any = createRouter({
  history: createWebHistory(),
  routes
})

// 需根据实际情况进行更改
// router.beforeEach(async (to) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     return true
//   }
//   if (!to.name) {
//     return { name: "Login" }
//   }
//   if (to.name === "Login.index") {
//     return true
//   }
//   return { name: "Login" }
// })

export default router