<template>
  <v-container>
    <v-row class="text-center">
      <ul v-for="bean in beans" :key="bean.id">
        <li>{{ bean.name }}</li>
      </ul>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import store from '../store';

export default Vue.extend({
  name: 'Beans',
  computed: {
    ...mapState({
      beans: 'beans',
    }),
  },
  data: () => ({
  }),
  mounted() {
    store.commit('SET_TITLE', 'Beans');
  },
});
</script>
