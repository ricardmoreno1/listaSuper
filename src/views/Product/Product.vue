<template>
    <div class="container">
        <div class="titulo_lista">
            <p style="color:white ; font-size:18px;"> Lista Supermercado </p>
            <b-form-select name="prioridades" v-model="selected" :options="options" @input="searchSubGroup('props')"></b-form-select>
            <b-form-select name="caracteristicas" v-model="selectedTienda" :options="optionsTiendas" @change="searchSubGroup('car')"></b-form-select>

        </div>
         <div class="productos">
                <div class="col producto" v-for="(producto,idx) in productFiltrado"
                    v-bind:key="idx"
                    >
                    <div class=" ">
                      <b-card no-body>
                        <b-button-group class="mr-1">
                          <!-- div   class="d-flex justify-content-between"   producto['.key'] -->
                          <b-button block v-b-toggle ="'collapse-'+ idx" >
                            {{ producto.name}} - ${{producto.precios.last}} [{{producto.presentacion}}][T:{{producto.tiendas.last}}]
                          </b-button>
                          <b-button  @click="addDeseo(idx, $event)" size="sm"
                                    class="flex-item"
                                    :class="{deseobutton : producto.deseado}">
                                    <b-icon icon="heart" scale="2"></b-icon>
                                    <!-- heart-fill -->
                          </b-button>
                          <b-button  @click="seleccioinarProducto(idx, $event)"  size="sm"
                                    class="flex-item"
                                    :class="{ productoSeleccionado : producto.seleccionado}">
                                    <b-icon icon="cart-plus" scale="2"></b-icon>
                          </b-button>
                          </b-button-group>
                      </b-card>
                    </div>
                    <b-collapse :id="'collapse-'+idx" class="mt-2">
                       <b-card>
                        <b-row class="flex-container">
                          <label>Marca:{{producto.marca}}, </label> <label v-if="producto.oferta"> ${{producto.precios.promo}} {{producto.oferta | conpromo}}</label>
                        </b-row>
                        <b-row class="flex-container">
                          <label class="flex-item">Nuevo <input v-miwidth="'100%'" type="text" v-model="producto.newPrecio"  placeholder="$ nuevo precio"></label>
                          <label class="flex-item">Tienda<input v-miwidth="'100%'" type="text" v-model="producto.newTienda"  placeholder="nueva tienda"></label>
                        </b-row>
                      </b-card>
                    </b-collapse>
                </div>
        </div>

        <div class="botones">
            <!--b-button :disabled="contador==0 && contadorDeseados==0" variant="success" @click="guardar">Guardar</-b-button -->
            <b-button variant="success" @click="guardar">Guardar</b-button>
            <b-button style="margin-left:10px;" :disabled="contadorDeseados==0" variant="info" @click="cancelar">Cancelar</b-button>
            <b-button style="margin-left:10px;" @click="limpiar" variant="info">Limpiar</b-button>

            <!--transition-- name="custom-classes-transition"
                enter-active-class="animated tada"
                leave-active-class="animated bounceOutRight">
                 <p v-if="contador>0">Animacion</p>
            </-transition-->

        </div>

        <div style="margin-top:20px;">
            <strong>Productos comprados{{contador}}</strong>
            <br/>
            <strong>Productos deseados {{contadorDeseados}}</strong>
        </div>
      </div>
</template>

<script >

import firebase from 'firebase'
import { mapGetters } from 'vuex'
const path = 'depa'
const pathId = 'abarrotes'
const pathSeleccionados = 'seleccionados'
// const db = firebase.firestore()

