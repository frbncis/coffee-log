<template>
  <div>
    <div v-for="bean in beans" :key="bean.id">
      <v-row dense>
        <v-list-item
          four-line
          @click="() => beanClicked(bean.id)"
        >
          <v-list-item-avatar
            tile
            size="84"
          >
            <v-img
              :src="bean.imageUrl"
              aspect-ratio="1"
              contain
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Bean from '@/models/beans';

@Component
export default class BeansList extends Vue {
  @Prop()
  beans!: { [beanId: string]: Bean }

  beanClicked(beanId: string) {
    this.$emit('bean-clicked', beanId);
  }
}
</script>
