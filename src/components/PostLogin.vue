<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link @click="() => this.$router.push({ name: 'Home' })">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="() => this.$router.push({ name: 'Beans' })">
          <v-list-item-action>
            <v-icon>mdi-seed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Beans</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list dense>
          <v-list-item link @click.stop="goToSettings">
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon
        v-if="!showBack"
        @click.stop="drawer = !drawer"
      />
      <v-app-bar-nav-icon
        v-else
        @click.stop="goHistoryBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
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
import { mapState } from 'vuex';
import BottomNavigator from '@/components/BottomNavigator.vue';

export default {
  components: {
    'bottom-navigator': BottomNavigator,
  },
  computed: {
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
    drawer: null,
    fab: false,
    bottomNav: 'recent',
    snackbar: true,
  }),
  methods: {
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
