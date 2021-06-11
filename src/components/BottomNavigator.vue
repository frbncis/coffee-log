<template>
    <v-bottom-navigation
      v-if="shouldRenderButtons"
      v-model="bottomNav"
      app
      grow
    >
      <v-btn
        v-for="button in buttons"
        :key="button.value"
        :value="button.value"
        @click="button.click"
      >
        <span>{{ button.text, }}</span>

        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import BottomNavigatorButtonViewModel from '@/components/bottomNavigator/bottomNavigatorButtonViewModel';
import Component from 'vue-class-component';

@Component
export default class BottomNavigator extends Vue {
  @State('bottomNavigator')
  buttons!: BottomNavigatorButtonViewModel[];

  @State('bottomNavigatorDisplay')
  bottomNavigatorDisplay!: boolean;

  bottomNav = '';

  get shouldRenderButtons() {
    return this.buttons?.length > 0 && this.bottomNavigatorDisplay;
  }
}
</script>
