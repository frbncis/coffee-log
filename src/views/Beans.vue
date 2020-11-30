<template>
  <v-container class="px-0 pt-0 pb-0">
    <v-skeleton-loader
      type="bean@4"
      tile
      :types="{ 'bean': 'article' }"
      :loading="loading"
    >
      <!-- Empty div to occupy default slot so skeleton
        will load while v-for renders. -->
      <div />

      <beans-list
        :beans="beans"
        @bean-clicked="goToBeanDetails"
      />

      <!-- Only show this element if we have more results to load.  -->
      <v-row
        v-if="!beansResultsExhausted"
        justify="center"
        class="pa-3"
        v-intersect="onBottomReached"
      >
        <v-progress-circular
          indeterminate
        />
      </v-row>
    </v-skeleton-loader>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, State, Mutation } from 'vuex-class';
import BeansList from '@/components/BeansList.vue';
import Bean from '../models/beans';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

@Component({
  components: {
    'beans-list': BeansList,
  },
})
export default class Beans extends Vue {
  @State
  beans!: {[beanId: string]: Bean}

  @State
  beansResultsExhausted!: boolean;

  @Action
  getBeans!: () => Promise<void>

  @Mutation('SET_TITLE')
  setTitle!: (appBarTitle: string) => void;

  @Mutation('SET_TOP_NAVIGATION')
  setTopNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

  beansLoadingInProgress = false;

  mounted() {
    this.setTitle('Beans');
    this.setTopNavigation([]);
  }

  async created() {
    await this.getBeans();
  }

  get loading() {
    return Object.entries(this.beans).length === 0;
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }

  async onBottomReached() {
    if (!this.beansLoadingInProgress) {
      this.beansLoadingInProgress = true;
      await this.getBeans();
      this.beansLoadingInProgress = false;
    }
  }
}
</script>
