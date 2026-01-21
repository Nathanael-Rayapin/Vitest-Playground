export class Answer {
  _value: number

  constructor(value: number) {
    this._value = value
  }

  private value() {
    return this._value
  }
}