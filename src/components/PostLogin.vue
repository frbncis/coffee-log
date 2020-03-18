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
        <v-list-item link @click="() => this.$router.push({ name: 'Brews' })">
          <v-list-item-action>
            <v-icon>mdi-coffee</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Brews</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="() => this.$router.push({ name: 'About' })">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="() => this.$router.push({ name: 'Login' })">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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

      <v-speed-dial
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
      </v-speed-dial>
    </v-content>

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
    }),
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    fab: false,
    bottomNav: 'recent',
  }),
  methods: {
    goHistoryBack() {
      this.$router.go(-1);
    },
  },
};
</script>
