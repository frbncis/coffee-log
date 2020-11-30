export default class BrewRecipeStep {
  targetWaterVolume!: number;

  startTimeMilliseconds!: number;

  endTimeMilliseconds!: number;

  isFinalStep = false;

  text!: string;
}
