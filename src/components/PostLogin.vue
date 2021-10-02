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

      <v-toolbar-title v-if="!isInSearchMode || !isAppSearch">{{ title }}</v-toolbar-title>

      <template v-if="!isInSearchMode">
        <v-spacer />
        <v-app-bar-nav-icon
          v-if="isAppSearch"
          @click.stop="showSearch"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-app-bar-nav-icon>
      </template>
      <template v-else-if="isAppSearch">
        <!-- Search Bar -->
        <v-app-bar-nav-icon
          @click.stop="dismissSearch"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-text-field
          v-model="appSearchTextLocal"
          hide-details
          single-line
          clearable
          placeholder="Search"
          @change="handleSearchTextChange"
          :autofocus="focusSearchBar"
        />
      </template>

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
      appSearchText: 'appSearchText',
      isAppSearch: 'isAppSearch',
      isInSearchMode: 'isInSearchMode',
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
    appSearchTextLocal: '',
    focusSearchBar: false,
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

    this.appSearchTextLocal = this.appSearchText;

    if (this.appSearchText) {
      this.isInSearchMode = true;
    }
  },
  methods: {
    ...mapMutations({
      setBottomNavigation: 'SET_BOTTOM_NAVIGATION',
      setAppSearchText: 'SET_APP_SEARCH_TEXT',
      setAppSearch: 'SET_APP_SEARCH',
      setIsInSearchMode: 'SET_IS_IN_SEARCH_MODE',
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
    handleSearchTextChange() {
      const newQuery = {
        ...this.$route.query,
        search: this.appSearchTextLocal,
      };

      if (!this.appSearchTextLocal) {
        delete newQuery.search;
      }

      this.$router.replace({
        name: this.$route.name,
        query: newQuery,
      });

      this.setAppSearchText(this.appSearchTextLocal);
    },
    showSearch() {
      this.isInSearchMode = true;
      this.focusSearchBar = true;
      this.setIsInSearchMode(true);
    },
    dismissSearch() {
      this.isInSearchMode = false;
      this.focusSearchBar = false;
      this.appSearchTextLocal = '';
      this.handleSearchTextChange();
      this.setIsInSearchMode(false);
    },
  },
};
</script>
