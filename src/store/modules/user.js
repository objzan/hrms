import { loginAPI, getUserProfileAPI, getUserStaffPhotoAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}, // 用户信息
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
  REMOVE_TOKEN: state => {
    state.token = ''
    removeToken()
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 获取用户信息
  SET_USER: (state, value) => {
    state.userInfo = value
  },
  // 清空用户信息
  REMOVE_USER(state) {
    state.userInfo = {}
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
  },

  async getUserInfoActions({ commit }) {
    const { data: userObj } = await getUserProfileAPI()
    console.log(userObj)
    const { data: photoObj } = await getUserStaffPhotoAPI(userObj.userId)
    const newObj = { ...userObj, ...photoObj }
    commit('SET_USER', newObj)

    return userObj.roles.menus
  },

  async logOutActions({ commit }) {
    commit('REMOVE_TOKEN')
    commit('RESET_STATE')
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
