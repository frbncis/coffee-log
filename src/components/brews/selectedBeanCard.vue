<template>
  <v-card
    class="mx-auto mt-5 "
    outlined
  >
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
import { Prop } from 'vue-property-decorator';
import Bean from '../../models/beans';

@Component
export default class SelectedBeanCard extends Vue {
  @Prop()
  selectedBean!: Bean;
}
</script>
