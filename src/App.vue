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
            <v-icon>mdi-free-breakfast</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Beans</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="() => this.$router.push({ name: 'Brews' })">
          <v-list-item-action>
            <v-icon>mdi-free-breakfast</v-icon>
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Coffee Log</v-toolbar-title>
    </v-app-bar>

    <!-- <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
        </v-row>
      </v-container>
    </v-content> -->
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
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    fab: false,
  }),
};
</script>
