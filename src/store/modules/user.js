import { loginAPI } from '@/api'
import { getToken, setToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async loginActions({ commit }, data) {
    const res = await loginAPI(data)
    commit('SET_TOKEN', res.data)
    // 把结果返回调用处
    // 只要不是Promise.reject()都是成功值
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
