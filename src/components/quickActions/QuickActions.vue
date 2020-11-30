<template>
  <v-bottom-sheet
    :value="shouldRender"
    @click:outside="onDismissed"
  >
    <v-sheet
      class="text-center"
      height="200px"
    >
      <h3
        class="py-3 subtitle-1"
      >
        Quick Actions
      </h3>

      <v-row>
        <v-col
          cols="4"
          sm="4"
          v-for="button in buttons"
          :key="button.text"
        >
          <div>
            <div class="py-3">
              <v-btn
                outlined
                fab
                @click="() => onButtonClick(button)"
              >
                <v-icon>
                  {{ button.icon }}
                </v-icon>
              </v-btn>
            </div>
            <h4
              class="caption"
            >
              {{ button.text }}
            </h4>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import QuickActionButtonViewModel from './quickActionButtonViewModel';

@Component
export default class QuickActions extends Vue {
  @Prop()
  shouldRender = false;

  @Prop()
  buttons!: QuickActionButtonViewModel[];

  onDismissed() {
    this.$emit('onDismissed');
  }

  onButtonClick(button: QuickActionButtonViewModel) {
    // Trigger onDismiss to get the parent to hide us.
    this.onDismissed();
    button.onClick();
  }
}

export {
  QuickActionButtonViewModel,
};
</script>
