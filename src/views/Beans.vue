<template>
  <v-container>
    <v-skeleton-loader
      type="bean@4"
      tile
      :types="{ 'bean': 'article'}"
      :loading="loading"
    >
      <!-- Empty div to occupy default slot so skeleton
        will load while v-for renders. -->
      <div />
      <div v-for="bean in beans" :key="bean.id">
        <v-row dense>
          <v-list-item
            four-line
            @click="() => goToBeanDetails(bean.id)"
          >
            <v-list-item-avatar
              tile
              size="84"
            >
              <v-img
                :src="bean.imageUrl"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <div class="overline">{{ bean.roaster }}</div>
              <v-list-item-title>{{ bean.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ bean.originCountry }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-divider />
      </div>
      <v-row dense>
        <v-btn
          block
          outlined
          flat
          class="mt-5"
          @click="() => this.$router.push({ name: 'CreateBeans' })"
        >
          Add Bean
        </v-btn>
      </v-row>
    </v-skeleton-loader>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions, mapGetters } from 'vuex';
import store from '../store';

export default Vue.extend({
  name: 'Beans',
  computed: {
    ...mapState({
      beans: 'beans',
    }),
    loading() {
      return Object.entries(this.beans).length === 0;
    },
  },
  async created() {
    await this.getBeans();
  },
  methods: {
    goToBeanDetails(beanId: string) {
      this.$router.push({ name: 'Bean', params: { beanId } });
    },
    ...mapActions({
      getBeans: 'getBeans',
    }),
  },
  mounted() {
    store.commit('SET_TITLE', 'Beans');
    store.commit('SET_BOTTOM_NAVIGATION', []);
  },
});
</script>
