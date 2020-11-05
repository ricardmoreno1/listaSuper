<template>
    <div class="container">
        <div class="titulo_lista">
            <p style="color:white ; font-size:18px;"> Lista Supermercado </p>
        </div>
         <div class="productos">
                <div class="col producto" v-for="(producto,idx) in productos"
                    v-bind:key="idx"
                    >
                    <div class=" ">
                      <b-card no-body>
                        <b-button-group class="mr-1">
                    <b-button block v-b-toggle ="'collapse-'+ producto.id"
                        v-bind:class="{productoInicial :(!producto.seleccionado && !producto.faltante),
                                      productoSeleccionado : ((producto.seleccionado && !producto.faltante) || (producto.seleccionado && producto.faltante)),
                                      productoDeseo: (!producto.seleccionado && producto.faltante )}" >
                        {{ producto. name}} - ${{producto.precios.last}} [{{producto.presentacion}}][T:{{producto.tiendas.last}}]
                    </b-button>
                    <b-button  @click="seleccioinarProducto" v-bind:id="producto.id" size="sm"
                              class="flex-item seleccionadobutton ">
                               <b-icon icon="cart-plus" scale="2" variant="secondary"></b-icon>
                              </b-button>
                              </b-button-group>
                      </b-card>
                    </div>
                    <b-collapse :id="'collapse-'+producto.id" class="mt-2">
                       <b-card>
                        <b-row class="flex-container">
                          <b-button  @click="seleccioinarProducto" v-bind:id="producto.id" size="sm" variant="light"
                              class="flex-item seleccionadobutton">+Al Carrito</b-button>
                          <b-button :disabled="producto.seleccionado" variant="light"
                              @click="addList" v-bind:id="producto.id" size="sm"
                              v-bind:class="{pointer:addDisponible(producto) }"
                              class="flex-item deseobutton">+A la Lista</b-button>
                        </b-row>
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
            <b-button :disabled="contador==0 && contadorDeseados==0" variant="success" @click="guardar">Guardar</b-button>
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

