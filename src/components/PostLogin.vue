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

    <quick-actions
      :buttons="quickActionButtons"
      :shouldRender="showActionsSheet"
      @onDismissed="() => this.showActionsSheet = false"
    />

    <bottom-navigator />
  </v-app>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import AppBarTabs from '@/components/AppBarTabs.vue';
import BottomNavigator from './BottomNavigator.vue';
import BottomNavigatorButtonViewModel from './bottomNavigator/bottomNavigatorButtonViewModel';
import QuickActions, { QuickActionButtonViewModel } from './quickActions/QuickActions.vue';

export default {
  components: {
    'app-bar-tabs': AppBarTabs,
    'bottom-navigator': BottomNavigator,
    'quick-actions': QuickActions,
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
    bottomNav: 'recent',
    snackbar: true,
    showTabBar: true,
    showActionsSheet: false,
    quickActionButtons: [],
  }),
  created() {
    this.setBottomNavigation([
      new BottomNavigatorButtonViewModel('Home', 'home', 'mdi-home', () => this.$router.push({ name: 'Home' })),
      new BottomNavigatorButtonViewModel('', '', 'mdi-plus-circle-outline', () => { this.showActionsSheet = true; }),
      new BottomNavigatorButtonViewModel('Beans', 'beans', 'mdi-seed', () => this.$router.push({ name: 'Beans' })),
    ]);

    this.quickActionButtons = [
      new QuickActionButtonViewModel('Quick Brew', 'mdi-coffee', () => this.handleQuickBrewClick()),
      new QuickActionButtonViewModel('Add Bean', 'mdi-seed', () => this.$router.push({ name: 'CreateBeans' })),
      new QuickActionButtonViewModel('Timer', 'mdi-timer', () => this.$router.push({
        name: 'CreateBrew',
        query: {
          isAdHoc: true,
        },
      })),
    ];
  },
  methods: {
    ...mapMutations({
      setBottomNavigation: 'SET_BOTTOM_NAVIGATION',
    }),
    ...mapActions([
      'quickBrew',
    ]),
    goHistoryBack() {
      this.$router.go(-1);
    },
    goToSettings() {
      this.$router.push({ name: 'About' });
    },
    refreshWindow() {
      window.location.reload();
    },
    handleQuickBrewClick() {
      this.quickBrew(this.$router);
    },
  },
};
</script>
