import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, getToken, setSearch, getSearch } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 申明token
    user: getToken() || {},
    search: getSearch() || []
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // 把token放在本地
      setToken(payload)
    },
    setSearch(state, searchInfo) {
      state.search = searchInfo
      setSearch(searchInfo)
    }
  }
})
