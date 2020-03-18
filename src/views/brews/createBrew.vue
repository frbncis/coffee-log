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
            <selected-bean-card
              title="Brewing"
              :selectedBean="selectedBean"
            />

            <v-card
              class="mx-auto mt-5"
              outlined
            >
              <v-row cols="12" class="mx-auto">
                <v-card-title>Brew Setup</v-card-title>
                <v-spacer />

                <v-card-actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                      <v-btn
                        icon
                        class="mx-auth"
                        v-on="on"
                        @click.prevent="populateSetupFromPreviousBrew"
                      >
                        <v-icon>
                          mdi-reload
                        </v-icon>
                      </v-btn>
                    </template>
                    <span v-if="previousBrew">Load From Last Brewing</span>
                    <span v-else>No Previous Brewings Found</span>
                  </v-tooltip>
                </v-card-actions>
              </v-row>

              <v-list-item three-line>
                <v-list-item-content>
                  <v-text-field
                    v-model="brew.brewMethod"
                    placeholder="Brew Method"
                  />

                  <v-text-field
                    v-model="brew.grindWeight"
                    type="number"
                    placeholder="Dose (g)"
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

            <v-card-subtitle v-if="previousBrew">
              Previous Brew Time: {{ formatTime(previousBrew.brewTimeMilliseconds) }}
            </v-card-subtitle>

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

          <v-card>
            <v-row justify="space-around">
              <v-col cols="12">
                <v-radio-group
                  :row="true"
                  v-for="improvement in brew.improvements"
                  :key="improvement.parameter"
                  :label="improvement.parameter"
                  v-model="improvement.correction"
                >
                  <v-radio cols="3" label="Less" value="-1"></v-radio>
                  <v-radio cols="3" label="Enough" value="0"></v-radio>
                  <v-radio cols="3" label="More" value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
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
      @click.prevent="completeBrew"
    >
      Save
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import {
  Mutation, State, Action,
} from 'vuex-class';
import Bean from '@/models/beans';
import Brew from '@/models/brew';
import SelectedBeanCard from '@/components/brews/selectedBeanCard.vue';
import { Route } from 'vue-router';
import { brewsCollection } from '@/services/firebase';

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

    previousBrew: Brew = new Brew('');

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
      return this.formatTime(this.brew.brewTimeMilliseconds);
    }

    formatTime(milliseconds: number) {
      const millis = (milliseconds % 1000) / 10;
      const second = Math.floor((milliseconds / 1000) % 60);
      const minute = Math.floor((milliseconds / (1000 * 60)) % 60);

      return `${this.formatTimerFragment(minute, 2)}:${this.formatTimerFragment(second, 2)}:${this.formatTimerFragment(millis, 2)}`;
    }

    // eslint-disable-next-line class-methods-use-this
    formatTimerFragment(fragment: number, minimumIntegerDigits: number) {
      return fragment.toLocaleString('en-US', { minimumIntegerDigits, useGrouping: false });
    }

    @Action
    getBeanById!: (beanId: string) => Promise<Bean>;

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
      this.$router.replace({ name: 'CreateBrew', query: { ...this.$route.query, timerStarted: Date.now().toString() } });
    }

    resetTimer() {
      this.stopTimer();
      this.brew.brewTimeMilliseconds = 0;

      this.removeTimerStartedQueryParameter();
    }

    stopTimer() {
      this.timerRunning = false;

      this.removeTimerStartedQueryParameter();
      if (this.timerIncrementTask) {
        clearInterval(this.timerIncrementTask);
      }
    }

    removeTimerStartedQueryParameter() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { timerStarted, ...query } = this.$route.query;

      this.$router.replace({ name: 'CreateBrew', query });
    }

    async nextBrewStep() {
      if (this.hasBrewStepsRemaining) {
        this.goToBrewStep(this.brewStepField + 1);
        await this.saveBrew();
      }
    }

    goToBrewStep(nextStep: number) {
      this.$router.push({ name: 'CreateBrew', query: { ...this.$route.query, brewStep: nextStep.toString() } });
    }

    populateSetupFromPreviousBrew() {
      if (this.previousBrew) {
        this.brew = {
          ...this.brew,
          brewMethod: this.previousBrew.brewMethod,
          grindWeight: this.previousBrew.grindWeight,
          waterVolume: this.previousBrew.waterVolume,
          grindSetting: this.previousBrew.grindSetting,
        };
      }
    }

    async loadPreviousBrew() {
      this.previousBrew = await this.getMostRecentBrewByBeanId(this.beanId);
    }

    @State
    beans!: {[beanId: string]: Bean};

    @Action
    getMostRecentBrewByBeanId!: (beanId: string) => Promise<Brew>;

    @Action
    getBrewById!: (brewId: string) => Promise<Brew>;

    async completeBrew() {
      this.brew.completed = true;

      await this.saveBrew();

      this.$router.push({ name: 'Brews' });
    }

    async saveBrew() {
      if (this.brew.id) {
        await brewsCollection.doc(this.brew.id).update(JSON.parse(JSON.stringify(this.brew)));
      } else {
        const document = await brewsCollection.add(JSON.parse(JSON.stringify(this.brew)));

        this.brew.id = document.id;

        this.$router.push({ name: 'CreateBrew', query: { ...this.$route.query, brewId: this.brew.id } });
      }
    }

    async mounted() {
      this.setAppBarTitle('Create Brew');

      if (this.$route.query.brewStep) {
        this.brewStepField = Number(this.$route.query.brewStep);
      }

      if (this.$route.query.brewId) {
        this.brew = await this.getBrewById(this.$route.query.brewId as string);
        this.beanId = this.brew.beanId;
      } else if (this.$route.query.beanId) {
        this.beanId = this.$route.query.beanId as string;

        this.brew = new Brew(this.beanId);
      }


      if (this.$route.query.timerStarted) {
        const { timerStarted, brewStep } = this.$route.query;
        const elapsed = Date.now() - Number(timerStarted);
        this.brew.brewTimeMilliseconds = elapsed;

        if (brewStep === '2') {
          this.startTimer();
        }
      }

      this.selectedBean = await this.getBeanById(this.beanId);
      await this.loadPreviousBrew();
    }
}
</script>
