import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import { library } from '@fortawesome/fontawesome-svg-core'
// Iconos de tipo "Solid"
// import { faSkull, faCrown, faDungeon, faHatWizard, faHammer, faGem } from '@fortawesome/free-solid-svg-icons'
// Iconos de tipo "Brand" (marcas o logos de empresas)
// import { faVuejs, faBootstrap, faFontAwesome, faGithub, faBattleNet } from '@fortawesome/free-brands-svg-icons'
// El componente que vamos a utilizar
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import firebase from 'firebase'
import Notifications from 'vue-notification'
import router from './router'
import store from './store'
// Le añadimos los iconos que acabamos de importar (todos, los de tipo solid y de tipo brand)
// CSS global
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Le añadimos los iconos que acabamos de importar (todos, los de tipo solid y de tipo brand)
/* library.add(
  faSkull,
  faCrown,
  faDungeon,
  faHatWizard,
  faHammer,
  faGem,
  faVuejs,
  faBootstrap,
  faFontAwesome,
  faGithub,
  faBattleNet
) */

Vue.config.productionTip = false

Vue.use(BootstrapVue)
// Vue.component('font-awesome-icon', FontAwesomeIcon)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Notifications)

var firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATA_BASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

// Instancia principal de Vue
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
