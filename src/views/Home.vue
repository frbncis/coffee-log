<template>
  <div class="pt-5 pb-5 pl-3 pr-3">
    <div
      v-if="userHasRecentBeans"
    >
      <h1 class="title">Recently Brewed</h1>
        <v-row
          dense
        >
          <v-col
            v-for="bean in recentBeans"
            :key="bean.id"
            class="pt-5"
            cols="6"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
              :loading="loading"
            >
              <v-card
                @click.stop="() => goToBeanDetails(bean.id)"
              >
                <v-img
                  :src="bean.imageUrl"
                  class="align-end"
                  aspect-ratio="1"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>

                <v-card-title class="subtitle-2" v-text="bean.name" />
              </v-card>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import BeansList from '@/components/BeansList.vue';
import Bean from '@/models/beans';
import { User } from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

@Component({
  components: {
    'beans-list': BeansList,
  },
})
export default class Home extends Vue {
  @State
  user!: User;

  recentBeans: Bean[] = [];

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

  mounted() {
    this.setTopNavigation([]);
    this.setTitle('Coffee Log');
  }

  async updateRecentBeansAsync() {
    if (this.user.data.recentBeans?.length > 0) {
      // When beans are brewed they are appended.
      // Most recent bean is at the bottom.
      const buffer = new Array<string>(...this.user.data.recentBeans);

      const topThreeRecentBeans = buffer
        .reverse()
        .slice(0, 4);

      const b1 = topThreeRecentBeans.map((id) => this.getBeanById(id));

      this.recentBeans = await Promise.all(b1);
    }
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }
}
</script>
