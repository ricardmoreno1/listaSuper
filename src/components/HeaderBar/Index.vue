<template>
  <div >
    <!--div class="navigation-bar"-->
    <b-navbar toggleable="lg" type="dark" id="default-navbar">
    <!--nav class="navbar navbar-expand-sm navbar-light" -->
      <!--a class="navbar-brand" href="#">Mi super</a-->
      <b-navbar-brand href="#">Mi super</b-navbar-brand>
      <b-navbar-toggle target="navbarNav-opt"></b-navbar-toggle>
      <!--button-- class="navbar-toggler" type="button" data-toggle="collapse"
        data-target="#navbarNav-opt" aria-controls="navbarNav-opt"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </-button-->
      <b-collapse id="navbarNav-opt" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Inicio</b-nav-item>
          <b-nav-item href="#">Agrega Producto</b-nav-item>
          <b-nav-item href="#">Agrega TiendA</b-nav-item>
          <div class="flex" v-if="user">
            <b-navbar-brand href="#">{{user.name}}</b-navbar-brand>
            <b-nav-item @click.prevent="logOut">Salir</b-nav-item>
          </div>
          <div v-else>
          <b-nav-item @click.prevent="getLogin">Login</b-nav-item>
          <b-nav-item @click.prevent="signUp">Registrarse</b-nav-item>
          </div>
        </b-navbar-nav>
      </b-collapse>
      <!--div-- class="collapse navbar-collapse" id="navbarNav-opt">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="#">Inicio </a>
                </li>
              </ul>
            </-div-->
    </b-navbar>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import CurrentUser from '@/components/CurrentUser'

export default {
  name: 'HeaderBar',

  methods: {
    getLogin () {
      console.log('getLogi')
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: true
      })
    },
    signUp () { // Registrar
      console.info('signUp')
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'register',
        value: true
      })
    },
    logOut () {
      console.info('logOut')
      this.$store.dispatch('LOG_OUT')
    }
  },

  /* component: {
    CurrentUser
  }** */
  computed: {
    ...mapGetters({
      user: 'authUser'
    })

  }
}
</script>

<style lang="css" scoped>

:root{
    --bkg-red-rose: #b3494d;
    --orange-lighter: #f59678;
    --bkg-beige-color: #ffa50040;
}

#home-pg{
    background-color: #ffa50040;
}
#default-navbar{
    background-color: #b3494d;
}
/* V2 */
#default-navbar .nav-link,
#default-navbar .navbar-brand
{
    color: #fff;
}

</style>
