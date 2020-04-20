import Vue from 'vue';
import Vuex from 'vuex';
import Bean from '@/models/beans';
import Brew from '@/models/brew';
import { beansCollection, brewsCollection, usersCollection } from '@/services/firebase';
import BottomNavigatorButtonViewModel from '@/components/bottomNavigator/bottomNavigatorButtonViewModel';
import firebase from 'firebase';

Vue.use(Vuex);

interface UserMetadata {
  id: string;
}

interface UserData {
  recentBeans: string[];
  recentBrews: string[];
}

export interface User {
  loggedIn: boolean;
  metadata: UserMetadata;
  data: UserData;
}

export interface State {
  title: string;
  showBack: boolean;
  beans: {[beanId: string]: Bean};
  brews: {[brewId: string]: Brew};
  user: User;
  bottomNavigator: BottomNavigatorButtonViewModel[];
  appUpdated: boolean;
}

export default new Vuex.Store<State>({
  state: {
    title: 'Coffee Log',
    showBack: false,
    beans: {},
    brews: {},
    user: {
      loggedIn: false,
      metadata: {
        id: '',
      },
      data: {
        recentBeans: [],
        recentBrews: [],
      },
    },
    bottomNavigator: [],
    appUpdated: false,
  },
  getters: {
    user(state) {
      return state.user;
    },
    beansLoaded(state) {
      return state.beans === {};
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, metadata) {
      state.user.metadata = metadata;
    },
    SET_USER_DATA(state, data) {
      state.user.data = data;
    },
    ADD_BEANS(state, beans) {
      state.beans = {
        ...state.beans,
        ...beans,
      };
    },
    ADD_BREW(state, brew) {
      state.brews = {
        ...state.brews,
        brew,
      };
    },
    ADD_BEAN(state, bean) {
      state.beans = {
        ...state.beans,
        [bean.id]: bean,
      };
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
    SET_BOTTOM_NAVIGATION(state, bottomNavigatorButtonViewModels) {
      state.bottomNavigator = bottomNavigatorButtonViewModels;
    },
    NOTIFY_APPLICATION_UPDATED(state, isUpdated) {
      state.appUpdated = isUpdated;
    },
  },
  actions: {
    async fetchUser({ commit, dispatch }, user) {
      commit('SET_LOGGED_IN', user !== null);

      if (user) {
        commit('SET_USER', {
          displayName: user.displayName,
          email: user.email,
          id: user.uid,
        });

        await dispatch('ensureUserExistsInDatabase', user.uid);

        await dispatch('bindUserData', user.uid);
      } else {
        commit('SET_USER', null);
      }
    },
    async ensureUserExistsInDatabase(context, userId) {
      const userDocument = await usersCollection.doc(userId).get();

      if (!userDocument.exists) {
        await usersCollection.doc(userId).set({});
      }
    },
    async bindUserData(context, userId) {
      const userDocument = await usersCollection.doc(userId).get();

      context.commit('SET_USER_DATA', userDocument.data() as UserData);
    },
    setTitle({ commit }, title) {
      commit('SET_TITLE', title);
    },
    fetchBrews({ commit }, brews) {
      commit('SET_BREWS', brews);
    },
    async getBeans(context, lastVisible = null) {
      const query = beansCollection;

      if (lastVisible) {
        query.startAfter(lastVisible);
      }
      const beanQueryResult = await query.limit(20).get();

      const beans: {[beanId: string]: Bean} = {};

      beanQueryResult.docs.forEach((beanDocument) => {
        const bean = beanDocument.data() as Bean;
        bean.id = beanDocument.id;

        beans[bean.id] = bean;
      });

      return context.commit('ADD_BEANS', beans);
    },
    async getBrewById(context, brewId) {
      let brew: Brew | null = null;

      if (!context.state.brews[brewId]) {
        const brewDocument = await brewsCollection.doc(brewId).get();

        if (brewDocument.exists) {
          const brewData = brewDocument.data() as Brew;

          context.commit('ADD_BREW', brewData);

          brew = brewData;
        }
      } else {
        brew = context.state.brews[brewId];
      }

      return brew;
    },
    async getBrews(context) {
      brewsCollection.onSnapshot((brewsRef) => {
        const brews: {[brewId: string]: Brew} = {};

        brewsRef.forEach((doc) => {
          const brew = doc.data() as Brew;
          brew.id = doc.id;

          brews[brew.id] = brew;
        });

        context.dispatch('fetchBrews', brews);
      });
    },
    async getBrewsByBeanId(context, beanId) {
      const brewsRef = await brewsCollection.where('beanId', '==', beanId)
        .where('beanId', '==', beanId)
        .orderBy('brewDateTime', 'desc')
        .get();

      const brews: {[brewId: string]: Brew} = {};

      brewsRef.docs.forEach((doc) => {
        const brew = doc.data() as Brew;
        brew.id = doc.id;

        brews[brew.id] = brew;
      });

      return brews;
    },
    async saveBrew(context, brew: Brew): Promise<string> {
      let documentId;

      if (brew.id) {
        await brewsCollection.doc(brew.id).update(JSON.parse(JSON.stringify(brew)));

        documentId = brew.id;
      } else {
        const document = await brewsCollection.add(JSON.parse(JSON.stringify(brew)));

        await beansCollection.doc(brew.beanId).collection('brews').add({ id: brew.beanId });

        documentId = document.id;

        console.log('updating recent brews');

        console.log(context.state.user.metadata.id);

        // TODO: Move to different action.
        let { recentBeans } = context.state.user.data;

        // If the bean already exists in the array, remove existing
        // and then pop at end.
        const existingEntry = recentBeans
          .findIndex((previouslyBrewedBeanId) => previouslyBrewedBeanId === brew.beanId);

        if (existingEntry > -1) {
          recentBeans = recentBeans
            .filter((previouslyBrewedBeanId) => previouslyBrewedBeanId !== brew.beanId);
        }

        recentBeans.push(brew.beanId);

        await usersCollection.doc(context.state.user.metadata.id).update({
          recentBrews: firebase.firestore.FieldValue.arrayUnion(documentId),
          recentBeans,
        });
      }

      return documentId;
    },
    async getBeanById(context, beanId) {
      let bean: Bean | null = null;

      if (!context.state.beans[beanId]) {
        const beanDocument = await beansCollection.doc(beanId).get();

        if (beanDocument.exists) {
          const beanData = beanDocument.data() as Bean;

          context.commit('ADD_BEAN', beanData);

          bean = beanData;
        }
      } else {
        bean = context.state.beans[beanId];
      }

      return bean;
    },
    async getMostRecentBrewByBeanId(context, beanId) {
      const recentBrewDocument = await brewsCollection
        .where('beanId', '==', beanId)
        .where('completed', '==', true)
        .orderBy('brewDateTime', 'desc')
        .limit(1)
        .get();

      // TODO: Cache this result.
      return recentBrewDocument.size === 1
        ? recentBrewDocument.docs[0].data() as Brew
        : null;
    },
  },
  modules: {
  },
});
