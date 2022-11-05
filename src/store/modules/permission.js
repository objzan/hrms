import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: () => {
    return {
      routes: constantRoutes
    }
  },
  mutations: {
    setRoutes(state, asyncRoutes) {
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
