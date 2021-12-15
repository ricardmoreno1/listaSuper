<template>
  <div class="nuevoProducto">
    <h1> Category/Categorias</h1>
    <form @submit.prevent="addCategory">
        <div class="mb-4">
          <label class="input__label">Nombre de la Categoria: </label>
          <div class="form__field relative">
            <input v-model="formAddCategory.name" class="input__field" type="text" placeholder="nombre">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Descripcion: </label>
          <div class="form__field relative">
            <input v-model="formAddCategory.descripcion" class="input__field" type="text" placeholder="descripcion">
          </div>
        </div>
        <!-- <div class="mb-4">
          <label class="input__label">Moneda: </label>
          <div class="form__field relative">
            <input v-model="formAddCategory.moneda" class="input__field" type="text" placeholder="mx">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Pais: </label>
          <div class="form__field relative">
            <input v-model="formAddCategory.pais" class="input__field" type="text" placeholder="México">
          </div>
        </div> -->
        <div class="mb-4">
          <button class="btn btn-primary mr-3 w-full">Agregar</button>
        </div>
    </form>
        <!-- <div class="mb-4">
          <button class="btn btn-primary mr-3 w-full">Update</button>
        </div> -->

    <div class="mb-4">
      <button class="btn btn-primary mr-3 w-full"
              @click="updateCategoria()">Regresar</button>
    </div>
    <section>
      <div>
        <ul id="example-1">
          <li v-for="item in listCategories" v-bind:key="item.value">
            {{ item.text  }}
             <button class="btn btn-primary mr-3 w-full"
                @click="showCargarCategoria(item.id)">Editar </button>
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
        categories: 'catProducts'
      }),
    listCategories () {
      const categories = []
      Object.keys(this.categories).forEach(elementid => {
        const element = this.categories[elementid]
        const item = {
          value: element.name,
          text: element.name,
          id: element['.key']
        }
        categories.push(item)
      })
      return categories
    }

  },
  data () {
    return {
      storeAdd: [],
      formAddCategory: {
        name: '',
        descripcion: '',
        presentacion: ''
      }
    }
  },
  methods: {
    cleanForm () {
      this.formAddCategory.name = ''
      this.formAddCategory.descripcion = ''
      this.formAddCategory.id = undefined
    }, /** Primer version */
    addCategory () {
      if (this.isExistCat()) {
        this.$notify({
          group: 'foo',
          type: 'error',
          title: 'Alta',
          text: ' Ya existe la categoria : ' + this.formAddCategory.name
        })
      } else {
        if (this.formAddCategory.id !== undefined) {
          this.updateCategoria()
        } else {
          this.addCategoryByStageFS()
        }
      }
    },
    // RealTime
    addProductByStageRT () {
      // ByStage - por los metodos comunes para todos
      console.log('CrearProduct: addProductByStageRT RealTime Old version')
      this.prepareData()
      this.$store.dispatch('SAVE_CATEGORY_RT', this.formAddCategory)
    },
    isExistCat () {
      const catSelec = Object.values(Object.entries(this.categories).filter(([_, a]) => a.name === this.formAddCategory.name))
      if (catSelec.length >= 1) {
        return true
      } else {
        return false
      }
    },
    //    FireStore
    addCategoryByStageFS () {
      // ByStage - por los metodos comunes para todos
      console.log('CrearStore: addCategoryByStageFS FireStore New Version', this.formAddCategory)
      this.prepareData()
      if (this.formAddCategory.id === undefined) {
        delete this.formAddCategory.id
      }
      this.$store.dispatch('SAVE_CATEGORY_FS', this.formAddCategory)
        .then(response => {
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Alta',
            text: ' Se dio de alta la Categoria: ' + this.formAddCategory.name
          })
          this.cleanForm()
        }).catch((error) => {
          console.log('error al guardar la categoria', error)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Alta',
            text: ' Error al dar de alta la Categoria: ' + this.formAddCategory.name
          })
        })
    },
    prepareData () {
    },
    showCargarCategoria (id) {
      const categoriaSelec = Object.fromEntries(Object.entries(this.categories).filter(([_, a]) => a['.key'] === id))
      const categoria = categoriaSelec[id]
      this.formAddCategory.name = categoria.name
      this.formAddCategory.descripcion = categoria.descripcion
      this.formAddCategory.id = id
    },
    updateCategoria () {
      console.log('updateCategoria : ', this.formAddCategory)
      this.$store.dispatch('UPDATE_CATEGORY_FS', this.formAddCategory)
        .then(response => {
          // console.log('Se', response)
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Actualizacion',
            text: ' Se actulizo correctamente la Categoria: ' + this.formAddCategory.name
          })
          this.cleanForm()
        }).catch((error) => {
          console.log('error al guardar tiendas', error)
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Actualizacion',
            text: ' Error al actualizar la Categoria: ' + this.formAddCategory.name
          })
        })
    }
  }
}
</script>
<style scoped>

</style>
