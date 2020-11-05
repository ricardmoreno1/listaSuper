<template>
  <div class="header-bar">
    <div class="navigation-bar">
      <b-navbar toggleable="lg" type="ligth" variant="ligth">
        <b-navbar-brand :to="{ name: 'Home' }">
          <span class="font-diablo ml-2">D3PF</span>
        </b-navbar-brand>
      </b-navbar>
    </div>

  </div>
</template>

<script>

export default {
  name: 'HeaderBar'
}
</script>
