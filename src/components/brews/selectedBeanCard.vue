<template>
  <v-card
    class="mx-auto mt-5 "
    outlined
  >
    <v-card-title>{{ title }}</v-card-title>

    <v-list-item three-line>
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      >
        <v-img :src="selectedBean.imageUrl" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ selectedBean.name }}
        </v-list-item-title>

        <v-list-item-subtitle>{{ selectedBean.roaster }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: ['selectedBean', 'title'],
})
export default class SelectedBeanCard extends Vue {
}
</script>
