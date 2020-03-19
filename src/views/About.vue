<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
    >
      <v-col cols="12">
      <v-card>
        <v-list-item>
          <v-list-item-content>
          Coffee Log
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-subtitle>
          Commit
          </v-list-item-subtitle>

          <v-list-item-subtitle>
          {{ version }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-card-actions>
          <v-spacer />
          <v-btn icon @click="goToGitHub">
            <v-icon>
            mdi-github
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class About extends Vue {
  version = process.env.VUE_APP_GIT;

  // eslint-disable-next-line class-methods-use-this
  goToGitHub() {
    window.open('https://github.com/frbncis/coffee-log');
  }
}
</script>
