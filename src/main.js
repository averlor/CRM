import Vue from 'vue'
import Vuelidate from 'vuelidate'

import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import 'materialize-css/dist/js/materialize.min'

import DateFilter from '@/filters/date.filter'
import CurrencyFilter from '@/filters/currency.filter'
import ToolTipDirective from '@/directives/tooltip.directive'
import MessagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(MessagePlugin)
Vue.filter('date', DateFilter)
Vue.filter('currency', CurrencyFilter)
Vue.directive('tooltip', ToolTipDirective)
Vue.component('Loader', Loader)


firebase.initializeApp({
    apiKey: "AIzaSyB3KWr6sKRA16U4jisjy8JBrilnh--n-Mk",
    authDomain: "vue-crm-user.firebaseapp.com",
    databaseURL: "https://vue-crm-user.firebaseio.com",
    projectId: "vue-crm-user",
    storageBucket: "",
    messagingSenderId: "621093641758",
    appId: "1:621093641758:web:54cc46da81d49e4e"
})


let app; 

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
