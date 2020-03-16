import Criterion from './criterion';

export default class Taste {
  aroma: Criterion;

  acidity: Criterion;

  sweetness: Criterion;

  body: Criterion;

  finish: Criterion;

  flavour: string[];

  tastiness: Criterion;

  constructor() {
    this.aroma = new Criterion('Aroma');
    this.acidity = new Criterion('Acidity');
    this.sweetness = new Criterion('Sweetness');
    this.body = new Criterion('Body');
    this.finish = new Criterion('Finish');
    this.tastiness = new Criterion('General Tastiness');

    this.flavour = [];
  }
}
