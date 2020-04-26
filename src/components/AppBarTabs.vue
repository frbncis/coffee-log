<template>
  <v-tabs
    v-model="tab"
    fixed-tabs
    v-if="shouldRenderButtons"
  >
    <v-tabs-slider color="yellow"></v-tabs-slider>

    <v-tab
      v-for="button in buttons"
      :key="button.value"
      :value="button.value"
      @click="button.click"
    >
      {{ button.text }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import BottomNavigatorButtonViewModel from '@/components/bottomNavigator/bottomNavigatorButtonViewModel';
import Component from 'vue-class-component';

@Component
export default class AppBarTabs extends Vue {
  @State('topNavigator')
  buttons!: BottomNavigatorButtonViewModel[];

  tab = '';

  get shouldRenderButtons() {
    const isVisible = this.buttons?.length > 0;
    this.$emit('update:tabBarVisibility', isVisible);
    return isVisible;
  }
}
</script>
