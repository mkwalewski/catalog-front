import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import '../node_modules/winstrap/dist/css/winstrap.min.css';
import '../node_modules/winstrap/dist/js/vendor/jquery.min';
import '../node_modules/winstrap/dist/js/vendor/bootstrap.min';
import '../node_modules/vue-toastr/dist/vue-toastr.min.css';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
