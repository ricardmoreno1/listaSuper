import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
Vue.use(Vuex)

// cosnt store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increments (state) {
      state.count++
    }
  },
  actions: {
  },
  modules: {
    loading
  }
})

// export default store
