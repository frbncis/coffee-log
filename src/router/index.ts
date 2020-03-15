import Vue from 'vue';
import VueRouter from 'vue-router';
import Beans from '../views/Beans.vue';
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
    path: '/brews',
    name: 'Brews',
    component: () => import(/* webpackChunkName: "brews" */ '../views/Brews.vue'),
  },
  {
    path: '/beans',
    name: 'Beans',
    component: () => import(/* webpackChunkName: "beans" */ '../views/Beans.vue'),
  },
  {
    path: '/beans/create',
    name: 'CreateBeans',
    component: () => import(/* webpackChunkName: "createBeans" */ '../views/CreateBeans.vue'),
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
});

export default router;
