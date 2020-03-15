import Vue from 'vue';
import { auth } from '@/services/firebase';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let app: Vue;

auth.onAuthStateChanged((user) => {
  store.dispatch('fetchUser', user);

  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
