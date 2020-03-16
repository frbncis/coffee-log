import Taste from '@/models/taste';

export default class Brew {
  id!: string;

  brewDateTime: number;

  beanId: string;

  brewMethod!: string;

  brewTimeMilliseconds = 0;

  grindWeight!: number;

  waterVolume!: number;

  grindSetting!: number;

  public tasting: Taste;

  constructor(beanId: string) {
    this.brewDateTime = Date.now();
    this.beanId = beanId;
    this.tasting = new Taste();
  }
}
