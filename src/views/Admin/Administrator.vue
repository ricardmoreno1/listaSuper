<template>
    <div>ADMINISTRACION
        <div style="text-align:left" v-if="user" >
              <!-- <b-button variant="success" @click="cargarfile">Cargar RealTime(OLD)</b-button> -->
              <!-- <b-button  variant="success" @click="borrarElements">Borrar</b-button> -->
              <b-button  variant="success" @click="respaldar">Respaldar</b-button>
              <!-- <b-button variant="success" @click="cargarfileFireBase">Cargar FireBase(NEW)</b-button> -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'administratore',
  computed: {
    ...mapGetters({
      user: 'authUser'
    })
  },
  methods: {
    cargarfile: function () {
      console.log('cargar FILE ')
      this.$store.dispatch('LOAD_PRODUCTOS_FT')
    },
    borrarElements: function () {
      console.log('borrar productos ')
      this.$store.dispatch('DELETE_PRODUCTOS_FT')
    },
    respaldar: function () {
      console.log('cargar FILE ')
      this.$store.dispatch('RESPALDAR_PRODUCTOS_FT')
    },
    cargarfileFireBase: function () {
      console.log('cargar FILE ')
      this.$store.dispatch('LOAD_PRODUCTOS_FT')
    }
  }
}
</script>
<style scoped>

</style>
