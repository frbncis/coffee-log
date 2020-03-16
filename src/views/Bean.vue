<template>
  <v-card
    class="mx-5 mt-5 mb-5 pb-5"
  >
    <v-img :src="bean.imageUrl" />

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

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ bean.name }}</v-list-item-title>
        <v-list-item-subtitle>by {{ bean.roaster }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text style="white-space: pre-line;">
      {{ bean.story }}
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

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

    <v-divider class="mx-4"></v-divider>

    <v-card-title>
      <v-list-item-title>Tasting Notes</v-list-item-title>
      <v-list-item-subtitle>Rosehip, floral, raisin</v-list-item-subtitle>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Bean from '@/models/beans';
import store from '../store';

export default Vue.extend({
  name: 'Bean',
  methods: {
    ...mapGetters({
      getBeanById: 'getBeanById',
    }),
    goToCreateBrew(beanId: string) {
      this.$router.push({ name: 'CreateBrew', query: { beanId } });
    },
    goToEditBean(beanId: string) {
      this.$router.push({ name: 'CreateBeans', query: { beanId } });
    },
  },
  data: () => ({
    bean: new Bean(),
  }),
  mounted() {
    const { beanId } = this.$route.params;

    const beanDetails: Bean = this.getBeanById()(beanId);

    this.bean = beanDetails;

    store.commit('SET_TITLE', beanDetails.name);
  },
});
</script>