export default {
  name: 'Product',
  computed: {
    ...mapGetters(/* [
      'productos'
    ], */
      {
        user: 'authUser'
      }),
    /* chartData: function chart () { solo fue ejemplo
      const data = {
        productos: this.productos
      }
      return data
    } */
    productFiltrado () {
      // console.log(this.selected)
      if (this.lastselect === 'props') {
        if (this.selected === 'a') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.deseado === true))
          console.log(productitos)
          // this.limpiarFiltro(2)
          return productitos
        } else if (this.selected === 'b') {
          // this.limpiarFiltro(2)
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.seleccionado === true))
          return productitos
        } else {
          return this.productos
        }
      } else if (this.lastselect === 'car') {
        if (this.selectedTienda === 'a') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Aurrera'))
          console.log(productitos)
          // this.limpiarFiltro(1)
          return productitos
        } else if (this.selectedTienda === 'b') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Puesto'))
          // this.limpiarFiltro(1)
          return productitos
        } else if (this.selectedTienda === 'c') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Soriana'))
          // this.limpiarFiltro(1)
          return productitos
        } else if (this.selectedTienda === 'd') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'oxxo'))
          // this.limpiarFiltro(1)
          return productitos
        } else if (this.selectedTienda === 'e') {
          const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'SuperNaturista'))
          return productitos
        } else {
          return this.productos
        }
      } else {
        return this.productos
      }
    },
    productFiltradoByTienda () {
      if (this.selectedTienda === 'a') {
        const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Aurrera'))
        console.log(productitos)
        return productitos
      } else if (this.selectedTienda === 'b') {
        const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Mercado'))
        return productitos
      } else if (this.selectedTienda === 'c') {
        const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'Soriana'))
        return productitos
      } else if (this.selected === 'd') {
        const productitos = Object.fromEntries(Object.entries(this.productos).filter(([_, a]) => a.tiendas.last === 'oxxo'))
        return productitos
      } else {
        return this.productos
      }
    }

  },
  beforeCreate () {
    // this.$store.commit('loading/SET_LOADING', true, { root: true })
    console.log('---beforeCreate--- this.authUser:' + this.authUser)
    console.log('---beforeCreate--- this.$store.state.authId:' + this.$store.state.authId)
    // Version usando Store
    // this.$store.dispatch('FETCH_PRODUCTS', this.$store.state.authId)

    // this.$store.commit('loading/SET_LOADING', false, { root: true })
  },
  data () {
    return {
      id: '',
      contador: 0,
      contadorDeseados: 0,
      productos: [],
      productosSelyDes: [],
      selected: null,
      options: [
        { value: null, text: 'Escoje para filtrar productos' },
        { value: 'a', text: 'Deseos' },
        { value: 'b', text: 'Seleccionados' }
      ],
      selectedTienda: null,
      optionsTiendas: [
        { value: null, text: 'Escoje para filtrar por Tienda' },
        { value: 'a', text: 'Aurrera' },
        { value: 'b', text: 'Mercado' },
        { value: 'c', text: 'Soriana' },
        { value: 'd', text: 'oxxo' },
        { value: 'e', text: 'SuperNaturista' }
      ],
      lastselect: ''
    }
  },
  mounted () {
    this.$store.commit('loading/SET_LOADING', true, { root: true })
    console.log('mounted:: this.id:' + this.id)
    console.log('mounted:: this.authUser:' + this.authUser)
    console.log('mounted:: this.$store.state.authId:' + this.$store.state.authId)
    this.getInitial(this.$store.state.authId)
    this.$store.commit('loading/SET_LOADING', false, { root: true })
  },
  updated () {
    // console.log('updated :: this.$store.state.authId:')
    // this.$store.commit('loading/SET_LOADING', false, { root: true })
  },
  methods: { /** Agrega el poducto al carrito */
    seleccioinarProducto: function (id, event) {
      // event.target.id y id)
      // console.log('SELECCIONADO[' + id + ']')
      const producto = this.productos[id] // id es key
      producto.seleccionado = !producto.seleccionado
      if (this.productosSelyDes[id]) {
        // console.log('SELECCIONADO : lo actualizamos')
        this.productosSelyDes[id].seleccionado = producto.seleccionado
      } else {
        // console.log('SELECCIONADO : lo creamos')
        this.productosSelyDes[id] = {
          seleccionado: producto.seleccionado
        }
      }
      // console.log('Select productosSelyDes.length [' + Object.entries(this.productosSelyDes).length + ']')
      // this.actualizarElementos()
      this.contador = this.getProductosSeleccionados244().length
      // console.log('seleccioinarProducto: id[' + event.target.id + '] contador::' + this.contador)
    }, /** Agrega el producto a la lista de DESEOS */
    addDeseo: function (id, event) {
      console.log('DESEO id[' + id + '] even.id[' + event.target.id + ']')
      const producto = this.productos[id] // id es key
      producto.deseado = !producto.deseado
      if (this.productosSelyDes[id]) {
        // console.log('DESEO[' + id + ']:lo actualizamos')
        this.productosSelyDes[id].deseado = producto.deseado
      } else {
        // console.log('DESEO[' + id + ']:lo creamos')
        this.productosSelyDes[id] = {
          deseado: producto.deseado
        }
      }
      //            this.actualizarElementos()
      this.contadorDeseados = this.getProductosDeseadosSeleccionados().length
      this.$notify({
        group: 'foo',
        type: 'success',
        title: 'Me Gusta',
        text: ' adoro el producto ' + producto.name
      })
    },
    preparePriceToSave: function (id) {
      // const producto = this.productos.find((a) => a.id === id)
      const producto = this.productos[id]
      // console.log('id:' + producto.marca)
      const ttt = new Date()
      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + ttt.getMonth()) : ttt.getMonth())
      const dd = ttt.getDay() < 10 ? ('0' + ttt.getDay()) : ttt.getDay()
      const date = yyyy + '' + mm + '' + dd
      producto.precios[date] = producto.newPrecio
      producto.precios.last = producto.newPrecio
    }, /** Prepara las fechas que se van a guardar para la tienda */
    prepareMarcaToSave: function (id) {
      // const producto = this.productos.find((a) => a.id === id)
      const producto = this.productos[id]
      const ttt = new Date()
      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + ttt.getMonth()) : ttt.getMonth())
      const dd = ttt.getDate() < 10 ? ('0' + ttt.getDate()) : ttt.getDate()
      const date = yyyy + '' + mm + '' + dd
      producto.precios[date] = producto.newPrecio
      producto.precios.last = producto.newPrecio
      /* producto.precios.push({
        price: producto.newPrecio,
        date: date
      }) */
    }, /** Prepara las fechas que se van a guardar para ... */
    prepareToSave: function () {
      const ttt = new Date()

      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + (ttt.getMonth() + 1)) : ttt.getMonth())
      const dd = ttt.getDate() < 10 ? ('0' + ttt.getDate()) : ttt.getDate()
      const date = yyyy + '' + mm + '' + dd

      // Se agregan los Nuevos Precios a last  productos
      // this.getProductosSeleccionados().forEach(function (producto) {
      Object.values(this.getProductosSeleccionados()).forEach(function (producto) {
        producto.precios[date] = producto.newPrecio !== '' ? producto.newPrecio : producto.precios.last
        producto.precios.last = producto.newPrecio !== '' ? producto.newPrecio : producto.precios.last
        // producto.newPrecio = ''
        producto.tiendas[date] = producto.newTienda !== '' ? producto.newTienda : producto.tiendas.last
        producto.tiendas.last = producto.newTienda !== '' ? producto.newTienda : producto.tiendas.last

        // producto.deseado = false
        // producto.seleccionado = false
        producto.newPrecio = ''
        producto.newTienda = ''
      })
    },
    guardar: function () {
      console.log('GUARDAR ya preparados los datos: [-' + this.$store.state.authId + '-]')
      this.prepareToSave()
      // this.$store.dispatch('SAVE_PRODUCTS', this.$store.state.authId, this.productosSelyDes)

      /* firebase
        .database()
        .ref(pathSeleccionados)
        .child(this.$store.state.authId)
        .transaction(
          (valoresDB) => this.validarCompra(valoresDB),
          (error, committed, snapshot) =>
            this.validarRespuesta(error, committed, snapshot)
        ) */
      this.contador = 0
      firebase.database().ref(pathSeleccionados).child(this.$store.state.authId).set(this.productosSelyDes)
      console.log('authID : ' + firebase.auth().currentUser.uid)
      this.actualizarElementos()
      this.$notify({
        group: 'foo',
        type: 'success',
        title: 'Guardar',
        text: 'Actualizcion de los datos correctamente'
      })
    },
    actualizarElementos: function () {
      // firebase.database().ref('/salas/1').set(this.productos);
      // firebase.database().ref(path).child(pathId).set(this.productos,function(error){
      /**  if(error){
                    console.log("No logro hacer la inserccion");
                }else{
                    console.log("logro hacer la inserccion");
                }
                */
      // this.validarRespuesta(error)  ya que de esta manera hay error,
      // se hace con arro function
      // }).then(response => console.log("Actualizacion finalizada["+response+"]") )
      firebase.database().ref(path).child(pathId).set(this.productos)
      // .set(this.productos, error=> this.validarRespuesta(error))
    },
    validarRespuesta: function (error, committed, shapshot) {
      if (error) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Error',
          text: 'No es posible completar la operacion'
        })
      }
      if (committed) {
        this.$notify({
          group: 'foo',
          type: 'success',
          title: 'Exito',
          text: 'La operacion se realizo correntamente'
        })
      }
      console.log(shapshot)
    }, /** Carga la informacion inicial con FireBase */
    getInitial: function (id) {
      console.log('getInitial[' + id + ']')
      // this.$store.commit('loading/SET_LOADING', true, { root: true })
      /* firebase.database().ref(path).child(pathId).on('value', (snapshot) => {
        this.cargarElementos(snapshot.val())
        // this.$store.commit('loading/SET_LOADING', false, { root: true })
        // this.isLoading = false
      }) */
      if (!id) {
        console.log('Aun no logeado')
      }
      const instance = firebase.database().ref('depa/abarrotes')
      const instanceSeleccionados = firebase.database().ref('seleccionados') // .child(idd)
      /* if (firebase.auth().currentUser.uid) { */
      // if (state.authId) {
      if (id) {
        console.log('Se traen los seleccionados por usuario')
        instanceSeleccionados.child(id)
      }
      instance.once('value', (snapshot) => {
        // console.log(snapshot.val())
        const productos = snapshot.val()
        Object.keys(productos).forEach((productoId) => {
          const producto = productos[productoId]
          // console.log('obtenemos los productosID:' + producto['.key'])
          if (id) {
            instanceSeleccionados.once('child_added', querySnapshot => {
              querySnapshot.forEach((snap) => {
                if (snap.key === productoId) {
                  // console.log('valor:' + snap.key + ' == ' + productoId)
                  if (snap.val().seleccionado) {
                    producto.seleccionado = true
                  } else {
                    producto.seleccionado = false
                  }
                  // console.log('snap.val().deseado: ' + snap.val().deseado + ' == ' + productoId)
                  if (snap.val().deseado) {
                    producto.deseado = true
                  } else {
                    producto.deseado = false
                  }
                }
              })
            })
          } else {
            producto.seleccionado = false
            producto.deseado = false
          }
          this.cargarElementos(productos)
        })
        instanceSeleccionados.once('child_added', querySnapshot => {
          const Seleccionados = querySnapshot.val()
          this.cargarSeleccionados(Seleccionados)
        })
        console.log('init: prductSELEC [' + Object.entries(this.productosSelyDes).length + ']')
        this.contadorDeseados = Object.entries(this.productosSelyDes).length
        this.contador = this.getProductosSeleccionados244().length
        // commit('loading/SET_LOADING', false, { root: true })
        // this.$store.commit('loading/SET_LOADING', false, { root: true })
      })

      // ejecuta el cambio cuando hay un cambio en la BD
      // .once('value', snapshot => this.cargarElementos( snapshot.val() ))    //commit('loading/SET_LOADING', true, { root: true })
    }, /** Carga la informacion inicial */

    /* Carga los productos de un cliente  */
    cargarElementos: function (data) {
      this.productos = data
    },
    cargarSeleccionados: function (data) {
      this.productosSelyDes = data
    }, /** Prepara las fechas que se van a guardar para el pecio */
    cancelar: function () {
      /* this.getProductosSeleccionados().forEach(function (producto) {
        producto.user_id = null
        producto.disponible = true
      })
      this.actualizarElementos() */
      this.contador = 0
      this.contadorDeseados = 0
    }, /** obtiene los productos agregados a comprar */
    getProductosSeleccionados: function (id) {
      // productosSelyDes
      return Object.values(this.productos).filter((a) => a.seleccionado)
    },
    getProductosSeleccionados244: function () {
      // return this.productos.filter((a) => a.seleccionado)
      return Object.values(this.productos).filter((a) => a.seleccionado)
    },
    getProductosDeseadosSeleccionados: function () {
      return Object.values(this.productos).filter((a) => a.deseado)
    },
    getProductosSeleccionados2: function () {
      // return this.productos.filter((a) => a.seleccionado)
      console.log(' getProductosSeleccionados2  ' + this.productos.length)
      // console.log(this.productos)
      var parsedobj = JSON.parse(JSON.stringify(this.productos))
      console.log(parsedobj)
      // console.log(' getProductosSeleccionados2  ' + parsedobj.length)
      // return parsedobj.filter((a) => a.seleccionado)
      var productosel = []
      Object.keys(parsedobj).forEach((productoId) => {
      // return parsedobj.forEach((productoId) => {
        const producto = this.productos[productoId]
        // console.log(producto)
        // console.log(' foreach seleccionado:' + producto.seleccionado)
        // producto.disponible = true
        // producto.adquirido = false
        // producto.user_id = null

        if (producto.seleccionado) {
          console.log(' foreach: ' + producto.seleccionado)

          productosel.push(producto)
          // var productosel['.key'] = productoId
          // var productosel2
          // productosel2.seleccionado = producto.seleccionado
          // productosel2.faltante = producto.faltante
          //  pr oductosel2.push(productosel)
          // this.productosSelyDes.push(producto)
        }
        console.log('this.productosSelyDes')
        console.log(productosel)
        return productosel
        // return this.productosSelyDes
      })
    }, /** obtiene los productos agregados a deseos */

    getAllProductos: function () {
      return this.productos
    },
    limpiar: function () {
      Object.keys(this.productos).forEach((productoId) => {
        const producto = this.productos[productoId]
        producto.seleccionado = false
        producto.deseado = false
        // producto.user_id = null
      })
      this.contador = 0
      this.contadorDeseados = 0
    },
    limpiarFiltro: function (tipo) {
      // if (tipo === 1) this.selected = null
      // if (tipo === 2) this.selectedTienda = null
      // console.log('DESEO')
    },
    searchSubGroup: function (event) {
      // console.log('DESEO id[' + id + '] even.id[' + event.target.id + ']')
      // console.log(this.selected)
      console.log(event)
      // console.log('even.id[' + event.target.name + ']')
      // console.log('] even.id[' + this.name + ']')
      // console.log(this)
      this.lastselect = event
      /* if (event === 'props') {
        this.selectedTienda = null
      } else if (event === 'car') {
        this.selected = null
      } */
    }
  },
  watch: {
    user: {
      handler (cart, oldCart) {
        this.getInitial(this.$store.state.authId)
      }, // sera todos sus elementos
      deep: true
    }
  },
  filters: {
    uppercase: function (value) {
      if (!value) return ''
      return value.toString().toUpperCase()
    },
    conpromo: function (value) {
      if (value) {
        return 'Con promocion'
      } else {
        return 'Sin promocion'
      }
    }
  },

  directives: {
    miwidth: {
      inserted: function (el, binding) {
        el.style.width = binding.value
      }
    }
  }
}
</script>

