<template>
    <v-tabs-items v-model="tab">
      <v-tab-item
        key="bean"
        value="bean"
      >
        <v-skeleton-loader
          :loading="loading"
          type="image"
        >
          <v-img
            :src="bean.imageUrl"
            contain
          />
        </v-skeleton-loader>

        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line"
        >
          <v-list-item
            class="mt-2 mb-2"
          >
            <v-list-item-content>
              <v-list-item-title class="headline">{{ bean.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ bean.roaster }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-btn
              @click="() => goToCreateBrew(bean.id)"
              icon
            >
              <v-icon>mdi-coffee</v-icon>
            </v-btn>

            <v-btn
              @click="() => goToEditBean(bean.id)"
              icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item>
        </v-skeleton-loader>

        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line"
        >
          <v-card-text class="mt-0 pt-0" v-if="bean.tastingNotes">
            {{ bean.tastingNotes }}
          </v-card-text>
          <div v-else />
        </v-skeleton-loader>

        <v-divider />

        <v-card-text>
          <v-skeleton-loader
          :loading="loading"
          type="paragraph"
          >
            <p>{{ bean.story }}</p>
          </v-skeleton-loader>

          <v-divider />

          <v-skeleton-loader
            :loading="loading"
            type="paragraph"
            class="bean-details"
          >
            <v-list-item>
              <v-list-item-title>Country</v-list-item-title>
              <v-list-item-subtitle>{{ bean.originCountry }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>Region</v-list-item-title>
              <v-list-item-subtitle>{{ bean.originRegion }}</v-list-item-subtitle>
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
        </v-card-text>
      </v-tab-item>

      <v-tab-item
        key="brews"
        value="brews"
      >
        <template
          v-for="brew in brews"
        >
          <v-divider
            :key="'divider' + brew.id"
          />
          <v-list-item
            :key="brew.id"
            @click="function () { return 0; }"
          >
            <v-list-item-action
              v-if="showDeletionCheckbox"
            >
              <v-checkbox
                v-model="active"
                color="primary"
              />
            </v-list-item-action>

            <v-list-item-content
              @click="() => goToCreateBrew(bean.id, brew.id)"
            >
              <v-list-item-title>
                {{ formatDateTime(brew.brewDateTime) }}
              </v-list-item-title>

              <v-list-item
                class="px-0 mx-0 brew-parameters-row"
              >
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

              <v-divider />
            </v-list-item-content>
          </v-list-item>
        </template>
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
      setTopNavigation: 'SET_TOP_NAVIGATION',
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
    showDeletionCheckbox: false,
  }),
  async mounted() {
    store.commit('SET_TITLE', 'Bean Details');

    const { beanId } = this.$route.params;
    const { tab } = this.$route.query as { [query: string]: string };
    const result = await this.getBeanById(beanId);

    if (tab) {
      this.tab = tab;
    }

    this.setTopNavigation([
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
  height:inherit;
}

.brew-parameters-row {
  min-height: unset !important;
  padding-top: 0.75em;
}

.bean-details {
  padding-top: 0.75em;
}

.bean-details div.v-list-item {
  padding-left: 0;
}
</style>
