import Vue from 'vue';
import Vuex from 'vuex';
import Bean from '@/models/beans';
import Brew from '@/models/brew';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'Coffee Log',
    showBack: false,
    beans: {},
    brews: {},
    user: {
      loggedIn: false,
      data: null,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    getBeanById: (state) => (id: string) => (state.beans as {[beanId: string]: Bean })[id],
    getMostRecentBrewByBeanId: (state) => (beanId: string) => {
      const brews = state.brews as {[brewId: string]: Brew};

      const brewsWithBeanId = Object.values(brews).filter((brew: Brew) => brew.beanId === beanId);

      if (brewsWithBeanId.length === 0) {
        return null;
      }

      const brewDates = brewsWithBeanId.map((brew) => brew.brewDateTime);

      const mostRecentDate = Math.max.apply(
        null,
        brewDates,
      );

      const mostRecentBrewing = brewsWithBeanId
        .filter((brew) => brew.brewDateTime === mostRecentDate)[0];

      return mostRecentBrewing;
    },
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
    SET_BREWS(state, brews) {
      state.brews = brews;
    },
    SET_TITLE(state, title) {
      state.title = title;
    },
    SET_BACK_NAV_ICON(state, showBack) {
      state.showBack = showBack;
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
    fetchBrews({ commit }, brews) {
      commit('SET_BREWS', brews);
    },
  },
  modules: {
  },
});
