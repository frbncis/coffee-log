<template>
  <v-container class="px-0 pt-0 pb-0">

    <input
      v-model="appSearchText"
      hidden
      @formchange="() => updateBeanSearchFilter()"
    />

    <div
      v-if="isInSearchMode"
      class="pt-3 pl-3 pr-3 pb-3"
    >
      <v-combobox
        v-model="roasterFilter"
        :items="roasterNames"
        placeholder="Filter by Roaster"
        outlined
        persistent-hint
        clearable
        @change="() => updateBeanSearchFilter()"
      />

      <v-chip
        pill
        :outlined="!filterByLiked"
        @click="toggleFilterByLiked"
      >
        <v-icon left>{{ filterByLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        Liked
      </v-chip>
    </div>

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

interface BeanSearchFilterQuery {
  roaster?: string;
  filterByLiked?: string;
  beanTypes?: string[];
}

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
    return this.roasters.map((roaster) => roaster.name).sort();
  }

  @State
  beansResultsExhausted!: boolean;

  @State
  beanSearchFilter!: BeanSearchFilter;

  @State
  isInSearchMode!: boolean;

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

  filterByLiked = false;

  beanTypes: string[] = [];

  mounted() {
    this.setTitle('Beans');
    this.setTopNavigation([]);
  }

  async created() {
    const { roaster, filterByLiked, beanTypes } = this.$route.query;

    if (roaster) {
      this.roasterFilter = roaster as string;
      this.updateBeanSearchFilter();
    }

    if (filterByLiked) {
      this.filterByLiked = (filterByLiked === 'true');
      this.updateBeanSearchFilter();
    }

    // Update the bean type if it's in the query string.
    if (beanTypes?.length > 0) {
      if (Array.isArray(beanTypes)) {
        this.beanTypes = beanTypes as Array<string>;
      } else {
        this.beanTypes = [beanTypes];
      }

      this.updateBeanSearchFilter();
    }

    await this.getBeans();
    await this.getRoasters();
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
    this.beanSearchFilter.filterByLiked = this.filterByLiked;
    this.beanSearchFilter.beanTypes = this.beanTypes;

    const newQuery: {[key: string]: string|undefined} = {
      ...this.$route.query,
      roasterName: this.beanSearchFilter.roasterName,
      filterByLiked: this.beanSearchFilter.filterByLiked.toString(),
    };

    if (this.beanSearchFilter.roasterName === ''
      || this.beanSearchFilter.roasterName === undefined) {
      delete newQuery.roasterName;
    }

    if (!this.beanSearchFilter.filterByLiked) {
      delete (newQuery as BeanSearchFilterQuery).filterByLiked;
    }

    // Remove the beanType query string if it's empty.
    if (!this.beanTypes) {
      delete (newQuery as BeanSearchFilterQuery).beanTypes;
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

  toggleFilterByLiked() {
    this.filterByLiked = !this.filterByLiked;
    this.updateBeanSearchFilter();
  }
}
</script>
