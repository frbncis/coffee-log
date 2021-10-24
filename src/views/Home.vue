<template>
  <div class="pt-5 pl-3 pr-3">
    <div
      v-if="userHasRecentBeans"
    >
      <h1 class="title">Recently Brewed</h1>
        <swipeable-bean-row
          :beans="recentBeans"
          @bean-clicked="goToBeanDetails"
        />
      </div>

    <div>
      <h1 class="title">Leaderboard - Season 4</h1>
        <swipeable-bean-row
          :beans="leaderboardS4"
          @bean-clicked="goToBeanDetails"
        />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import Bean from '@/models/beans';
import SwipeableBeanRow from '@/components/SwipeableBeanRow.vue';
import { beanSearch, User } from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

@Component({
  components: {
    'swipeable-bean-row': SwipeableBeanRow,
  },
})
export default class Home extends Vue {
  @State
  user!: User;

  recentBeans: Bean[] = [];

  leaderboardS4: Bean[] = [];

  @Action
  getBeanById!: (beanId: string) => Promise<Bean>

  loading = true;

  @Mutation('SET_TOP_NAVIGATION')
  setTopNavigation!: (navigation: BottomNavigatorButtonViewModel[]) => void;

  @Mutation('SET_TITLE')
  setTitle!: (appBarTitle: string) => void;

  private beansHasLoadedOnce = false;

  get userHasRecentBeans() {
    if (this.user.data.recentBeans.length > 0) {
      if (!this.beansHasLoadedOnce) {
        this.beansHasLoadedOnce = true;
        this.updateRecentBeansAsync();
      }

      return true;
    }

    return false;
  }

  async created() {
    this.loading = true;
    this.loading = false;
  }

  async mounted() {
    this.setTopNavigation([]);
    this.setTitle('Coffee Log');

    const results = await beanSearch(undefined, {
      roasterName: '',
      filterByLiked: false,
      beanName: '',
      beanTypes: ['leaderboard_season4'],
    }, '');

    this.leaderboardS4 = results.docs.map((doc) => doc.data() as Bean);
  }

  async updateRecentBeansAsync() {
    if (this.user.data.recentBeans?.length > 0) {
      // When beans are brewed they are appended.
      // Most recent bean is at the bottom.
      const buffer = new Array<string>(...this.user.data.recentBeans);

      const topThreeRecentBeans = buffer
        .reverse()
        .slice(0, 8);

      const b1 = topThreeRecentBeans.map((id) => this.getBeanById(id));

      this.recentBeans = await Promise.all(b1);
    }
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }
}
</script>
