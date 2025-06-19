export class Address {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string
  ) {
    if (!street || !number || !city || !state || !zipCode) {
      throw new Error('Invalid address')
    }
  }

  getFullAddress(): string {
    return `${this.street}, ${this.number} - ${this.city}/${this.state} - ${this.zipCode}`
  }
}
