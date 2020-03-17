<template>
  <v-container fluid>
    <v-row v-for="bean in beans" :key="bean.id" dense>
      <v-card
        cols="12"
        class="mb-3"
        outlined
        width="100%"
        @click="() => goToBeanDetails(bean.id)"
      >
        <v-list-item four-line>
          <v-list-item-avatar
            tile
            size="180"
            color="grey"
          >
            <v-img
              :src="bean.imageUrl"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <div class="overline mb-4">{{ bean.roaster }}</div>
            <v-list-item-title class="headline mb-1">{{ bean.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ bean.originCountry }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import store from '../store';

export default Vue.extend({
  name: 'Beans',
  computed: {
    ...mapState({
      beans: 'beans',
    }),
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
  },
});
</script>
