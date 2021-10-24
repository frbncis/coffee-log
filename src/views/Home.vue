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

    this.leaderboardS4 = results.docs.map((doc) => {
      const bean = doc.data() as Bean;
      bean.imageUrl = 'https://firebasestorage.googleapis.com/v0/b/coffee-log-9bcc7.appspot.com/o/images%2FScreenshot%202021-10-23%20at%2021-08-38%20Leaderboard%20Coffee%20The%20Coffee%20Game.png?alt=media&token=f73b8ef5-0660-4f3a-9cb1-1357dd908afb';
      return bean;
    }).sort((a, b) => (
      // Pure laziness; these beans are named "Coffee ##", so parse out the
      // number and sort based on that.
      // eslint-disable-next-line radix
      parseInt(a.name.split(' ')[1]) < parseInt(b.name.split(' ')[1]) ? -1 : 1));
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
