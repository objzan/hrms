import router, { asyncRoutes } from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from './store'
import nProgress from 'nprogress'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      nProgress.done()
    } else {
      next()
      if (!store.getters.name) {
        const menus = await store.dispatch('user/getUserInfoActions')
        const filterList = asyncRoutes.filter(routeObj => {
          const routeName = routeObj.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })
        filterList.push({ path: '*', redirect: '/404', hidden: true })
        router.addRoutes(filterList)
        store.commit('permission/setRoutes', filterList)

        next({
          path: to.path,
          replace: true
        })
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  document.title = getPageTitle(to.meta.title)
  nProgress.done()
})
