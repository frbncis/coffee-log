<template>
  <div class="pt-5 pb-5 pl-3 pr-3">
    <div
      v-if="userHasRecentBeans"
    >
      <h1 class="title">Recently Brewed</h1>
        <swiper ref="recentBeanSwiper" :options="{ pagination: { el: '.swiper-pagination' } }">
          <swiper-slide
            v-for="beanGroup in recentBeansCells"
            :key="'bean-cell-' + beanGroup[0].id"
          >
            <v-row
              dense
            >
            <v-col
              class="pt-5"
              :cols="11 / itemsPerSwipeableCell"
              v-for="bean in beanGroup"
              :key="bean.id"
            >
              <v-skeleton-loader
                class="mx-auto"
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
                    contain
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
          </swiper-slide>
        </swiper>
        <v-row>
          <v-col cols=12 class="swiper-pagination pt-0 mt-0" slot="pagination"/>
        </v-row>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import BeansList from '@/components/BeansList.vue';
import Bean from '@/models/beans';
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import SwiperClass from 'swiper';
import { User } from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';
import 'swiper/css/swiper.css';

@Component({
  components: {
    'beans-list': BeansList,
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
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

  itemsPerSwipeableCell = 2;

  get recentBeansCells() {
    const beanGroups: Bean[][] = [];

    for (let i = 0; i < this.recentBeans.length; i += this.itemsPerSwipeableCell) {
      beanGroups.push(this.recentBeans.slice(i, i + this.itemsPerSwipeableCell));
    }

    return beanGroups;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Ref() readonly recentBeanSwiper!: any;

  get swiper() {
    return this.recentBeanSwiper.$swiper as SwiperClass;
  }

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
        .slice(0, this.itemsPerSwipeableCell * 3);

      const b1 = topThreeRecentBeans.map((id) => this.getBeanById(id));

      this.recentBeans = await Promise.all(b1);
    }
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }
}
</script>

<style scoped>
swiper-pagination-bullet-active {
  background: white;
}
</style>
