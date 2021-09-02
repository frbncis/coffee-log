<template>
  <v-container class="px-0 pt-0 pb-0">

    <input
      v-model="appSearchText"
      hidden
      @formchange="() => updateBeanSearchFilter()"
    />

    <v-combobox
      v-model="roasterFilter"
      class="pt-3 pl-3 pr-3"
      :items="roasterNames"
      placeholder="Filter by Roaster"
      outlined
      persistent-hint
      clearable
      @change="() => updateBeanSearchFilter()"
    />

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
import { Component, Watch } from 'vue-property-decorator';
import { Action, State, Mutation } from 'vuex-class';
import BeansList from '@/components/BeansList.vue';
import { BeanSearchFilter } from '@/services/firebase';
import Bean from '../models/beans';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';
import Roaster from '../models/roaster';

@Component({
  components: {
    'beans-list': BeansList,
  },
})
export default class Beans extends Vue {
  @State
  beans!: {[beanId: string]: Bean}

  @State
  roasters!: Roaster[];

  @State
  appSearchText!: string;

  get roasterNames() {
    return this.roasters.map((roaster) => roaster.name);
  }

  @State
  beansResultsExhausted!: boolean;

  @State
  beanSearchFilter!: BeanSearchFilter;

  @Action
  getBeans!: () => Promise<void>

  @Action
  getRoasters!: () => Promise<void>

  @Mutation('SET_TITLE')
  setTitle!: (appBarTitle: string) => void;

  @Mutation('SET_TOP_NAVIGATION')
  setTopNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

  @Mutation('SET_BEAN_SEARCH_FILTER')
  setBeanSearchFilter!: (beanSearchFilter: BeanSearchFilter) => Promise<void>;

  beansLoadingInProgress = false;

  roasterFilter = '';

  mounted() {
    this.setTitle('Beans');
    this.setTopNavigation([]);
  }

  async created() {
    await this.getBeans();
    await this.getRoasters();

    const { roaster } = this.$route.query;

    if (roaster) {
      this.roasterFilter = roaster as string;
      this.updateBeanSearchFilter();
    }
  }

  get loading() {
    return Object.entries(this.beans).length === 0;
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }

  @Watch('appSearchText', { immediate: false, deep: false })
  async updateBeanSearchFilter() {
    this.beanSearchFilter.beanName = this.appSearchText;
    this.beanSearchFilter.roasterName = this.roasterFilter;

    const newQuery = {
      ...this.$route.query,
      roaster: this.beanSearchFilter.roasterName,
    };

    if (!newQuery.roaster) {
      delete newQuery.roaster;
    }

    this.$router.replace({
      name: 'Beans',
      query: newQuery,
    });

    await this.setBeanSearchFilter(this.beanSearchFilter);
    await this.getBeans();
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