<style lang="css" scoped>
/*  */
.container {
  padding-right: 5px;
  padding-left: 5px;
  @media only screen and (min-width: 790px) {
    padding-right: 15px;
    padding-left: 15px;
  }
}
.titulo_lista {
  background-color: #126899;
}
.productos {
  margin-top: 20px;
}
/* si se usa */
.producto {
  color: rgb(20, 19, 19);
  margin: 3px;
  font-weight: bold;
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 0px;
  padding-right: 0px;
  @media only screen and (min-width: 790px) {
    margin-left: 20px;
    margin-right: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
}
.pointer {
  cursor: pointer;
}
/*
.disponible {
  background-color: #a7c7fd;
}
.ocupado {
  background-color: #da082b;
}*/

.productoInicial {
  background-color: #3c90c0;
}
.productoInicial:hover {
  border-color: #1eb14f;
  background-color: #89a4d8;
}
.productoInicial:focus, .productoInicial:active, .productoInicial:visited {
  border-color: #1eb14f;
  background-color: #89a4d8;
}
.productoInicial:visited {
  border-color:  #3c90c0;
}
.productoDeseo {
  background-color: #931209;
}
.productoDeseo:hover, .productoDeseo:focus, .productoDeseo:active, .productoDeseo:visited {
  border-color: #931209;
  background-color: #89a4d8;
}
.deseobutton {
  background-color: #b22b73;
}
.deseobutton:hover, .deseobutton:focus, .deseobutton:active, .deseobutton:visited {
  /*border-color: #1eb14f;*/
  background-color: #b22b73;
}
.deseobutton:disabled, .deseobutton::selection {
  /*border-color: #1eb14f;*/
  background-color: #eea15a;
}
.productoSeleccionado {
  background-color: #afee5d;
}
.productoSeleccionado :hover {
  border-color: #8ab11e;
  background-color: #89a4d8;
}
.seleccionadobutton {
  background-color: #afee5d;
}
.seleccionadobutton:hover, .seleccionadobutton:focus, .seleccionadobutton:active, .seleccionadobutton:visited {
  /*border-color: #1eb14f;*/
  background-color: #aaee52;
}
.seleccionadobutton:disabled, .seleccionadobutton::selection {
  /*border-color: #1eb14f;*/
  background-color: #d3f0ad;
}
/*
.productoComprado {
  background-color: #1eb14f;
}*/

.prodductoHover {
  background-color: #89a4d8;
}

.entradas {
  background-color: #1eb14f;
}
.botoner {
  margin-top: 60px;
}

.fadet-enter-active,
.fadet-leave-active {
  transition: opacity 2s;
}
.fadet-enter,
.fadet-leave-to {
  opacity: 0;
}
.flex-container{
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}
.flex-item{
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-item:nth-child(odd){
  font-size: 12pt;
  @media only screen and (min-width: 790px) {
      font-size: 14pt;
  }
}

/** Botones personalizados */
.boton_personalizado{
    text-decoration: none;
    /*padding: 10px;*/
    /*font-weight: 600;*/
    font-size: 12px;
    /*color: #ffffff;*/
    width: 60px;
    height: 60px;
    /*background-color: #1883ba;*/
    background-color: gray;
    border-radius: 6px;
    border: 1px solid  gray;
    @media only screen and (min-width: 790px) {
      font-size: 14pt;
  }
}
</style>
