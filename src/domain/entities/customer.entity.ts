import { v4 as uuidv4 } from 'uuid'
import { Address } from "../value-objects/address.vo"
import { Document } from "../value-objects/document.vo"

export class Customer {
  public readonly id: string
  public readonly createdAt: Date

  constructor(
    public name: string,
    public email: string,
    public phone: string,
    public document: Document,
    public address: Address,
    id?: string,
    createdAt?: Date
  ) {
    this.id = id ?? uuidv4()
    this.createdAt = createdAt ?? new Date()

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email')
    }

    if (!this.isValidPhone(phone)) {
      throw new Error('Invalid phone number')
    }

    if (!name || name.trim().length === 0) {
      throw new Error('Customer name is required')
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private isValidPhone(phone: string): boolean {
    return /^\d{10,11}$/.test(phone)
  }
}
