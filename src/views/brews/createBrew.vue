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
                        v-if="!brew.completed"
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
                    outlined
                    label="Brew Method"
                  />

                  <v-text-field
                    v-model="brew.grindSetting"
                    outlined
                    type="number"
                    label="Grind Setting"
                    suffix="click(s)"
                  >
                    <template v-slot:append-outer v-if="shouldShowExtractionImprovement">
                      <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                          <v-icon v-on="on">
                            mdi-alert
                          </v-icon>
                        </template>
                        <span>{{ extractionImprovementMessage }}</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="brew.grindWeight"
                    outlined
                    type="number"
                    label="Dose"
                    @change="recalculateBrewRatio"
                  >
                    <template v-slot:append-outer v-if="shouldShowStrengthImprovement">
                      <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                          <v-icon v-on="on">
                            mdi-alert
                          </v-icon>
                        </template>
                        <span>{{ strengthImprovementMessage }}</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>

                  <v-text-field
                    v-model="brew.waterVolume"
                    outlined
                    type="number"
                    label="Water Volume"
                    suffix="mL"
                    @change="recalculateBrewRatio"
                  />

                  <v-subheader class="pl-0">Brew Ratio</v-subheader>

                  <v-slider
                    v-model="brewRatio"
                    min="10"
                    max="20"
                    inverse-label
                    :label="String(brewRatio)"
                    @change="recalculateDoseFromBrewRatio"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        @click="decrementBrewRatio"
                      >
                        mdi-minus
                      </v-icon>
                    </template>

                    <template v-slot:append>
                      <v-icon
                        @click="incrementBrewRatio"
                      >
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-slider>
                </v-list-item-content>
              </v-list-item>
            </v-card>
        </v-stepper-content>

        <v-stepper-content step="2" class="text-center">
          <v-card>
            <h1 class="display-3">{{ timeElapsedFormatted }}

              <v-btn
                icon
                :disabled="timerRunning"
                @click.stop="showEditTimeDialog"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>

                <v-dialog
                  v-model="editTimeDialog"
                  max-width="290"
                >
                  <v-card>
                    <v-card-title class="headline">Edit Brew Time</v-card-title>

                    <v-card-text>
                      <v-text-field
                        type="number"
                        outlined
                        suffix="seconds"
                        v-model="editTimeBrewTimeSeconds"
                      />
                    </v-card-text>


                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        color="green darken-1"
                        text
                        @click="commitEditTimeDialog"
                      >
                        Set
                      </v-btn>

                      <v-btn
                        color="red darken-1"
                        text
                        @click="dismissEditTimeDialog"
                      >
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </h1>
            <v-card-subtitle v-if="previousBrew">
              Previous Brew Time: {{ formatBrewTime(previousBrew.brewTimeMilliseconds) }}
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
import { brewsCollection, beansCollection } from '@/services/firebase';
import NoSleep from 'nosleep.js';
import formatTime from '@/utils/timeUtils';
import BottomNavigatorButtonViewModel from '../../components/bottomNavigator/bottomNavigatorButtonViewModel';
import Improvement, { Correction } from '../../models/improvement';

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

    populatedSetupFromPreviousBrew = false;

    beanId!: string;

    brewStepField = 1;

    brewRatio = 15;

    timerRunning = false;

    wakeLock = new NoSleep();

    timerIncrementTask!: number

    timerTickMilliseconds = 100;

    editTimeDialog = false;

    editTimeBrewTimeSeconds = 0;

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
      return formatTime(this.brew.brewTimeMilliseconds);
    }

    // eslint-disable-next-line class-methods-use-this
    formatBrewTime(timestamp: number) {
      return formatTime(timestamp);
    }

    showEditTimeDialog() {
      this.editTimeBrewTimeSeconds = this.brew.brewTimeMilliseconds / 1000;
      this.editTimeDialog = true;
    }

    dismissEditTimeDialog() {
      this.editTimeDialog = false;
    }

    commitEditTimeDialog() {
      this.brew.brewTimeMilliseconds = this.editTimeBrewTimeSeconds * 1000;

      this.dismissEditTimeDialog();
    }

    @Action
    getBeanById!: (beanId: string) => Promise<Bean>;

    @Mutation('SET_TITLE')
    setAppBarTitle!: (title: string) => void;

    get hasBrewStepsRemaining() {
      return this.brewStep < 4;
    }

    incrementBrewRatio() {
      this.brewRatio += 1;

      this.recalculateDoseFromBrewRatio();
    }

    decrementBrewRatio() {
      this.brewRatio -= 1;

      this.recalculateDoseFromBrewRatio();
    }

    incrementTimer() {
      // Ensure there isn't drift between the timestamp query parameter
      // and the variable.
      const { timerStarted } = this.$route.query as { [query: string]: string };

      if (Math.abs(this.brew.brewTimeMilliseconds - Number(timerStarted)) > 2000) {
        this.brew.brewTimeMilliseconds = Date.now() - Number(timerStarted);
      }

      this.brew.brewTimeMilliseconds += this.timerTickMilliseconds;
    }

    startTimer(setQueryParameter = true) {
      this.timerRunning = true;
      this.timerIncrementTask = setInterval(this.incrementTimer, this.timerTickMilliseconds);

      if (setQueryParameter) {
        this.$router.replace({ name: 'CreateBrew', query: { ...this.$route.query, timerStarted: Date.now().toString() } });
      }

      this.wakeLock.enable();
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

      this.wakeLock.disable();
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
        this.populatedSetupFromPreviousBrew = true;

        this.brew = {
          ...this.brew,
          brewMethod: this.previousBrew.brewMethod,
          grindWeight: this.previousBrew.grindWeight,
          waterVolume: this.previousBrew.waterVolume,
          grindSetting: this.previousBrew.grindSetting,
        };

        this.recalculateBrewRatio();
      }
    }

    recalculateBrewRatio() {
      this.brewRatio = this.brew.waterVolume / this.brew.grindWeight;
    }

    recalculateDoseFromBrewRatio() {
      this.brew.grindWeight = this.brew.waterVolume / this.brewRatio;
    }

    async loadPreviousBrew() {
      this.previousBrew = await this.getMostRecentBrewByBeanId(this.beanId);
    }

    get getBrewImprovements() {
      const improvements: {[parameter: string]: Correction} = {};
      this.previousBrew.improvements.forEach((improvement: Improvement) => {
        improvements[improvement.parameter] = improvement.correction as Correction;
      });

      return improvements;
    }

    get strengthImprovement() {
      const correction = this.getBrewImprovements.Strength;
      if (correction) {
        return correction;
      }
      return null;
    }

    get extractionImprovement() {
      const correction = this.getBrewImprovements.Extraction;
      if (correction) {
        return correction;
      }
      return null;
    }

    get shouldShowExtractionImprovement() {
      if (this.populatedSetupFromPreviousBrew
        && this.extractionImprovement
        && this.extractionImprovement !== Correction.Enough) {
        return this.previousBrew.grindSetting === this.brew.grindSetting;
      }

      return false;
    }

    get extractionImprovementMessage() {
      let message = '';

      switch (this.extractionImprovement) {
        case Correction.Less: {
          message = 'Increase your grind setting to correct your brew';
          break;
        }
        case Correction.More: {
          message = 'Decrease your grind setting to correct your brew';
          break;
        }
        default: {
          message = '';
          break;
        }
      }

      return message;
    }

    get shouldShowStrengthImprovement() {
      if (this.populatedSetupFromPreviousBrew
        && this.strengthImprovement
        && this.strengthImprovement !== Correction.Enough) {
        return this.previousBrew.grindWeight === this.brew.grindWeight;
      }

      return false;
    }

    get strengthImprovementMessage() {
      let message = '';

      switch (this.strengthImprovement) {
        case Correction.Less: {
          message = 'Decrease your dose to correct your brew';
          break;
        }
        case Correction.More: {
          message = 'Increase your dose to correct your brew';
          break;
        }
        default: {
          message = '';
          break;
        }
      }

      return message;
    }

    @State
    beans!: {[beanId: string]: Bean};

    @Action
    getMostRecentBrewByBeanId!: (beanId: string) => Promise<Brew>;

    @Action
    getBrewById!: (brewId: string) => Promise<Brew>;

    @Mutation('SET_BOTTOM_NAVIGATION')
    setBottomNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

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

        await beansCollection.doc(this.selectedBean.id).collection('brews').add({ id: this.selectedBean.id });

        this.brew.id = document.id;

        this.$router.push({ name: 'CreateBrew', query: { ...this.$route.query, brewId: this.brew.id } });
      }
    }

    async mounted() {
      this.setBottomNavigation([]);

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
          this.startTimer(false);
        }
      }

      if (this.brew.completed) {
        this.setAppBarTitle('Edit Brew');
      } else {
        this.setAppBarTitle('Create Brew');
      }

      this.selectedBean = await this.getBeanById(this.beanId);
      await this.loadPreviousBrew();
    }
}
</script>
