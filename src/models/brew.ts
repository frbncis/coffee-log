export default class Brew {
  id!: string;

  brewDateTime: number;

  beanId: string;

  brewMethod!: string;

  brewTimeMilliseconds!: number;

  grindWeight!: number;

  waterVolume!: number;

  grindSetting!: number;

  constructor(beanId: string) {
    this.brewDateTime = Date.now();
    this.beanId = beanId;
  }
}
