<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row class="text-center">
          <v-col cols="12">
            <v-btn
              @click="login"
              block
            >
              Login with Google
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import Vue from 'vue';
import firebase from 'firebase';

export default Vue.extend({
  name: 'Login',
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },
  data: () => ({
  }),
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    async logout() {
      await firebase.auth().signOut();
      this.$router.push({ path: '/' });
    },
  },
  mounted() {
    if (this.user.loggedIn) {
      this.logout();
    }
  },
});
</script>
