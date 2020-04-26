<template>
  <v-app id="inspire">
    <v-app-bar
      app
      flat
      hide-on-scroll
    >
      <v-app-bar-nav-icon
        v-if="showBack"
        @click.stop="goHistoryBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <template
        v-slot:extension
        v-if="showAppBarTabs"
      >
        <app-bar-tabs />
      </template>
    </v-app-bar>

    <v-content>
      <router-view />

      <!-- <v-speed-dial
        v-model="fab"
        bottom
        right
        fixed
      >
        <template v-slot:activator>
          <v-btn
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="green"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="indigo"
          @click="() => this.$router.push({ name: 'CreateBeans' })"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-speed-dial> -->
    </v-content>

    <v-snackbar
      v-model="appUpdated"
    >
      An update is available, refresh to update.
      <v-btn
        color="pink"
        text
        @click="refreshWindow"
      >
        Refresh
      </v-btn>
    </v-snackbar>
    <bottom-navigator />
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import AppBarTabs from '@/components/AppBarTabs.vue';
import BottomNavigator from './BottomNavigator.vue';
import BottomNavigatorButtonViewModel from './bottomNavigator/bottomNavigatorButtonViewModel';

export default {
  components: {
    'app-bar-tabs': AppBarTabs,
    'bottom-navigator': BottomNavigator,
  },
  computed: {
    ...mapGetters([
      'showAppBarTabs',
    ]),
    ...mapState({
      title: 'title',
      showBack: 'showBack',
      appUpdated: 'appUpdated',
    }),
  },
  props: {
    source: String,
  },
  data: () => ({
    fab: false,
    bottomNav: 'recent',
    snackbar: true,
    showTabBar: true,
  }),
  created() {
    this.setBottomNavigation([
      new BottomNavigatorButtonViewModel('Home', 'home', 'mdi-home', () => this.$router.push({ name: 'Home' })),
      new BottomNavigatorButtonViewModel('Beans', 'beans', 'mdi-seed', () => this.$router.push({ name: 'Beans' })),
    ]);
  },
  methods: {
    ...mapMutations({
      setBottomNavigation: 'SET_BOTTOM_NAVIGATION',
    }),
    goHistoryBack() {
      this.$router.go(-1);
    },
    goToSettings() {
      this.$router.push({ name: 'About' });
    },
    refreshWindow() {
      window.location.reload();
    },
  },
};
</script>
