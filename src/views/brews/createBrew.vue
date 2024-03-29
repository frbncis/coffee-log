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
              v-if="!isAdHoc"
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
                        v-if="!brew.completed && showLoadPreviousBrew"
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
                  <v-combobox
                    v-model="brew.brewMethod"
                    :items="brewMethods"
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

                  <v-subheader class="pl-0 pt-0 mt-0 pb-0 mb-0">Brew Ratio</v-subheader>

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
                        :disabled="isBrewRatioLocked"
                        @click="decrementBrewRatio"
                      >
                        mdi-minus
                      </v-icon>
                    </template>

                    <template v-slot:append>
                      <v-icon
                        :disabled="isBrewRatioLocked"
                        @click="incrementBrewRatio"
                      >
                        mdi-plus
                      </v-icon>

                      <v-icon
                        @click="toggleBrewRatioLock"
                      >
                        {{ isBrewRatioLocked ? 'mdi-lock' : 'mdi-lock-open-outline' }}
                      </v-icon>
                    </template>
                  </v-slider>

                  <v-text-field
                    v-model="brew.grindWeight"
                    outlined
                    type="number"
                    label="Dose"
                    @change="onDoseChange"
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
                    @change="onWaterVolumeChange"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
        </v-stepper-content>

        <v-stepper-content step="2" class="text-center">
          <v-card
            class="px-5 pt-5"
          >
            <h1 class="display-3"
              @click.stop="onTimerClicked"
            >
              <v-progress-circular
                id="brewStepCircularProgress"
                rotate="-90"
                size="180"
                :value="currentBrewRecipeStepTimeRemainingPercentage"
                color="cyan"
              >
                {{ timeElapsedFormatted }}
              </v-progress-circular>

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
                      text
                      @click="commitEditTimeDialog"
                    >
                      Set
                    </v-btn>

                    <v-btn
                      text
                      @click="dismissEditTimeDialog"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </h1>

            <v-card-subtitle v-if="previousBrew">
              Previous Brew Time: {{ formatBrewTime(previousBrew.brewTimeMilliseconds) }}
            </v-card-subtitle>

            <h4 class="pb-5 pt-5">
              {{ brewTimingDescription }}
            </h4>

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
                  :disabled="timerRunning"
                >
                  Reset
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <selected-bean-card
            v-if="!isAdHoc"
            :selectedBean="selectedBean"
          />

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
import { NavigationGuardNext, Route } from 'vue-router';
import NoSleep from 'nosleep.js';
import formatTime from '@/utils/timeUtils';
import BottomNavigatorButtonViewModel from '../../components/bottomNavigator/bottomNavigatorButtonViewModel';
import Improvement, { Correction } from '../../models/improvement';
import BrewRecipeStep from './brewRecipeStep';

@Component({
  components: {
    'selected-bean-card': SelectedBeanCard,
  },
  data: () => ({
    brewStepField: 1,
  }),
  beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext<CreateBrew>) {
    const isStepChange = Number(to.query.brewStep) !== this.brewStep;

    const shouldBlockUpdate = isStepChange && this.timerRunning;

    if (shouldBlockUpdate) {
      next(false);
    } else {
      next();
    }
  },
})
export default class CreateBrew extends Vue {
    brewMethods = [
      'Aeropress',
      'Chemex',
      'French Press',
      'Cupping',
      'V60',
    ].sort();

    selectedBean: Bean = new Bean();

    brew: Brew = new Brew('');

    previousBrew: Brew = new Brew('');

    populatedSetupFromPreviousBrew = false;

    showLoadPreviousBrew = true;

    beanId!: string;

    brewStepField = 1;

    brewRatio = 15;

    timerRunning = false;

    wakeLock = new NoSleep();

    timerIncrementTask!: number

    timerTickMilliseconds = 100;

    editTimeDialog = false;

    editTimeBrewTimeSeconds = 0;

    isAdHoc = false;

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

    @Mutation('SET_BOTTOM_NAVIGATION_DISPLAY')
    setBottomNavigationDisplay!: (shouldDisplay: boolean) => void;

    get brewStep() {
      return this.brewStepField;
    }

    get timeElapsedFormatted() {
      return formatTime(this.brew.brewTimeMilliseconds, false);
    }

    // eslint-disable-next-line class-methods-use-this
    formatBrewTime(timestamp: number) {
      return formatTime(timestamp, false);
    }

