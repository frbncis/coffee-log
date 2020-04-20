<template>
  <v-container>
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

      <v-row dense>
        <v-btn
          block
          outlined
          text
          class="mt-5"
          @click="() => this.$router.push({ name: 'CreateBeans' })"
        >
          <v-icon disabled left>mdi-plus</v-icon>
          Add Bean
        </v-btn>
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

  @Action
  getBeans!: () => Promise<void>

  @Mutation('SET_TITLE')
  setTitle!: (appBarTitle: string) => void;

  @Mutation('SET_BOTTOM_NAVIGATION')
  setBottomNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

  mounted() {
    this.setTitle('Beans');
    this.setBottomNavigation([]);
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
}
</script>
