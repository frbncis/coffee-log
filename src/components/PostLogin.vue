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

    <v-bottom-sheet
      v-model="showActionsSheet"
    >
      <v-sheet
        class="text-center"
        height="200px"
      >
          <h3
            class="py-3 subtitle-1"
          >
            Quick Actions
          </h3>
        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <div class="py-3">
              <v-btn
                outlined
                fab
                @click="handleQuickBrewClick"
              >
                <v-icon>
                  mdi-coffee
                </v-icon>
              </v-btn>
            </div>
              <h4
                class="caption"
              >
                Quick Brew
              </h4>
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>
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
    bottomNav: 'recent',
    snackbar: true,
    showTabBar: true,
    showActionsSheet: false,
  }),
  created() {
    this.setBottomNavigation([
      new BottomNavigatorButtonViewModel('Home', 'home', 'mdi-home', () => this.$router.push({ name: 'Home' })),
      new BottomNavigatorButtonViewModel('', '', 'mdi-plus-circle-outline', () => { this.showActionsSheet = !this.showActionsSheet; }),
      new BottomNavigatorButtonViewModel('Beans', 'beans', 'mdi-seed', () => this.$router.push({ name: 'Beans' })),
    ]);
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
      this.showActionsSheet = false;
      this.quickBrew(this.$router);
    },
  },
};
</script>
