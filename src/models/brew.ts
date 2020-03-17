import Taste from '@/models/taste';
import Improvement from '@/models/improvement';

export default class Brew {
  id!: string;

  completed = false;

  brewDateTime: number;

  beanId: string;

  brewMethod!: string;

  brewTimeMilliseconds = 0;

  grindWeight!: number;

  waterVolume!: number;

  grindSetting!: number;

  tasting: Taste;

  improvements: Improvement[] = [];

  constructor(beanId: string) {
    this.brewDateTime = Date.now();
    this.beanId = beanId;
    this.tasting = new Taste();

    this.improvements = [
      new Improvement('Strength'),
      new Improvement('Extraction'),
    ];
  }
}
