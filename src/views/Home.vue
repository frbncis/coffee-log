<template>
  <div class="pt-5 pb-5 pl-3 pr-3">
    <h1 class="headline pb-2 font-weight-bold">Recently Brewed</h1>
      <v-divider />
      <v-row dense>
        <v-col
          v-for="bean in recentBeans"
          :key="bean.id"
          class="pt-5"
        >
          <v-card
            @click.stop="() => goToBeanDetails(bean.id)"
            flat
            outlined
          >
            <v-img
              :src="bean.imageUrl"
              class="align-end"
              gradient="to bottom, rgba(255,255,255,.1), rgba(255,255,255,.9)"
              height="200px"
            >
              <v-card-actions>
                <v-list-item class="grow">
                  <v-list-item-content>
                    <v-list-item-subtitle class="overline" v-text="bean.roaster" />
                    <v-list-item-title class="font-weight-medium" v-text="bean.name" />
                  </v-list-item-content>
                </v-list-item>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import BeansList from '@/components/BeansList.vue';
import Bean from '@/models/beans';
import { User } from '../store';

@Component({
  components: {
    'beans-list': BeansList,
  },
})
export default class Home extends Vue {
  @State
  user!: User;

  @State
  beans!: {[beanId: string]: Bean}

  @Action
  getBeans!: () => Promise<void>

  @Mutation('SET_TITLE')
  setTitle!: (appBarTitle: string) => void;

  async created() {
    await this.getBeans();
  }

  mounted() {
    this.setTitle('Brew');
  }

  get recentBeans() {
    if (this.user.data.recentBeans) {
      // When beans are brewed they are appended.
      // Most recent bean is at the bottom.
      const buffer = new Array<string>(...this.user.data.recentBeans);

      const topThreeRecentBeans = buffer
        .reverse()
        .slice(0, 2)
        .map((id) => this.beans[id]);

      return topThreeRecentBeans;
    }

    return [];
  }

  goToBeanDetails(beanId: string) {
    this.$router.push({ name: 'Bean', params: { beanId } });
  }
}
</script>
