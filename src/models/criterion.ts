export default class Criterion {
  name: string;

  quality!: string;

  quantity!: string;

  notes!: string;

  constructor(name: string) {
    this.name = name;
  }
}
