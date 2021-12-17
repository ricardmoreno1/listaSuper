import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
// opc 1
import loading from './modules/loading'
// opc 2
// import * as Shopping from './modules/loading'

// import { map } from 'core-js/core/array'
// import sourceData from './data.json'
// import sourceData from './../data2.json'
Vue.use(Vuex)

// cosnt store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    // ...sourceData,
    count: 0,
    users: {},
    isExistProduct: false,
    products: {},
    productsSelect: {},
    catProducts: {},
    catStore: {},
    // catCategories: {},
    services: {},
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
    // APPEND_ROOM_TO_USER (state, { roomId, userId }) {
    //   Vue.set(state.users[userId].rooms, roomId, roomId)
    // },
    SET_ITEM (state, { item, id, resource }) {
      const newItem = item
      newItem['.key'] = id
      Vue.set(state[resource], id, newItem)
    },
    SET_CATPRODUCT (state, { item, id, resource }) {
      console.log('item:id[' + id + '] name[' + item.name + ']', state.catProducts[id])
      state.catProducts[id].name = item.name
      state.catProducts[id].descripcion = item.descripcion
    },
    SET_CATSTORE (state, { item, id, resource }) {
      console.log('Storeitem:id[' + id + '] name[' + item.name + ']', state.catProducts[id])
      state.catStore[id].name = item.name
      state.catStore[id].descripcion = item.descripcion
    },
    SET_EXIST_PRODUCT: (state, { value }) => {
      console.log('SET_EXIST_PRODUCT value [' + value + ']')
      state.isExistProduct = value
    },
    SET_PRODUCT (state, { newProduct, id }) {
      const resource = 'products'
      // console.log('id[' + id + '  ]')
      const newItem = newProduct
      newItem['.key'] = id
      Vue.set(state[resource], id, newItem)
      // state.products.push(newProduct)
    },
    SET_CAT_PRODRUCT (state, { newProduct, id }) {
      state.catProducts.push(newProduct)
    },
    SET_AUTHID (state, id) {
      state.authId = id
    },
    SET_DATA_PRODUCTO (state, { id, valueprice, valuestore, valueselect }) {
      state.products[id].precios.last = valueprice
      state.products[id].tiendas.last = valuestore
      state.products[id].seleccionado = valueselect
      state.products[id].newPrecio = ''
      state.products[id].newTienda = ''
    },
    SET_DATA_PRODUCTO_OFERTA (state, { id, valueoferta, valuepriceoferta }) {
      console.log('SET_DATA_PRODUCTO_OFERTA')
      console.log(id, valueoferta, valuepriceoferta)
      state.products[id].oferta = valueoferta
      state.products[id].precios.promo = valuepriceoferta
      state.products[id].newPricehasPromo = false
    }
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value })
    },
    UPDATE_DATA_PROD: ({ commit }, { id, valueprice, valuestore, valueselect, valueoferta, valuepriceoferta }) => {
      // console.log('agregando los valores al elemento modificado')
      // console.log(id, valueoferta, valuepriceoferta)
      commit('SET_DATA_PRODUCTO', { id, valueprice, valuestore, valueselect })
      if (valueoferta) {
        commit('SET_DATA_PRODUCTO_OFERTA', { id, valueoferta, valuepriceoferta })
      }
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
    /** Carga de un archivo datos de muchos productos  */
    LOAD_PRODUCTOS_FT: ({ state, commit }) => new Promise((resolve) => {
      console.log('cargando Productos- ', state.productosLoad)
      Object.values(state.productosLoad).forEach((elemento) => {
        const preciosAux = elemento.precios
        const preciosH = []
        Object.entries(preciosAux).forEach((price) => {
          console.log('key[' + price[0] + '] value[' + price[1] + ']', price)
          if (price[0] !== 'last' && price[0] !== 'promo') {
            const tem = price[0] + '-' + price[1]
            preciosH.push(tem)
          }
        })
        const tiendasAux = elemento.tiendas
        const tiendasH = []
        Object.entries(tiendasAux).forEach((tienda) => {
          console.log('key[' + tienda[0] + '] value[' + tienda[1] + ']', tienda)
          if (tienda[0] !== 'last' && tienda[0] !== 'promo') {
            const tem = tienda[0] + '-' + tienda[1]
            tiendasH.push(tem)
          }
        })
        elemento.preciosHis = preciosH
        elemento.tiendasHis = tiendasH
        console.log('elemento', elemento)
        const db = firebase.firestore()
        db.collection('productos')
          .add(elemento)
          .then(docRef => {
            console.log(`FireStore: save: UID is => ${docRef.id}`)
          })
          .catch(error => {
            console.log(`Error guardando el producto ${error} `)
          })
      })
    }),
    DELETE_PRODUCTOS_FT: ({ state, commit }) => {
      console.log('borrarndo productos ')
      const db = firebase.firestore()

      Object.keys(state.products).forEach((id) => {
        console.log('id [' + id + '] ')
        db.collection('productos').doc(id).delete()
      })
      // db.collection('productos').doc(id).delete()
    },
    RESPALDAR_PRODUCTOS_FT: ({ state }) => {
      console.log('respaldar productos ')
      // Para guardarlo en el localStorages
      // const data = JSON.stringify(state.products)
      // window.localStorage.setItem('arr', data)
      // console.log(JSON.parse(window.localStorage.getItem('arr')))

      const data = JSON.stringify(state.products)
      const blob = new Blob([data], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = 'testRespaldo.json'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    CREATE_USER: ({ state, commit }, { name, email, password, rol }) => new Promise((resolve) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
        const id = account.user.uid
        const registeredAt = Math.floor(Date.now() / 1000)
        const newUser = { email, name, registeredAt, rol }
        firebase.database().ref('users').child(id).set(newUser)
          .then(() => {
            commit('SET_ITEM', { resource: 'users', id, item: newUser })
            resolve(state.users[id])
          })
        // Version qNueva con updateProfile, revisar que hace
        // account.user.updateProfile({
        //   displayName: name
        // })
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
      // console.log('----------FETCH_PRODUCTS--------------')
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
                  // console.log('valor:' + snap.key + ' == ' + productoId)
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
    FETCH_PRODUCTS_RT: ({ state, commit }, idd) => new Promise((resolve) => {
      // console.log('FETCH_PRODUCTS_RT: Version para obtener articulos en RealTime ')
    }),
    FETCH_PRODUCTS_FT: ({ state, commit }, idd) => new Promise((resolve) => {
      // console.log('FETCH_PRODUCTS_FT: Version para obtener articulos en FireStore ')
      var mapas = {}
      const db = firebase.firestore()
      const refUser = db.collection('seleccionados').doc(state.authId)
      refUser.get()
        .then((respDoc) => {
          // console.log('prdocuto ', respDoc.data())
          if (respDoc.empty) {
            console.log('No matching documents.')
            return
          }
          mapas = respDoc.data()
        })

      firebase.firestore().collection('productos')
        .orderBy('categoria', 'asc')
        .get().then(querySnapshot => {
          querySnapshot.forEach(datita => {
            // console.log(`querySingle postID  => ${datita.id}`, datita.data())
            let isSeleccionado = false
            let isDeseado = false
            if (mapas) {
              Object.keys(mapas).forEach((productoId) => {
                const producto = mapas[productoId]
                if (productoId === datita.id) {
                  // console.log('------producto--[' + productoId + ']-[' + producto.seleccionado + '] deseado[' + producto.deseado + ' ]')
                  isSeleccionado = producto.seleccionado !== undefined ? producto.seleccionado : false
                  isDeseado = producto.deseado !== undefined ? producto.deseado : false
                }
              })
            }
            const intem = {
              ...datita.data(),
              seleccionado: isSeleccionado,
              deseado: isDeseado
            }
            // Cuaquiera de los dos commits funciona
            commit('SET_PRODUCT', { newProduct: intem, id: datita.id })
            // commit('SET_ITEM', { resource: 'products', id: datita.id, item: intem })
          })
        })
      resolve(Object.values(state.products))
    }),

    FETCH_CAT_PRODUCTOS_FT: ({ state, commit }, idd) => new Promise((resolve) => {
      // console.log('FETCH_CAT_PRODUCTOS_FT: Version para obtener CATEGORIAS en FireStore ')
      firebase.firestore().collection('catProducto')
        // .orderBy('name', 'asc')
        .get().then(querySnapshot => {
          // const querySnapshot2 = querySnapshot.data()
          // console.log('cat: id[' + querySnapshot.id + '] data[ ' + querySnapshot.data() + ' ]', querySnapshot.data())
          // Object.keys(querySnapshot2).forEach((catprodId) => {
          //   const intem = querySnapshot2[catprodId]
          //   console.log('cat: id[' + catprodId + '] data[ ' + intem.name + ' ]', intem)
          // })
          // querySnapshot.forEach(datita => {
          //   console.log('cat: id[' + datita.id + '] data[ ' + datita.name + ' ]', datita)
          //   commit('SET_ITEM', { resource: 'catProducts', id: datita.id, item: datita.data() })
          // })
          querySnapshot.forEach(cat => {
            // console.log('FireStore: cat:Categorias id[' + cat.id + '] data[ ' + cat.data().name + ' ]', cat.data())
            commit('SET_ITEM', { resource: 'catProducts', id: cat.id, item: cat.data() })
          })
        })
        // resolve(Object.values(state.catProducts))
    }),

    FETCH_CAT_TIENDAS_FT: ({ state, commit }, idd) => new Promise((resolve) => {
      // console.log('FETCH_CAT_TIENDAS_FT: Version para obtener TIENDAS en FireStore ')
      // firebase.firestore().collection('tiendas')
      firebase.firestore().collection('catStores')
        .orderBy('name', 'asc')
        .get().then(querySnapshot => {
          querySnapshot.forEach(datita => {
            // console.log('FireStore: cat:tienda: id[' + datita.id + '] data[ ' + datita.data().name + ' ]', datita.data())
            commit('SET_ITEM', { resource: 'catStore', id: datita.id, item: datita.data() })
          })
        })
      // resolve(Object.values(state.catStore))
    }),

    // FETCH_CAT_CATEGORIES_FT: ({ state, commit }, idd) => new Promise((resolve) => {
    //   console.log('FETCH_CAT_CATEGORIES_FT: Version para obtener CATEGORIAS en FireStore ')
    //   firebase.firestore().collection('catProducto')
    //     .orderBy('name', 'asc')
    //     .get().then(querySnapshot => {
    //       querySnapshot.forEach(datita => {
    //         console.log('cat: id[' + datita.id + '] data[ ' + datita.data().name + ' ]', datita.data())
    //         commit('SET_ITEM', { resource: 'catStore', id: datita.id, item: datita.data() })
    //       })
    //     })
    //   // resolve(Object.values(state.catStore))
    // }),

    SAVE_PRODUCTS_RT: ({ state, commit }, newElem) => new Promise((resolve) => {
      console.log('Version para guarda un articulo en RealTime de FireBase ')
      // console.log('SAVE_PRODUCTS_RT id: ' + idd)
      // console.log('SAVE_PRODUCTS_RT Elemento: ' + newElem)
      firebase.database().ref('depaTest/abarrotes').on('value', (snapshot) => {
        // console.log('There are ' + snapshot.numChildren() + ' messages')
        // snapshot.numChildren()
        console.log('tamaño de regitros ', snapshot.numChildren())
        const nmeron = snapshot.numChildren()
        console.log('tamaño de regitros nmeron ', nmeron)
        firebase.database().ref('depaTest/abarrotes').child(1).update(newElem)
      })

      // console.log('tamaño de regitros ', numrop)
      // firebase.database().ref('depaTest/abarrotes').child(numrop).update(newElem)
      // firebase.database().ref('depaTest/abarrotes').
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
    }),
    SAVE_PRODUCTS_FS: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        console.log('SAVE_PRODUCTS_FireStore: Version para guarda un articulo Nuevo en FireStore ')
        console.log('SAVE_PRODUCTS_FS elemento:', newEle)
        const db = firebase.firestore()
        // const settings = { timestampsInSnapshots: true }
        // db.settings(settings) //no fuiona ya
        db.collection('productos')
          .add(newEle)
          .then(docRef => {
            resolve()
            // console.log(`FireStore: save: UID is => ${docRef.id}`)
          })
          .catch(error => {
            console.log(`Error guardando el producto ${error} `)
            reject(error)
          })
      })
    },
    //  Version sin regresar la promesa
    // SAVE_PRODUCTSBYUSER_FS: ({ state, commit }, newEle) => new Promise((resolve) => {
    //   console.log('SAVE_PRODUCTSBYUSER_FireStore: Version para guarda un articulo en FireStore ')
    //   console.log('SAVE_PRODUCTSBYUSER_FS elemento state.authId [' + state.authId + ']', newEle)
    //   const db = firebase.firestore()

    //   const intem = {
    //     ...newEle
    //   }
    //   console.log('elementos a guardar ', intem)
    //   const refUser = db.collection('seleccionados').doc(state.authId)
    //   refUser.update(intem

    //   )
    // }),
    // Verion regresando
    SAVE_PRODUCTSBYUSER_FS: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        // console.log('SAVE_PRODUCTSBYUSER_FireStore: Version para guarda un articulo en FireStore ')
        // console.log('SAVE_PRODUCTSBYUSER_FS elemento state.authId [' + state.authId + ']', newEle)
        const db = firebase.firestore()
        const intem = {
          ...newEle
        }
        console.log('elementos a guardar ', intem)
        const refUser = db.collection('seleccionados').doc(state.authId)
        // console.log('---------SAVE_PRODUCTSBYUSER_FS', refUser)
        refUser.get().then((result) => {
          if (result.exists) {
            console.log('---------Actualiza')
            refUser.update(intem
            ).then(() => {
              resolve()
            })
          } else {
            console.log('---------crea')
            db.collection('seleccionados').doc(state.authId).set(intem)
          }
        }).catch(() => console.log('Ocurrio un error al guardar los productos de los productos'))
        // .catch(error => {
        //   reject()
        // })
      })
    },
    SAVE_PRICE_PRODUCTSBYUSER_FS: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        // console.log('SAVE_PRICE_PRODUCTSBYUSER_FS_FireStore: Version para guarda un nuevo precio de un producto en FireStore ')
        // console.log('SAVE_PRICE_PRODUCTSBYUSER_FS elemento state.authId [' + state.authId + ']', newEle)
        const db = firebase.firestore()
        Object.keys(newEle).forEach((id) => {
          console.log('elementos a actualizar s  us precios id[' + id + '] ')
          const item = newEle[id]
          const refUser = db.collection('productos').doc(id)
          refUser.update(item
          ).then(() => {
            resolve()
          })
        })
      })
    },
    // v1 SIN regresar promesa
    // SAVE_STORE_FS: ({ state, commit }, newEle) => new Promise((resolve) => {
    //   console.log('SAVE_STORE_FireStore: Version para guarda un tiendas en FireStore ')
    //   const db = firebase.firestore()
    //   const intem = {
    //     ...newEle
    //   }
    //   console.log('elementos a guardar ', intem)
    //   db.collection('tiendas') // catStores
    //     .add(newEle)
    //     .then(docRef => {
    //       console.log(`tienda UID is => ${docRef.id}`)
    //       commit('SET_ITEM', { resource: 'catStore', id: docRef.id, item: intem })
    //     })
    //     .catch(error => {
    //       console.log(`Error guardando el producto ${error} `)
    //     })
    // }),
    // v2 Regresnado promesa, Ya fucnciona
    SAVE_STORE_FS ({ state, commit }, newEle) {
      return new Promise((resolve, reject) => {
        // console.log('SAVE_STORE_FS: Version para guradar TIENDAS en FireStore ')
        const db = firebase.firestore()
        const intem = {
          ...newEle
        }
        // console.log('elementos a guardar ', intem)
        // db.collection('tiendas')
        db.collection('catStores')
          .add(newEle)
          .then(docRef => {
            // console.log(`tienda UID is => ${docRef.id}`)
            commit('SET_ITEM', { resource: 'catStore', id: docRef.id, item: intem })
            resolve()
          })
          .catch(error => {
            console.log(`Error guardando el producto ${error} `)
            reject(error)
          })
          // resolve(Object.values(state.catStore))
      })
    },
    SAVE_CATEGORY_FS ({ state, commit }, newEle) {
      return new Promise((resolve, reject) => {
        // console.log('SAVE_CATEGORY_FS: Version para guradar CATEGORIAS en FireStore ')
        const db = firebase.firestore()
        const intem = {
          ...newEle
        }
        console.log('elementos a guardar ', intem)
        db.collection('catProducto')
          .add(newEle)
          .then(docRef => {
            console.log(`categoria UID is => ${docRef.id}`)
            commit('SET_ITEM', { resource: 'catProducts', id: docRef.id, item: intem })
            resolve()
          })
          .catch(error => {
            console.log(`Error guardando el producto ${error} `)
            reject(error)
          })
      })
    },
    UPDATE_CATEGORY_FS: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        console.log('Actualizar Categoria', newEle)
        const id = newEle.id
        delete newEle.id
        const db = firebase.firestore()
        const refUser = db.collection('catProducto').doc(id)
        refUser.update(newEle
        ).then(() => {
          console.log('SE Actualizar Categoria', newEle)
          commit('SET_CATPRODUCT', { resource: 'catProducts', id: id, item: newEle })
          resolve()
        })
      })
    },
    UPDATE_STORE_FS: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        console.log('Actualizar Store', newEle)
        const id = newEle.id
        delete newEle.id
        const db = firebase.firestore()
        const refUser = db.collection('catStores').doc(id)
        refUser.update(newEle
        ).then(() => {
          console.log('SE Actualizar Store', newEle)
          // commit('SET_CATPRODUCT', { resource: 'catStore', id: id, item: newEle })
          commit('SET_CATSTORE', { resource: 'catStore', id: id, item: newEle })
          resolve()
        })
      })
    },
    UPDATE_PRODUCTS_FS: ({ state, commit }, newEle) => new Promise((resolve) => {
      console.log('UPDATE_PRODUCTS_ FireStore: Version para guarda un articulo Nuevo en FireStore ')
      console.log('UPDATE_PRODUCTS_ FS elemento:', newEle)
      // const settings = { timestampsInSnapshots: true }
      // db.settings(settings) //no fuiona ya
      const id = newEle.id
      console.log('UPDATE_PRODUCTS_ FS elemento[' + id + ']')
      delete newEle.id
      const db = firebase.firestore()
      const refUser = db.collection('productos').doc(id)
      refUser.update(newEle
      ).then(() => { // **falta acualizar en la
        // console.log('Se Actualiza Producto')
        commit('SET_PRODUCT', { newProduct: newEle, id: id })
        // commit('SET_CATPRODUCT', { resource: 'catStore', id: id, item: newEle })
        // commit('SET_CATSTORE', { resource: 'catStore', id: id, item: newEle })
        resolve()
      })
      // db.collection('productos')
      //   .add(newEle)
      //   .then(docRef => {
      //     console.log(`FireStore: save: UID is => ${docRef.id}`)
      //   })
      //   .catch(error => {
      //     console.log(`Error guardando el producto ${error} `)
      //   })
    }),
    IS_EXIST_PROD1: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        const catSelec = Object.values(Object.entries(state.products).filter(([_, a]) => {
          return (a.name === newEle.name && a.marca === newEle.marca)
        }))
        if (catSelec.length >= 1) {
          console.log('Ya existe este producto:', catSelec.length)
          commit('SET_EXIST_PRODUCT', { value: true })
          resolve()
        } else {
          console.log('NO existe este producto:', catSelec.length)
          commit('SET_EXIST_PRODUCT', { value: false })
          resolve()
        }
      })
    },
    IS_EXIST_PROD_UP: ({ state, commit }, newEle) => {
      return new Promise((resolve, reject) => {
        const catSelec = Object.entries(state.products).filter(([_, a]) => {
          return (a.name === newEle.name && a.marca === newEle.marca)
        })
        if (catSelec.length >= 1) {
          console.log('Ya existe este producto:', catSelec)
          console.log('Ya existe este producto: sel[' + catSelec[0][0] + ' ] elemen[' + newEle.id + ']')
          if (catSelec[0][0] === newEle.id) {
            commit('SET_EXIST_PRODUCT', { value: false })
          } else {
            commit('SET_EXIST_PRODUCT', { value: true })
          }
          resolve()
        } else {
          console.log('NO existe este producto:', catSelec.length)
          commit('SET_EXIST_PRODUCT', { value: false })
          resolve()
        }
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
    },
    // authUser: state => state.users[state.authId], // puede ser la Version anterior
    products: state => state.products,
    catProducts: state => state.catProducts,
    catStores: state => state.catStore,
    isExistProduct: state => state.isExistProduct
    // catCategories: state => state.catCategories
  }
})

// export default store
