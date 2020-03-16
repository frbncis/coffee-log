import Criterion from './criterion';

export default class Taste {
  public aroma: Criterion;

  public acidity: Criterion;

  public sweetness: Criterion;

  public body: Criterion;

  public finish: Criterion;

  public flavour: string[];

  public tastiness: Criterion;

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