    onTimerClicked() {
      if (!this.timerRunning) {
        this.showEditTimeDialog();
      }
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

    isBrewRatioLocked = false;

    get hasBrewStepsRemaining() {
      return this.brewStep < 4;
    }

    incrementBrewRatio() {
      this.brewRatio += 1;
      this.brew.waterVolume = this.brewRatio * this.brew.grindWeight;
    }

    decrementBrewRatio() {
      this.brewRatio -= 1;
      this.brew.waterVolume = this.brewRatio * this.brew.grindWeight;
    }

    toggleBrewRatioLock() {
      this.isBrewRatioLocked = !this.isBrewRatioLocked;
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
        // If there is already a value on the timer then
        // we need to offset the query parameter
        let timerStarted = Date.now();

        if (this.brew.brewTimeMilliseconds) {
          timerStarted -= this.brew.brewTimeMilliseconds;
        }

        this.$router.replace({ name: 'CreateBrew', query: { ...this.$route.query, timerStarted: timerStarted.toString() } });
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

    onDoseChange() {
      if (this.isBrewRatioLocked) {
        this.brew.waterVolume = this.brewRatio * this.brew.grindWeight;
      } else {
        this.recalculateBrewRatio();
      }
    }

    onWaterVolumeChange() {
      if (this.isBrewRatioLocked) {
        this.brew.grindWeight = this.brew.waterVolume / this.brewRatio;
      } else {
        this.recalculateBrewRatio();
      }
    }

    recalculateBrewRatio() {
      this.brewRatio = this.brew.waterVolume / this.brew.grindWeight;
    }

    async loadPreviousBrew() {
      this.previousBrew = await this.getMostRecentBrewByBeanId(this.beanId);
      this.recalculateBrewRatio();
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

    @Mutation('SET_TOP_NAVIGATION')
    setTopNavigation!: (buttons: BottomNavigatorButtonViewModel[]) => void;

    async completeBrew() {
      this.brew.completed = true;

      await this.saveBrew();

      this.$router.push({ name: 'Bean', params: { beanId: this.brew.beanId } });
    }

    async saveBrew() {
      if (!this.isAdHoc) {
        const id = await this.saveBrewAction(this.brew);

        if (!this.brew.id) {
          this.brew.id = id;
        }
      }
    }

    get brewTimingDescription(): string {
      return this.currentBrewRecipeStep.text;
    }

    get currentBrewRecipeStepTimeRemainingPercentage(): number {
      if (this.currentBrewRecipeStep.isFinalStep) {
        return 0;
      }

      // eslint-disable-next-line no-mixed-operators
      // eslint-disable-next-line max-len
      let a = (this.brew.brewTimeMilliseconds - this.currentBrewRecipeStep.startTimeMilliseconds) / (this.currentBrewRecipeStep.endTimeMilliseconds - this.currentBrewRecipeStep.startTimeMilliseconds);
      a *= 100;

      return 100 - a;
    }

    // TODO: This should be refactored out to allow swapping
    // out different recipes. Right now this is James Hoffmann's
    // V60 recipe; but Tetsu Kasuya's 4-6 V60 could be valid (due
    // to timing complexity).
    get currentBrewRecipeStep(): BrewRecipeStep {
      let brewTimingDescription = '';
      const brewRecipeStep = new BrewRecipeStep();

      if (this.brew.brewMethod === 'V60') {
        const BLOOM_TIME_MS = 45000;
        const BREW_60_PERCENT_MARK_MS = 75000;
        const BREW_100_PERCENT_MARK_MS = 105000;

        if (this.brew.brewTimeMilliseconds <= BLOOM_TIME_MS) {
          brewTimingDescription = `Bloom with ${this.brew.grindWeight * 2} mL until ${this.formatBrewTime(BLOOM_TIME_MS)}`;
          brewRecipeStep.targetWaterVolume = this.brew.grindWeight * 2;
          brewRecipeStep.startTimeMilliseconds = 0;
          brewRecipeStep.endTimeMilliseconds = BLOOM_TIME_MS;
        } else if (this.brew.brewTimeMilliseconds <= BREW_60_PERCENT_MARK_MS) {
          brewTimingDescription = `${this.brew.waterVolume * 0.6} mL @ ${this.formatBrewTime(BREW_60_PERCENT_MARK_MS)}`;
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume * 0.6;
          brewRecipeStep.startTimeMilliseconds = BLOOM_TIME_MS;
          brewRecipeStep.endTimeMilliseconds = BREW_60_PERCENT_MARK_MS;
        } else if (this.brew.brewTimeMilliseconds <= BREW_100_PERCENT_MARK_MS) {
          brewTimingDescription = `${this.brew.waterVolume} mL @ ${this.formatBrewTime(BREW_100_PERCENT_MARK_MS)}`;
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume;
          brewRecipeStep.startTimeMilliseconds = BREW_60_PERCENT_MARK_MS;
          brewRecipeStep.endTimeMilliseconds = BREW_100_PERCENT_MARK_MS;
        } else {
          brewTimingDescription = 'Stir, swirl, wait for drawdown. Enjoy!';
          brewRecipeStep.isFinalStep = true;
        }
      } else if (this.brew.brewMethod === 'Aeropress') {
        // This is James Hoffmann's Aeropress recipe.
        const BLOOM_FILL_TIME_MS = 10 * 1000;
        const BREW_SHAKE_MARK_MS = 2 * 60 * 1000;
        const BREW_BEGIN_PRESS_MARK_MS = 2.5 * 60 * 1000;
        const BREW_END_PRESS_MARK_MS = 3 * 60 * 1000;

        if (this.brew.brewTimeMilliseconds <= BLOOM_FILL_TIME_MS) {
          brewTimingDescription = `Fill chamber with ${this.brew.waterVolume} mL of boiling water.`;
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume;
          brewRecipeStep.startTimeMilliseconds = 0;
          brewRecipeStep.endTimeMilliseconds = BLOOM_FILL_TIME_MS;
        } else if (this.brew.brewTimeMilliseconds <= BREW_SHAKE_MARK_MS) {
          brewTimingDescription = 'Insert piston and wait.';
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume;
          brewRecipeStep.startTimeMilliseconds = BLOOM_FILL_TIME_MS;
          brewRecipeStep.endTimeMilliseconds = BREW_SHAKE_MARK_MS;
        } else if (this.brew.brewTimeMilliseconds <= BREW_BEGIN_PRESS_MARK_MS) {
          brewTimingDescription = 'Gently swirl and let settle.';
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume;
          brewRecipeStep.startTimeMilliseconds = BREW_SHAKE_MARK_MS;
          brewRecipeStep.endTimeMilliseconds = BREW_BEGIN_PRESS_MARK_MS;
        } else if (this.brew.brewTimeMilliseconds <= BREW_END_PRESS_MARK_MS) {
          brewTimingDescription = 'Press gently all the way.';
          brewRecipeStep.targetWaterVolume = this.brew.waterVolume;
          brewRecipeStep.startTimeMilliseconds = BREW_BEGIN_PRESS_MARK_MS;
          brewRecipeStep.endTimeMilliseconds = BREW_END_PRESS_MARK_MS;
        } else {
          brewTimingDescription = 'Enjoy!';
          brewRecipeStep.isFinalStep = true;
        }
      }

      brewRecipeStep.text = brewTimingDescription;

      return brewRecipeStep;
    }

    @Action('saveBrew')
    saveBrewAction!: (brew: Brew) => Promise<string>;

    async mounted() {
      this.setTopNavigation([]);
      this.setBottomNavigationDisplay(false);

      if (this.$route.query.brewStep) {
        this.brewStepField = Number(this.$route.query.brewStep);
      }

      if (this.$route.query.isAdHoc) {
        this.isAdHoc = Boolean(this.$route.query.isAdHoc);
      }

      if (this.$route.query.brewId && this.$route.query.action === 'edit') {
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

      if (this.$route.query.brewId && this.$route.query.action === 'edit') {
        this.setAppBarTitle('Edit Brew');
      } else {
        this.setAppBarTitle('Create Brew');
      }

      this.selectedBean = await this.getBeanById(this.beanId);

      if (this.$route.query.brewId !== '' && this.$route.query.action === 'copy') {
        this.showLoadPreviousBrew = false;
        this.previousBrew = await this.getBrewById(this.$route.query.brewId as string);
        this.populateSetupFromPreviousBrew();
      } else {
        await this.loadPreviousBrew();
      }
    }
}
</script>

<style>
#brewStepCircularProgress > svg > circle.v-progress-circular__overlay {
  -webkit-transition: none !important;
  transition: none !important;
}
</style>
