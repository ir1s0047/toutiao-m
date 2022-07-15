import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, getToken } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 申明token
    user: getToken || {}
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // 把token放在本地
      setToken(payload)
    }
  }
})
