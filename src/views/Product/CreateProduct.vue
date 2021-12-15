<template>
  <div class="nuevoProducto">
    <h1> Productos</h1>
    <form @submit.prevent="addProduct">
        <div class="mb-4">
          <label class="input__label">Nombre: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.name" class="input__field" type="text" placeholder="nombre">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Tienda: </label>
          <div class="form__field relative">
            <!-- <input v-model="formAddProdu ct.tiendas.last" class="input__field" type="text" placeholder="Tienda"> -->
            <b-form-select class="input__field" name="tienda" v-model="formAddProduct.tiendas.last" :options="listStores" :disabled="isUpdate" ></b-form-select>
          </div>
          <span>Seleccionado: {{ formAddProduct.tiendas.last }}</span>
        </div>
        <div class="mb-4">
          <label class="input__label">Categoria: </label>
          <div class="form__field relative">
            <!-- <input v-model="formAddProduct.categoria" class="input__field" type="text" placeholder="Abarrotes"> -->
            <!-- <b-form-select name="categoria" v-model="formAddProduct.categoria" :options="listCategorias" ></b-form-select> -->
            <!-- <select v-model="formAddProduct.categoria" :options="listCategorias" > </select> -->
            <select v-model="formAddProduct.categoria" class="input__field">
              <option v-for="option in listCategorias" v-bind:value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <span>Seleccionado: {{ formAddProduct.categoria }}</span>
        </div>
        <div class="mb-4">
          <label class="input__label">Marca: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.marca" class="input__field" type="text" placeholder="Petzl">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Presentacion: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.presentacion" class="input__field" type="text" placeholder="500 gr">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Precio: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.precios.last" :disabled="isUpdate" class="input__field" type="text" placeholder="12">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Descripcion: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.descripcion" class="input__field" type="text" placeholder="descripcion">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Moneda: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.moneda" class="input__field" type="text" placeholder="mx">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Pais: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.pais" class="input__field" type="text" placeholder="México">
          </div>
        </div>
        <div class="mb-4">
          <button class="btn btn-primary mr-3 w-full">Agregar</button>
        </div>
    </form>
    <div class="mb-4">
      <button class="btn btn-primary mr-3 w-full">Regresar</button>
    </div>
    <section>
      <div>
        <ul id="example-1">
          <li v-for="item in listCategorias" v-bind:key="item.value">
            {{ item.text  }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>

import firebase from 'firebase'
import { mapGetters } from 'vuex'
// const path = 'depa'
// const pathId = 'abarrotes'
// const pathSeleccionados = 'seleccionados'
const pathAbarrotes = 'depa/abarrotes'

export default {
  name: 'crearProducto',
  computed: {
    ...mapGetters(
      {
        user: 'authUser',
        categorias: 'catProducts',
        stores: 'catStores',
        isExistProduct: 'isExistProduct'
      }),
    listCategorias () {
      const productos = []
      // console.log('listCategorias', this.categorias)
      productos.push({ value: '', text: 'Selecciona una categoria' })
      Object.keys(this.categorias).forEach(elementid => {
        const element = this.categorias[elementid]
        // console.log('cate id:' + elementid + '', element)
        const item = {
          // value: elementid,
          value: element.name,
          text: element.name
        }
        productos.push(item)
      })
      return productos
    },
    listStores () {
      const stores = []
      // console.log('listStores', this.stores)
      stores.push({ value: '', text: 'Selecciona una tienda' })
      Object.keys(this.stores).forEach(elementid => {
        const element = this.stores[elementid]
        // console.log('stores id:' + elementid + '', element)
        const item = {
          // value: elementid,
          value: element.name,
          text: element.name
        }
        stores.push(item)
      })
      return stores
    },
    existeProducto () {
      return this.isExistProduct
    }

  },
  data () {
    return {
      productosAdd: [],
      isUpdate: false,
      formAddProduct: {
        name: '',
        tiendas: {
          last: ''
        },
        categoria: '',
        pais: 'Mexico',
        moneda: 'mx',
        descripcion: '',
        precios: {
          last: ''
        },
        marca: '',
        presentacion: ''
      }
    }
  },
  mounted () {
    const paramId = this.$route.params.prod
    if (paramId !== undefined) {
      this.cargarDatosProdto(paramId)
    }
  },
  methods: {
    cargarDatosProdto (prod) {
      const idpord = prod['.key']
      this.formAddProduct.name = prod.name
      this.formAddProduct.categoria = prod.categoria
      this.formAddProduct.pais = prod.pais
      this.formAddProduct.moneda = prod.moneda
      this.formAddProduct.marca = prod.marca
      this.formAddProduct.descripcion = prod.descripcion
      this.formAddProduct.presentacion = prod.presentacion
      this.formAddProduct.id = idpord
      this.formAddProduct.tiendas.last = prod.tiendas.last
      this.formAddProduct.precios.last = prod.precios.last
      this.isUpdate = true
    },
    cleanForm () {
      this.isUpdate = false
      this.formAddProduct.name = ''
      this.formAddProduct.categoria = ''
      this.formAddProduct.pais = ''
      this.formAddProduct.moneda = ''
      this.formAddProduct.descripcion = ''
      this.formAddProduct.presentacion = ''
      this.formAddProduct.marca = ''
      this.formAddProduct.precios.last = ''
      this.formAddProduct.tiendas.last = ''

      // delete this.formAddProduct.id
    }, /** Primer version */
    addProduct () {
      if (this.isUpdate) {
        this.isExistPrdUP()
      } else {
        this.isExistPrd()
      }
      if (this.existeProducto) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Alta',
          text: ' El producto : ' + this.formAddProduct.name + ' ya existe'
        })
      } else {
        if (this.formAddProduct.id !== undefined) {
          this.updateProducto()
        } else {
          this.addProductByStageFS()
        }
      }
    },
    async isExistPrd () {
      console.log('isExistPrd():')
      this.$store.dispatch('IS_EXIST_PROD1', this.formAddProduct)
        .then(await function () {
          // console.log('isExistPrd: verificando si existe el producto.')
        })
        .catch(await function (error) {
          console.log('isExistPrd: -Ocurrio un error en la promesa', error)
        })
    },
    async isExistPrdUP () {
      console.log('isExistPrdUP():')
      this.$store.dispatch('IS_EXIST_PROD_UP', this.formAddProduct)
        .then(await function () {
          // console.log('isExistPrdUP: UP verificando si existe el producto.')
        })
        .catch(await function (error) {
          console.log('isExistPrdUP: UP -Ocurrio un error en la promesa', error)
        })
    },
    addProductLast () {
      console.log('add Last version')
      this.prepareData()
      firebase.database().ref(pathAbarrotes).update(this.productosAdd)
    },
    // RealTime
    addProductByStageRT () {
      // ByStage - por los metodos comunes para todos
      console.log('CrearProduct: addProductByStageRT RealTime Old version')
      this.prepareData()
      this.$store.dispatch('SAVE_PRODUCTS_RT', this.formAddProduct)
    },
    // FireStore
    addProductByStageFS () {
      // ByStage - por los metodos comunes para todos
      this.prepareData()
      this.$store.dispatch('SAVE_PRODUCTS_FS', this.formAddProduct)
        .then((ok) => {
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Actualizacion',
            text: ' Se creo correctamente el producto: ' + this.formAddProduct.name
          })
          this.cleanForm()
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    updateProducto () {
      console.log('updateProducto : ', this.formAddProduct)
      const idAux = this.formAddProduct.id
      this.$store.dispatch('UPDATE_PRODUCTS_FS', this.formAddProduct)
        .then(response => {
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Actualizacion',
            text: ' Se actulizo correctamente el producto: ' + this.formAddProduct.name
          })
          this.cleanForm()
          this.goInicio()
        }).catch((error) => {
          console.log('error al guardar tiendas', error)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Actualizacion',
            text: ' Error al actualizar el producto: ' + this.formAddProduct.name
          })
          this.formAddProduct.id = idAux
        })
    },
    prepareData () {
      console.log('finaliza la preparacion')
    },
    goInicio: function () {
      this.$router.push({
        name: 'Home'
      })
    }
  }
}
</script>
<style scoped>

</style>
