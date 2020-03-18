<template>
    <v-tabs-items v-model="tab">
      <v-tab-item
        key="bean"
        value="bean"
      >
        <v-card
          class="mx-5 mt-5 mb-5 pb-5"
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
          class="mx-4"
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
          :key="brew.id"
          class="mx-5 mt-5 mb-5 pb-5"
        >
          <v-list-item four-line>
            <v-list-item-content>
            {{ formatDateTime(brew.brewDateTime) }}
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              Dose
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ brew.grindWeight }} g
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              Water Volume
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ brew.waterVolume }} mL
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              Grind
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ brew.grindSetting }} clicks
            </v-list-item-subtitle>
          </v-list-item>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapMutations } from 'vuex';
import Bean from '@/models/beans';
import store from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

export default Vue.extend({
  name: 'Bean',
  methods: {
    ...mapActions({
      getBeanById: 'getBeanById',
      getBrewsByBeanId: 'getBrewsByBeanId',
    }),
    goToCreateBrew(beanId: string) {
      this.$router.push({ name: 'CreateBrew', query: { beanId } });
    },
    goToEditBean(beanId: string) {
      this.$router.push({ name: 'CreateBeans', query: { beanId } });
    },
    ...mapMutations({
      setBottomNavigation: 'SET_BOTTOM_NAVIGATION',
    }),
    goToBeanTab() {
      this.tab = 'bean';
    },
    goToBrewsTab() {
      this.tab = 'brews';
    },
    formatDateTime(timestamp: number) {
      const b = new Date(timestamp);

      return `${b.toDateString()} @ ${b.toLocaleTimeString()}`;
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
  }),
  async mounted() {
    store.commit('SET_TITLE', 'Bean Details');

    const { beanId } = this.$route.params;
    const result = await this.getBeanById(beanId);

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
