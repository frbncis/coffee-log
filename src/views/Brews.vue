<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <v-card
          v-for="brew in brewDetails"
          :key="brew.id"
        >
          <v-list-item four-line>
            <v-list-item-avatar
              tile
              size="180"
              color="grey"
            >
              <v-img
                :src="brew.bean.imageUrl"
              />
            </v-list-item-avatar>

            <v-list-item-title>
              {{ brew.bean.name }}
            </v-list-item-title>

            <v-card-text>
              {{ brew.waterVolume }}
            </v-card-text>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Mutation, State } from 'vuex-class';
import Brew from '../models/brew';

@Component
export default class Brews extends Vue {
  get brewDetails() {
    return Object.keys(this.brews).map((key) => ({
      ...this.brews[key],
      bean: this.beans[this.brews[key].beanId],
    }));
  }

  @State
  beans!: {[brewId: string]: Brew};

  @State
  brews!: {[brewId: string]: Brew};

  @Mutation('SET_TITLE')
  setAppBarTitle!: (title: string) => void;

  created() {
    this.setAppBarTitle('Brews');
  }
}
</script>
