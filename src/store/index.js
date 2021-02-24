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
    products: {},
    productsSelect: {},
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
    SET_ROOM (state, { newRoom, roomId }) {
      Vue.set(state.rooms, roomId, newRoom)
    },
    APPEND_ROOM_TO_USER (state, { roomId, userId }) {
      Vue.set(state.users[userId].rooms, roomId, roomId)
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
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room
      const roomId = firebase.database().ref('rooms').push().key
      newRoom.userId = state.authId
      newRoom.publishedAt = Math.floor(Date.now() / 1000)
      newRoom.meta = { likes: 0 }

      const updates = {}
      updates[`rooms/${roomId}`] = newRoom
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId
      firebase.database().ref().update(updates).then(() => {
        commit('SET_ROOM', { newRoom, roomId })
        commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId })
        return Promise.resolve(state.rooms[roomId])
      })
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      let instance = firebase.database().ref('rooms')
      if (limit) {
        instance = instance.limitToFirst(limit)
      }
      instance.once('value', (snapshot) => {
        const rooms = snapshot.val()
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId]
          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room })
        })
        resolve(Object.values(state.rooms))
      })
    }),
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
      console.log('momento de FETCH_USER')
      firebase.database().ref('users').child(id).once('value', (snapshot) => {
        commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() })
        resolve(state.users[id])
      })
    }),

    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      console.log('momento de FETCH_AUTH_USER')
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
    },
    FETCH_PRODUCTS: ({ state, commit }, idd) => new Promise((resolve) => {
      // const userId = firebase.auth().currentUser.uid
      console.log('FETCH_PRODUCTS')
      if (!idd) {
        console.log('Aun no logeado')
      }
      // idd = '3Gi1QUPmDTcCG3TW65wjhN50mPq1'
      const instance = firebase.database().ref('depa/abarrotes')
      const instanceSeleccionados = firebase.database().ref('seleccionados') // .child(idd)
      /* if (firebase.auth().currentUser.uid) { */
      // if (state.authId) {
      if (idd) {
        instanceSeleccionados.child(idd)
      }
      // commit('loading/SET_LOADING', false, { root: true })
      instance.once('value', (snapshot) => {
        // console.log(snapshot.val())
        const productos = snapshot.val()
        Object.keys(productos).forEach((productoId) => {
          const producto = productos[productoId]
          // console.log('obtenemos los productosID:' + producto['.key'])
          // console.log(producto)
          if (idd) {
            instanceSeleccionados.once('child_added', querySnapshot => {
              // console.log(querySnapshot.val())

              // console.log('valor:' + snap.val().key)
              // console.log('valor:' + querySnapshot.child(productoId).deseado)
              querySnapshot.forEach((snap) => {
                // console.log('valor:' + snap.key)
                if (snap.key === productoId) {
                  console.log('valor:' + snap.key + ' == ' + productoId)
                  if (snap.val().deseado === 1) {
                    producto.seleccionado = true
                  } else {
                    producto.seleccionado = false
                  }
                  if (snap.val().faltante === 1) {
                    producto.faltante = true
                  } else {
                    producto.faltante = false
                  }
                }
              })
            })
          } else {
            producto.seleccionado = false
            producto.faltante = false
          }
          // console.log(productoId)
          commit('SET_ITEM', { resource: 'products', id: productoId, item: producto })
          // commit('SET_ITEM', { resource: 'productsSelect', id: productoId, item: producto })
        })
        // commit('loading/SET_LOADING', false, { root: true })
        // console.log('set porductos en el obj')
        resolve(Object.values(state.products))
        // commit('loading/SET_LOADING', false, { root: true })
      })
      // commit('loading/SET_LOADING', false, { root: true })
    }),
    SAVE_PRODUCTS: ({ state, commit }, idd, newRoom) => new Promise((resolve) => {
      console.log('SAVE_PRODUCTS id:' + idd)
      console.log('SAVE_PRODUCTS of:' + newRoom)
      // const varname1 = value1 [, varname2 = value2 [, varname3 = value3 [, ... [, varnameN = valueN]]]];
      /*
      const newRoom = room;
      const roomId = firebase.database().ref('rooms').push().key;
      newRoom.userId = state.authId;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };
      const updates = {};
      updates[`rooms/${roomId}`] = newRoom;
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;
      firebase.database().ref().update(updates).then(() => {
        commit('SET_ROOM', { newRoom, roomId });
        commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
        return Promise.resolve(state.rooms[roomId]);
      });
*/
      // const updates = {}
      // updates[`rooms/${roomId}`] = newRoom
      /* updates[`seleccionados/${newRoom.userId}/${roomId}`] = roomId
      firebase.database().ref('seleccionados').child(idd).update(updates).then(() => {
      }) */
    })
  },
  modules: {
    loading
  },
  getters: {
    modals: state => state.modals,
    authUser (state) {
      return (state.authId) ? state.users[state.authId] : null
    }
    // productos: state => state.products
  }
})

// export default store
