<template>
    <v-tabs-items
      v-model="tab"
      touchless
    >
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
            aspect-ratio="1"
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

            <v-btn
              icon
              @click="() => onBeanLikeToggle()"
            >
              <v-icon>{{ isBeanLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
          </v-list-item>
        </v-skeleton-loader>

        <v-skeleton-loader
          :loading="loading"
          type="list-item-two-line"
        >
          <v-card-text class="mt-0 pt-0" v-if="bean.tastingNotes">
            <v-chip
              v-for="tastingNote in beanTastingNotes"
              :key="tastingNote"
              class="mr-2 mb-2"
              :color="getFlavorColor(tastingNote).color"
            >
              {{ getFlavorColor(tastingNote).emoji }} {{ tastingNote }}
            </v-chip>
          </v-card-text>
          <div v-else />
        </v-skeleton-loader>

        <v-divider v-if="bean.story.length > 0" />

        <v-card-text v-if="bean.story.length > 0">
          <v-skeleton-loader
          :loading="loading"
          type="paragraph"
          >
            <p>{{ bean.story }}</p>
          </v-skeleton-loader>
        </v-card-text>

        <v-divider />

        <v-card-text>
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
        <v-list>
          <template
            v-for="brew in brews"
          >
            <swipeable-list-item
              :id="`brew-${brew.id}`"
              :key="`brew-${brew.id}`"
            >
              <template v-slot:edit-item>
                <v-divider />

                <v-row>
                  <v-spacer>
                    <v-list-item>

                      <v-spacer />

                      <v-btn
                        depressed
                        @click="() => goToCreateBrew(
                          bean.id,
                          {
                            brewId: brew.id,
                            action: 'copy'
                          })"
                      >
                        <v-icon>
                          mdi-coffee
                        </v-icon>

                        <span>Copy Recipe</span>
                      </v-btn>

                      <v-spacer />

                      <v-btn
                        depressed
                      >
                        <v-icon>
                          mdi-delete
                        </v-icon>

                        <span>Delete</span>

                      </v-btn>
                      <v-spacer />
                    </v-list-item>
                  </v-spacer>
                </v-row>
              </template>

              <template v-slot:view-item>
                <v-divider />

                <v-list-item
                  @click="() => goToCreateBrew(bean.id, { brewId: brew.id, action: 'edit' })"
                >
                  <v-col>
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

                  <v-list-item class="mt-0 pt-0 ml-0 pl-0 pb-0 mb-0">
                    <span class="grey--text text--lighten-2 caption mr-2">
                      ({{ brew.tasting.tastiness.quantity }})
                    </span>
                    <v-rating
                      v-model="brew.tasting.tastiness.quantity"
                      color="gray"
                      background-color="gray"
                      small
                      dense
                      readonly
                    />
                  </v-list-item>
                  </v-col>
                </v-list-item>
              </template>
            </swipeable-list-item>
          </template>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, Mutation } from 'vuex-class';
import Bean from '@/models/beans';
import BeanUserMetadata from '@/models/beanUserMetadata';
import Brew from '@/models/brew';
import formatTime from '@/utils/timeUtils';
import Flavors from '@/models/flavors';
import SwipeableListItem from '../components/SwipeableListItem.vue';
import store from '../store';
import BottomNavigatorButtonViewModel from '../components/bottomNavigator/bottomNavigatorButtonViewModel';

@Component({
  components: {
    'swipeable-list-item': SwipeableListItem,
  },
})
export default class BeanView extends Vue {
  bean = new Bean();

  beanUserMetadata = new BeanUserMetadata('', '');

  brews = {};

  tab = 'bean';

  window = 0;

  @Action
  getBeanById!: (beanId: string) => Promise<Bean>;

  @Action
  getBrewsByBeanId!: (beanId: string) => Promise<{[brewId: string]: Brew}>;

  @Action
  getBeanUserMetadata!: (beanId: string) => Promise<BeanUserMetadata>;

  @Action
  createOrUpdateBeanUserMetadata!: (beanUserMetadata: BeanUserMetadata) => Promise<string>;

  @Mutation('SET_TOP_NAVIGATION')
  setTopNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

  goToCreateBrew(beanId: string, targetBrew: { brewId: string; action: string }) {
    this.$router.push({ name: 'CreateBrew', query: { beanId, brewId: targetBrew?.brewId, action: targetBrew?.action } });
  }

  goToEditBean(beanId: string) {
    this.$router.push({ name: 'CreateBeans', query: { beanId } });
  }

  goToBeanTab() {
    this.tab = 'bean';
    this.$router.replace({
      name: 'Bean',
      params: this.$route.params,
      query: { ...this.$route.query, tab: 'bean' },
    });
  }

  goToBrewsTab() {
    this.tab = 'brews';
    this.$router.replace({
      name: 'Bean',
      params: this.$route.params,
      query: { ...this.$route.query, tab: 'brews' },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  formatDateTime(timestamp: number) {
    const b = new Date(timestamp);
    return `${b.toDateString()} @ ${b.toLocaleTimeString()}`;
  }

  // eslint-disable-next-line class-methods-use-this
  formatBrewTime(timestamp: number) {
    return formatTime(timestamp, false);
  }

  get isBeanLiked() {
    return this.beanUserMetadata?.isLiked;
  }

  get beanTastingNotes() {
    // Sort of a hack, right now this is an array that contains
    // a single string; this string contains the tasting notes separated by an commas
    if (this.bean.tastingNotes.length === 1 && this.bean.tastingNotes[0].indexOf(',') > -1) {
      return this.bean.tastingNotes[0].split(',').map((note) => note.trim());
    }

    return this.bean.tastingNotes;
  }

  // eslint-disable-next-line class-methods-use-this
  getFlavorColor(flavor: string): { color: string; emoji: string } {
    if (flavor in Flavors) {
      return Flavors[flavor];
    }

    return { color: '', emoji: '' };
  }

  get loading() {
    return this.bean.name === '';
  }

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
    this.beanUserMetadata = await this.getBeanUserMetadata(beanId);
  }

  async onBeanLikeToggle() {
    this.beanUserMetadata.isLiked = !this.beanUserMetadata.isLiked;
    this.beanUserMetadata.id = await this.createOrUpdateBeanUserMetadata(this.beanUserMetadata);
  }
}
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
