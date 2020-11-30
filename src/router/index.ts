import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/brews/create',
    name: 'CreateBrew',
    component: () => import(/* webpackChunkName: "createBrew" */ '../views/brews/createBrew.vue'),
    meta: {
      showBackIcon: true,
    },
  },
  {
    path: '/beans',
    name: 'Beans',
    component: () => import(/* webpackChunkName: "beans" */ '../views/Beans.vue'),
  },
  {
    path: '/beans/:beanId',
    name: 'Bean',
    component: () => import(/* webpackChunkName: "beans" */ '../views/Bean.vue'),
    meta: {
      showBackIcon: true,
    },
  },
  {
    path: '/beans/create',
    name: 'CreateBeans',
    component: () => import(/* webpackChunkName: "createBeans" */ '../views/CreateBeans.vue'),
    meta: {
      showBackIcon: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 }),
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.showBackIcon)) {
    store.commit('SET_BACK_NAV_ICON', true);
  } else {
    store.commit('SET_BACK_NAV_ICON', false);
  }

  next();
});

export default router;
