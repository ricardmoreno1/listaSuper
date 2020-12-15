import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import loading from './modules/loading'
// import sourceData from './data.json'
Vue.use(Vuex)

// cosnt store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    // ...sourceData,
    count: 0,
    users: {},
    services: {},
    rooms: {},
    authId: null,
    modals: {
      login: false,
      register: false
    }
  },
  mutations: {
    increments (state) {
      state.count++
    },
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value
    },
    SET_ITEM (state, { item, id, resource }) {
      const newItem = item
      newItem['.key'] = id
      Vue.set(state[resource], id, newItem)
    },
    SET_AUTHID (state, id) {
      state.authId = id
    }
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value })
    },
    CREATE_USER: ({ state, commit }, { name, email, password }) => new Promise((resolve) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
        const id = account.user.uid
        const registeredAt = Math.floor(Date.now() / 1000)
        const newUser = { email, name, registeredAt }
        firebase.database().ref('users').child(id).set(newUser)
          .then(() => {
            commit('SET_ITEM', { resource: 'users', id, item: newUser })
            resolve(state.users[id])
          })
      })
    }),
    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve) => {
      firebase.database().ref('users').child(id).once('value', (snapshot) => {
        commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() })
        resolve(state.users[id])
      })
    }),

    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser.uid
      return dispatch('FETCH_USER', { id: userId })
        .then(() => {
          commit('SET_AUTHID', userId)
        })
    },
    SIGN_IN (context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    LOG_OUT ({ commit }) {
      firebase.auth().signOut()
        .then(() => {
          commit('SET_AUTHID', null)
        })
    }
  },
  modules: {
    loading
  },
  getters: {
    modals: state => state.modals,
    authUser (state) {
      return (state.authId) ? state.users[state.authId] : null
    }
  }
})

// export default store
