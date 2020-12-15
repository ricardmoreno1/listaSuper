<template>
  <div class="home">
    <HomeTitle/>
    <Producto/>
  </div>
</template>

<script>
import HomeTitle from './HomeTitle'
import Producto from '../../views/Product/Product'

export default {
  name: 'Home',
  components: {
    HomeTitle,
    Producto
  }
}
</script>

<style>
#app {
    padding: 5px 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #15202b;
    background-color: #ffffff;
}
</style>
