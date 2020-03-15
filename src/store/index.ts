import Vue from 'vue';
import Vuex from 'vuex';
import Bean from '@/models/beans';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'Coffee Log',
    beans: [],
    user: {
      loggedIn: false,
      data: null,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    getBeanById: (state) => (id: string) => state.beans.find((bean: Bean) => bean.id === id),
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_BEANS(state, beans) {
      state.beans = beans;
    },
    SET_TITLE(state, title) {
      state.title = title;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit('SET_LOGGED_IN', user !== null);

      if (user) {
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit('SET_USER', null);
      }
    },
    fetchBeans({ commit }, beans) {
      commit('SET_BEANS', beans);
    },
    setTitle({ commit }, title) {
      commit('SET_TITLE', title);
    },
  },
  modules: {
  },
});
