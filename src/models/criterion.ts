export default class Criterion {
  public name: string;

  public quality = 0;

  public quantity = 0;

  public notes = '';

  constructor(name: string) {
    this.name = name;
  }
}
