export enum Correction {
  Less = '-1',
  Enough = '0',
  More = '1',
}

export default class Improvement {
  parameter = '';

  correction: Correction = Correction.Enough;

  constructor(parameter: string) {
    this.parameter = parameter;
  }
}
