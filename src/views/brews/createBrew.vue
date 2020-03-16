<template>
  <v-container dark>
    <v-stepper v-model="brewStep">
      <v-stepper-header>
        <v-stepper-step :complete="brewStep > 1" step="1">Setup</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="brewStep > 2" step="2">Brew</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="brewStep > 3"
          step="3"
        >
          Taste
        </v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="brewStep > 4" step="4">Improve</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
            <selected-bean-card :selectedBean="selectedBean" />

            <v-card
              class="mx-auto mt-5"
              outlined
            >
              <v-card-title>Brew Setup</v-card-title>

              <v-list-item three-line>
                <v-list-item-content>
                  <v-text-field
                    v-model="brew.brewMethod"
                    placeholder="Brew Method"
                  />

                  <v-text-field
                    v-model="brew.grindWeight"
                    type="number"
                    placeholder="Coffee Grounds Weight (g)"
                  />

                  <v-text-field
                    v-model="brew.waterVolume"
                    type="number"
                    placeholder="Water Volume (mL)"
                  />

                  <v-text-field
                    v-model="brew.grindSetting"
                    type="number"
                    placeholder="Grind Setting"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
        </v-stepper-content>

        <v-stepper-content step="2" class="text-center">
          <v-card>
            <h1>{{ timeElapsedFormatted }}</h1>

            <v-card-subtitle>Previous Brew Time: 0:00</v-card-subtitle>

            <v-card-actions>
              <v-row>
                <v-btn
                  v-if="!timerRunning"
                  class="mb-5"
                  block
                  color="success"
                  @click="startTimer"
                >
                  Start
                </v-btn>

                <v-btn
                  v-if="timerRunning"
                  class="mb-5"
                  block
                  dark
                  color="red"
                  @click="stopTimer"
                >
                  Stop
                </v-btn>

                <v-btn
                  @click="resetTimer"
                  class="mb-5"
                  block
                  color="secondary"
                >
                  Reset
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <selected-bean-card :selectedBean="selectedBean" />

          <v-card
            class="mx-auto mt-5"
            outlined
          >
            <v-card-title>Tasting</v-card-title>
            <v-list>
              <v-list-group
                v-for="criteria in tasteCriterion"
                :key="criteria.name"
                v-model="criterionIsExpandedState[criteria.name]"
                :prepend-icon="criteria.action"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="criteria.name" />
                  </v-list-item-content>
                </template>

                <v-list-item-content>
                  <v-list-item>
                    <v-list-item-subtitle>
                      Quantity
                    </v-list-item-subtitle>

                    <v-rating
                      v-model="criteria.quantity"
                    />
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-subtitle>
                      Quality
                    </v-list-item-subtitle>

                    <v-rating
                      v-model="criteria.quality"
                    />
                  </v-list-item>

                  <v-list-item>
                    <v-textarea
                      placeholder="Notes"
                      v-model="criteria.notes"
                      outlined
                    />
                  </v-list-item>
                </v-list-item-content>
              </v-list-group>
            </v-list>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card>
            <v-img
              :src="require('@/assets/coffee-compass.jpg')"
            />
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-btn
      v-if="hasBrewStepsRemaining"
      :disabled="timerRunning"
      block
      color="primary"
      class="mt-5 mb-5"
      @click="nextBrewStep"
    >
      Continue
    </v-btn>

    <v-btn
      v-else
      block
      color="secondary"
      class="mt-5 mb-5"
    >
      Save
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import Bean from '@/models/beans';
import Brew from '@/models/brew';
import SelectedBeanCard from '@/components/brews/selectedBeanCard.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    'selected-bean-card': SelectedBeanCard,
  },
  data: () => ({
    brewStepField: 1,
  }),
})
export default class CreateBrew extends Vue {
    selectedBean: Bean = new Bean();

    brew: Brew = new Brew('');

    beanId!: string;

    brewStepField = 1;

    timerRunning = false;

    timerIncrementTask!: number

    timerTickMilliseconds = 100;

    criterionIsExpandedState = {
    }

    get tasteCriterion() {
      return [
        this.brew.tasting.tastiness,
        this.brew.tasting.aroma,
        this.brew.tasting.acidity,
        this.brew.tasting.sweetness,
        this.brew.tasting.body,
        this.brew.tasting.finish,
      ];
    }

    @Watch('$route', { immediate: true, deep: true })
    onRouteChanged(newRoute: Route) {
      if (newRoute.query.brewStep) {
        this.brewStepField = Number(newRoute.query.brewStep);
      } else {
        this.brewStepField = 1;
      }
    }

    get brewStep() {
      return this.brewStepField;
    }

    get timeElapsedFormatted() {
      const millis = (this.brew.brewTimeMilliseconds % 1000) / 10;
      const second = Math.floor((this.brew.brewTimeMilliseconds / 1000) % 60);
      const minute = Math.floor((this.brew.brewTimeMilliseconds / (1000 * 60)) % 60);

      return `${this.formatTimerFragment(minute, 2)}:${this.formatTimerFragment(second, 2)}:${this.formatTimerFragment(millis, 2)}`;
    }

    // eslint-disable-next-line class-methods-use-this
    formatTimerFragment(fragment: number, minimumIntegerDigits: number) {
      return fragment.toLocaleString('en-US', { minimumIntegerDigits, useGrouping: false });
    }

    @Getter
    getBeanById!: (beanId: string) => Bean;

    @Mutation('SET_TITLE')
    setAppBarTitle!: (title: string) => void;

    get hasBrewStepsRemaining() {
      return this.brewStep < 4;
    }

    incrementTimer() {
      this.brew.brewTimeMilliseconds += this.timerTickMilliseconds;
    }

    startTimer() {
      this.timerRunning = true;
      this.timerIncrementTask = setInterval(this.incrementTimer, this.timerTickMilliseconds);
    }

    resetTimer() {
      this.stopTimer();
      this.brew.brewTimeMilliseconds = 0;
    }

    stopTimer() {
      this.timerRunning = false;

      if (this.timerIncrementTask) {
        clearInterval(this.timerIncrementTask);
      }
    }

    nextBrewStep() {
      console.log(JSON.stringify(this.brew));

      if (this.hasBrewStepsRemaining) {
        this.goToBrewStep(this.brewStepField + 1);
      }
    }

    goToBrewStep(nextStep: number) {
      const { beanId } = this;
      this.$router.push({ name: 'CreateBrew', query: { beanId, brewStep: nextStep.toString() } });
    }

    created() {
      this.setAppBarTitle('Create Brew');

      if (this.$route.query.beanId) {
        this.beanId = this.$route.query.beanId as string;

        this.brew = new Brew(this.beanId);

        this.selectedBean = this.getBeanById(this.beanId);
      }

      if (this.$route.query.brewStep) {
        this.brewStepField = Number(this.$route.query.brewStep);
      }
    }
}
</script>
