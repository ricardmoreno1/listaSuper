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
            <input v-model="formAddProduct.tienda" class="input__field" type="text" placeholder="Tienda">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Categoria: </label>
          <div class="form__field relative">
            <input v-model="formAddProduct.categoria" class="input__field" type="text" placeholder="Abarrotes">
          </div>
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
            <input v-model="formAddProduct.precioTemp" class="input__field" type="text" placeholder="12">
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
  </div>
</template>

<script>

import firebase from 'firebase'
// const path = 'depa'
// const pathId = 'abarrotes'
// const pathSeleccionados = 'seleccionados'
const pathAbarrotes = 'depa/abarrotes'

export default {
  name: 'crearProducto',
  data () {
    return {
      productosAdd: [],
      formAddProduct: {
        name: '',
        tienda: '',
        categoria: '',
        pais: '',
        moneda: '',
        descripcion: '',
        precioTemp: '',
        marca: '',
        presentacion: ''
      }

    }
  },
  methods: {
    cleanForm () {
      this.formAddProduct.name = ''
    },
    addProduct () {
      console.log('add')
      this.prepareData()
      firebase.database().ref(pathAbarrotes).update(this.productosAdd)
      // this.$store.dispatch('CREATE_PRODUCT', this.formAddProduct)
      //   .then(() => {
      //     this.cleanForm()
      //   })
    },
    prepareData () {
      console.log('preparando datos iniciales que no pone el usuario')
      // const formAddProductSave = [
      //   ...this.formAddProduct
      // ]
      // formAddProductSave.precio.last = '' // this.formAddProduct.precio

      // this.productosAdd.push({
      //   ...this.formAddProduct,
      //   precio: {
      //     last: 1,
      //     new: '1'
      //   }
      // })
    }
  }
}
</script>
<style scoped>

</style>