const path = 'depa'
const pathId = 'abarrotes'
export default {
  name: 'Product',

  data () {
    return {
      id: '',
      contador: 0,
      contadorDeseados: 0,
      productos: []
    }
  },
  created () {
    this.id = firebase.database().ref('/users').push().key
    this.getInitial()
  },
  methods: {
    seleccioinarProducto: function (event) {
      // let asientoId = event.target.id;
      // console.log('seleccioinarProducto:' + event.target.id)
      const producto = this.productos.find((a) => a.id === event.target.id)
      // console.log(asiento)
      producto.seleccionado = !producto.seleccionado
      // producto.faltante = !producto.faltante
      // producto.user_id = this.id
      // this.actualizarElementos()
      this.productos.forEach(function (prod) {
        console.log('id[' + prod.id + '] seleccionando[' + prod.seleccionado + ']')
      })
      const rrrr = this.productos.filter((a) => a.seleccionado)
      console.log('conta:rrr:' + rrrr.length)
      this.contador = this.getProductosSeleccionados().length
      console.log('seleccioinarProducto: id[' + event.target.id + '] contador::' + this.contador)
    },
    addList: function (event) {
      // agregar a deseos//
      // let asientoId = event.target.id;
      console.log('addList:' + event.target.id)
      const producto = this.productos.find((a) => a.id === event.target.id)
      // console.log(producto)
      // producto.seleccionado = !producto.seleccionado
      producto.faltante = !producto.faltante
      producto.user_id = this.id
      // this.actualizarElementos()
      this.contadorDeseados = this.getProductosDeseadosSeleccionados().length
      this.$notify({
        group: 'foo',
        type: 'error',
        title: 'bien',
        text: ' seleccionar el producto ' + producto.name
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
          text: 'No es podible completar la operacion'
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
    }, /** Carga la informacion inicial */
    getInitial: function () {
      this.$store.commit('loading/SET_LOADING', true, { root: true })
      firebase
        .database()
        .ref(path)
        .child(pathId)
        .orderByChild('agregada')
        .on('value', (snapshot) => {
          this.cargarElementos(snapshot.val())
          this.$store.commit('loading/SET_LOADING', false, { root: true })
          // this.isLoading = false
        })
        // ejecuta el cambio cuando hay un cambio en la BD
      // .once('value', snapshot => this.cargarElementos( snapshot.val() ))    //commit('loading/SET_LOADING', true, { root: true })
    },
    /* Carga los elementos de la base */
    cargarElementos: function (data) {
      this.productos = data
    },
    preparePriceToSave: function (id) {
      const producto = this.productos.find((a) => a.id === id)
      // console.log('id:' + producto.marca)
      const ttt = new Date()
      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + ttt.getMonth()) : ttt.getMonth())
      const dd = ttt.getDay() < 10 ? ('0' + ttt.getDay()) : ttt.getDay()
      const date = yyyy + '' + mm + '' + dd
      producto.precios[date] = producto.newPrecio
      producto.precios.last = producto.newPrecio
    },
    prepareMarcaToSave: function (id) {
      const producto = this.productos.find((a) => a.id === id)
      const ttt = new Date()
      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + ttt.getMonth()) : ttt.getMonth())
      const dd = ttt.getDay() < 10 ? ('0' + ttt.getDay()) : ttt.getDay()
      const date = yyyy + '' + mm + '' + dd
      producto.precios[date] = producto.newPrecio
      producto.precios.last = producto.newPrecio
      /* producto.precios.push({
        price: producto.newPrecio,
        date: date
      }) */
    },
    prepareToSave: function () {
      const ttt = new Date()
      const yyyy = ttt.getFullYear()
      const mm = ((ttt.getMonth() < 10) ? ('0' + (ttt.getMonth() + 1)) : ttt.getMonth())
      const dd = ttt.getDay() < 10 ? ('0' + ttt.getDay()) : ttt.getDay()
      const date = yyyy + '' + mm + '' + dd
      console.log('date formado ' + date)

      // Se agregan los Nuevos Precios a last  productos
      this.getProductosSeleccionados().forEach(function (producto) {
        producto.precios[date] = producto.newPrecio !== '' ? producto.newPrecio : producto.precios.last
        producto.precios.last = producto.newPrecio !== '' ? producto.newPrecio : producto.precios.last
        // producto.newPrecio = ''
        producto.tiendas[date] = producto.newTienda !== '' ? producto.newTienda : producto.tiendas.last
        producto.tiendas.last = producto.newTienda !== '' ? producto.newTienda : producto.tiendas.last
        // producto.newTienda = ''
        producto.faltante = false
        producto.seleccionado = false
      })
      // Ssi no es seleccionada, buscar si cambio

      // todos las variables newPrecios se inician

      // todos las producots se deseleccionan
      this.productos.forEach(function (producto) {
        producto.newPrecio = ''
        producto.newTienda = ''
        producto.seleccionado = false
      })
    },
    guardar: function () {
      this.prepareToSave()
      firebase
        .database()
        .ref(path)
        .child(pathId)
        .transaction(
          (valoresDB) => this.validarCompra(valoresDB),
          (error, committed, snapshot) =>
            this.validarRespuesta(error, committed, snapshot)
        )
      this.contador = 0
      this.contadorDeseados = 0
    },
    validarCompra: function (valoresDB) {
      /* this.getProductosSeleccionados().forEach(function (asiento) {
        if (valoresDB.find((a) => a.id === asiento.id).adquirido) {
          return
        }
        asiento.adquirido = true
      }) */
      return this.productos
    },
    cancelar: function () {
      /* this.getProductosSeleccionados().forEach(function (producto) {
        producto.user_id = null
        producto.disponible = true
      })
      this.actualizarElementos()
      this.contador = 0 */
    },
    validarProductos: function () {
      /* this.getProductosSeleccionados().forEach(function (producto) {
        producto.adquirido = true
      }) */
    },
    /* productoDisponible: function (producto) {
      return (!producto.adquirido &&
        (producto.user_id == null || producto.user_id === this.id)
      )
    }, */
    addDisponible: function (producto) {
      return (producto.seleccionado)
    }, /** obtiene los productos agregados a comprar */
    getProductosSeleccionados: function () {
      return this.productos.filter((a) => a.seleccionado)
    }, /** obtiene los productos agregados a deseos */
    getProductosDeseadosSeleccionados: function () {
      return this.productos.filter((a) => a.faltante)
    },
    getAllProductos: function () {
      return this.productos
    },
    limpiar: function () {
      this.productos.forEach(function (producto) {
        // producto.disponible = true
        // producto.adquirido = false
        producto.user_id = null
      })
      this.actualizarElementos()
      this.contador = 0
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
  background-color: #ec7e16;
}
.productoDeseo:hover, .productoDeseo:focus, .productoDeseo:active, .productoDeseo:visited {
  border-color: #1eb14f;
  background-color: #89a4d8;
}
.deseobutton {
  background-color: #ec7e16;
}
.deseobutton:hover, .deseobutton:focus, .deseobutton:active, .deseobutton:visited {
  /*border-color: #1eb14f;*/
  background-color: #f3953e;
}
.deseobutton:disabled, .deseobutton::selection {
  /*border-color: #1eb14f;*/
  background-color: #eea15a;
}
.productoSeleccionado {
  background-color: #afee5d;
}
.productoSeleccionado :hover {
  border-color: #1eb14f;
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
</style>
