<template>
  <div class="nuevoProducto">
    <h1> Store/Tienda</h1>
    <form @submit.prevent="addStore">
        <div class="mb-4">
          <label class="input__label">Nombre de la Tienda: </label>
          <div class="form__field relative">
            <input v-model="formAddStore.name" class="input__field" type="text" placeholder="nombre">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Descripcion: </label>
          <div class="form__field relative">
            <input v-model="formAddStore.descripcion" class="input__field" type="text" placeholder="descripcion">
          </div>
        </div>
        <!-- <div class="mb-4">
          <label class="input__label">Moneda: </label>
          <div class="form__field relative">
            <input v-model="formAddStore.moneda" class="input__field" type="text" placeholder="mx">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Pais: </label>
          <div class="form__field relative">
            <input v-model="formAddStore.pais" class="input__field" type="text" placeholder="México">
          </div>
        </div> -->
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
          <li v-for="item in listStores" v-bind:key="item.value">
            {{ item.text  }}
            <button class="btn btn-primary mr-3 w-full"
                @click="showCargarStore(item.id)">Editar </button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'createStore',
  computed: {
    ...mapGetters(
      {
        user: 'authUser',
        stores: 'catStores'
      }),
    listStores () {
      const stores = []
      Object.keys(this.stores).forEach(elementid => {
        const element = this.stores[elementid]
        const item = {
          value: element.name,
          text: element.name,
          id: element['.key']
        }
        stores.push(item)
      })
      return stores
    }

  },
  data () {
    return {
      storeAdd: [],
      formAddStore: {
        name: '',
        // pais: 'Mexico',
        // moneda: 'mx',
        descripcion: '',
        presentacion: ''
      }
    }
  },
  methods: {
    cleanForm () {
      this.formAddStore.name = ''
      this.formAddStore.descripcion = ''
      this.formAddStore.id = undefined
    }, /** Primer version */
    addStore () {
      // Metodo general para guardar
      if (this.isExistStore()) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Alta',
          text: ' Ya existe la tienda : ' + this.formAddStore.name
        })
      } else {
        if (this.formAddStore.id !== undefined) {
          this.updateStore()
        } else {
          this.addStoreByStageFS()
        }
      }
    },
    // RealTime
    addProductByStageRT () {
      // ByStage - por los metodos comunes para todos
      console.log('CrearProduct: addProductByStageRT RealTime Old version')
      this.prepareData()
      this.$store.dispatch('SAVE_PRODUCTS_RT', this.formAddStore)
    },
    isExistStore () {
      const storeSelec = Object.values(Object.entries(this.stores).filter(([_, a]) => a.name === this.formAddStore.name))
      if (storeSelec.length >= 1) {
        return true
      } else {
        return false
      }
    },
    // FireStore
    addStoreByStageFS () {
      // ByStage - por los metodos comunes para todos
      console.log('CrearStore: addStoreByStageFS FireStore New Version')
      this.prepareData()
      if (this.formAddStore.id === undefined) {
        delete this.formAddStore.id
      }
      this.$store.dispatch('SAVE_STORE_FS', this.formAddStore)
        .then(response => {
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Alta',
            text: ' se dio de alta la tienda: ' + this.formAddStore.name
          })
          this.cleanForm()
        }).catch((error) => {
          console.log('error al guardar tiendas', error)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Alta',
            text: ' Error al dar de alta la tienda: ' + this.formAddStore.name
          })
        })
    },
    prepareData () {
    },
    showCargarStore (id) {
      const storeSelec = Object.fromEntries(Object.entries(this.stores).filter(([_, a]) => a['.key'] === id))
      const store = storeSelec[id]
      this.formAddStore.name = store.name
      this.formAddStore.descripcion = store.descripcion
      this.formAddStore.id = id
    },
    updateStore () {
      console.log('updateStore : ', this.formAddStore)
      this.$store.dispatch('UPDATE_STORE_FS', this.formAddStore)
        .then(response => {
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Actualizacion',
            text: ' Se actulizo correctamente la Tienda: ' + this.formAddStore.name
          })
          this.cleanForm()
        }).catch((error) => {
          console.log('error al guardar tiendas', error)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Actualizacion',
            text: ' Error al actualizar la Tienda: ' + this.formAddStore.name
          })
        })
    }
  }
}
</script>
<style scoped>

</style>
