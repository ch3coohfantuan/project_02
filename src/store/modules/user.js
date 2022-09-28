import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    resultAsyncRoutes: [],
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, data) => {
    state.name = data.name
    state.avatar = data.avatar
    state.routes = data.routes
    state.buttons = data.buttons
    state.roles = data.roles
  },
  SET_RESULTASYNCROUTES: (state, data) => {
    state.resultAsyncRoutes = data
    state.resultAllRoutes = constantRoutes.concat(anyRoutes, state.resultAsyncRoutes)
    router.addRoutes(state.resultAllRoutes)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token)
    if (result.code === 20000) {
      if (!result.data) {
        return Promise.reject(new Error('Verification failed, please Login again.'))
      }
      commit('SET_USERINFO', result.data)
      const filterRoutes = (asyncRoutes, userRoutes) => {
        return asyncRoutes.filter(item => {
          if (userRoutes.indexOf(item.name) != -1) {
            if (asyncRoutes.children && asyncRoutes.children.length) {
              filterRoutes(asyncRoutes.children, userRoutes)
            }
            return true
          }
        })
      }
      let routes = filterRoutes(asyncRoutes, result.data.routes)
      commit('SET_RESULTASYNCROUTES', routes)
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // user logouts
  async logout({ commit, state }) {
    let result = await logout(state.token)
    if (result.code === 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('fail'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

