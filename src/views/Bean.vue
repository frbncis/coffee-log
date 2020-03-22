<template>
    <v-tabs-items v-model="tab">
      <v-tab-item
        key="bean"
        value="bean"
      >
        <v-card
          class="mx-5 mt-5 mb-5 pb-5"
          outlined
        >
        <v-skeleton-loader
          :loading="loading"
          type="image"
        >
          <v-img :src="bean.imageUrl" />
        </v-skeleton-loader>

        <v-skeleton-loader
          :loading="loading"
          type="actions"
        >
          <v-card-actions>
            <v-btn
              @click="() => goToCreateBrew(bean.id)"
              icon
            >
              <v-icon>mdi-coffee</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn
              @click="() => goToEditBean(bean.id)"
              icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-skeleton-loader>

        <v-skeleton-loader
          :loading="loading"
          height="94"
          type="list-item-two-line"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ bean.name }}</v-list-item-title>
              <v-list-item-subtitle>by {{ bean.roaster }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-skeleton-loader>

        <v-card-text style="white-space: pre-line;">
          <v-skeleton-loader
          :loading="loading"
          type="paragraph"
          >
            {{ bean.story }}
          </v-skeleton-loader>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-skeleton-loader
          :loading="loading"
          type="paragraph"
        >
          <v-card-title>Origin</v-card-title>

          <v-list-item>
            <v-list-item-title>Country</v-list-item-title>
            <v-list-item-subtitle>{{ bean.originCountry }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Varietal</v-list-item-title>
            <v-list-item-subtitle>{{ bean.varietal }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Process</v-list-item-title>
            <v-list-item-subtitle>{{ bean.process }}</v-list-item-subtitle>
          </v-list-item>

        </v-skeleton-loader>

        <v-divider class="mx-4"></v-divider>

        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line"
        >
          <v-card-title>
            <v-list-item-title>Tasting Notes</v-list-item-title>
            <v-list-item-subtitle>{{ bean.tastingNotes }}</v-list-item-subtitle>
          </v-card-title>
        </v-skeleton-loader>
        </v-card>
      </v-tab-item>

      <v-tab-item
        key="brews"
        value="brews"
      >
        <v-card
          v-for="brew in brews"
          tile
          outlined
          :key="brew.id"
          class="mx-3 mt-3"
          @click="() => goToCreateBrew(bean.id, brew.id)"
        >
          <v-list-item>
            <v-list-item-title>
            {{ formatDateTime(brew.brewDateTime) }}
            </v-list-item-title>

            <v-spacer />

            <v-subheader
              class="brew-setting-subheader"
            >
              1:{{ Math.round(brew.waterVolume/brew.grindWeight) }}
            </v-subheader>

            <v-subheader>
              {{ brew.tasting.tastiness.quantity }}

              <v-icon
                class="pl-1"
                disabled
              >
                mdi-star
              </v-icon>
            </v-subheader>
          </v-list-item>

          <v-divider class="mx-4" />

          <v-list-item class="text-center">
            <v-icon
              disabled
              size="16"
            >
              mdi-scale
            </v-icon>
            <v-subheader
              class="brew-setting-subheader"
            >
              {{ brew.grindWeight }} g
            </v-subheader>

            <v-spacer />

            <v-icon
              disabled
              size="16"
            >
              mdi-water
            </v-icon>
            <v-subheader
              class="brew-setting-subheader"
            >
              {{ brew.waterVolume }} mL
            </v-subheader>

            <v-spacer />

            <v-icon
              disabled
              size="16"
            >
              mdi-grain
            </v-icon>
            <v-subheader
              class="brew-setting-subheader"
            >
              {{ brew.grindSetting }} clicks
            </v-subheader>

            <v-spacer />

            <v-icon
              disabled
              size="16"
            >
              mdi-clock
            </v-icon>
            <v-subheader
              class="brew-setting-subheader"
            >
              {{ formatBrewTime(brew.brewTimeMilliseconds) }}
            </v-subheader>
          </v-list-item>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapMutations } from 'vuex';
import Bean from '@/models/beans';
import formatTime from '@/utils/timeUtils';
import store from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

export default Vue.extend({
  name: 'Bean',
  methods: {
    ...mapActions({
      getBeanById: 'getBeanById',
      getBrewsByBeanId: 'getBrewsByBeanId',
    }),
    goToCreateBrew(beanId: string, brewId: string) {
      this.$router.push({ name: 'CreateBrew', query: { beanId, brewId } });
    },
    goToEditBean(beanId: string) {
      this.$router.push({ name: 'CreateBeans', query: { beanId } });
    },
    ...mapMutations({
      setBottomNavigation: 'SET_BOTTOM_NAVIGATION',
    }),
    goToBeanTab() {
      this.tab = 'bean';
      this.$router.replace({
        name: 'Bean',
        params: this.$route.params,
        query: { ...this.$route.query, tab: 'bean' },
      });
    },
    goToBrewsTab() {
      this.tab = 'brews';
      this.$router.replace({
        name: 'Bean',
        params: this.$route.params,
        query: { ...this.$route.query, tab: 'brews' },
      });
    },
    formatDateTime(timestamp: number) {
      const b = new Date(timestamp);

      return `${b.toDateString()} @ ${b.toLocaleTimeString()}`;
    },
    formatBrewTime(timestamp: number) {
      return formatTime(timestamp, false);
    },
  },
  computed: {
    loading() {
      return this.bean.name === '';
    },
  },
  data: () => ({
    bean: new Bean(),
    brews: {},
    tab: 'bean',
    window: 0,
  }),
  async mounted() {
    store.commit('SET_TITLE', 'Bean Details');

    const { beanId, tab } = this.$route.params;
    const result = await this.getBeanById(beanId);

    if (tab) {
      this.tab = tab;
    }

    this.setBottomNavigation([
      new BottomNavigatorButtonViewModel(
        'Bean',
        'bean',
        'mdi-seed',
        this.goToBeanTab,
      ),
      new BottomNavigatorButtonViewModel(
        'Brews',
        'brews',
        'mdi-coffee',
        this.goToBrewsTab,
      ),
    ]);

    if (result) {
      this.bean = result;
      store.commit('SET_TITLE', this.bean.name);
    }

    this.brews = await this.getBrewsByBeanId(beanId);
  },
});
</script>

<style scoped>
.brew-setting-subheader {
  padding-left: 0.5em;
}
</style>
