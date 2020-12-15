<template>
  <div class="container">
    <HeaderBar/>
    <!-- Modals -->

    <router-view/>

    <FooterBar/>
    <!-- Modals -->

    <modal :show="modals.login" @close-modal="closeModal">
      <h1> Bienvenido </h1>
      <form @submit.prevent="loginHandlerSubmit">
        <div class="mb-4">
          <label class="input__label">Email</label>
          <div class="form__field relative">
            <input v-model="formLogin.email" class="input__field" type="text" placeholder="bruce.wayne@imnotbatman.org">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Password</label>
          <div class="form__field relative">
            <input v-model="formLogin.password" class="input__field" type="password" placeholder="*********">
          </div>
        </div>
        <div class="mb-4">
          <toggle-input v-model="formLogin.rememberMe"></toggle-input>
          Remember Me
        </div>
        <div class="mb-4">
          <button class="btn btn-primary mr-3 w-full">Login</button>
        </div>
      </form>
    </modal>

    <modal :show="modals.register" @close-modal="closeModalRegister">
      <h1> Bienvenido </h1>
      <form class="form" @submit.prevent="registerHandlersubmit">
        <div class="mb-4">
          <label class="input__label">Email</label>
          <div class="form__field relative">
            <input v-model="formRegister.email" class="input__field" type="text" placeholder="bruce.wayne@imnotbatman.org">
          </div>
        </div>
        <div class="mb-4">
          <label class="input__label">Nombre</label>
          <div class="form__field relative">
            <input v-model="formRegister.name" class="input__field" type="text" placeholder="Richard">
          </div>
        </div>

        <div class="mb-4">
          <label class="input__label">Password</label>
          <div class="form__field relative">
            <input v-model="formRegister.password" class="input__field" type="password" placeholder="*********">
          </div>
        </div>
        <div class="mb-4">
          <button class="btn btn-primary mr-3 w-full">Registrar</button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderBar from '@/components/HeaderBar/Index'
import FooterBar from '@/components/FooterBar/Index'
import Modal from '@/components/Modal.vue'
import ToggleInput from '@/components/ToggleInput.vue'
export default {
  name: 'MainLayout',
  data () {
    return {
      formLogin: {
        email: '',
        password: '',
        name: '',
        rememberMe: false
      },
      formRegister: {
        email: '',
        password: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'modals'
    ])
  },
  components: {
    HeaderBar,
    FooterBar,
    Modal,
    ToggleInput
  },
  methods: {
    closeModal () {
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: false
      })
    },
    closeModalRegister () {
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'register',
        value: false
      })
    },
    registerHandlersubmit () {
      this.$store.dispatch('CREATE_USER', this.formRegister)
        .then(() => {
          this.closeModalRegister()
        })
    },
    loginHandlerSubmit () {
      this.$store.dispatch('SIGN_IN', {
        email: this.formLogin.email,
        password: this.formLogin.password
      }).then(() => {
        console.log('ya entro')
        this.closeModal()
      })
    }
  }
}
</script>
<style>

</style>
