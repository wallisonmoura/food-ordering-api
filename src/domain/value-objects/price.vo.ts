export class Price {
  constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Price must be non-negative');
    }
  }

  getValue(): number {
    return this.value;
  }
}
