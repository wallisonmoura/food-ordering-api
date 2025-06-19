import { v4 as uuidv4 } from 'uuid'
import { PaymentStatus } from '../enums/payment-status.enum'
import { PaymentMethod } from '../enums/payment-method.enum'

export class Payment {
  public readonly id: string
  public readonly createdAt: Date
  private status: PaymentStatus

  constructor(
    public readonly orderId: string,
    public readonly method: PaymentMethod,
    public readonly amount: number,
    status: PaymentStatus = PaymentStatus.PENDING,
    id?: string,
    createdAt?: Date
  ) {
    if (!orderId) throw new Error('orderId is required')
    if (amount <= 0) throw new Error('amount must be greater than 0')

    this.id = id ?? uuidv4()
    this.createdAt = createdAt ?? new Date()
    this.status = status
  }

  getStatus(): PaymentStatus {
    return this.status
  }

  approve(): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be approved')
    }
    this.status = PaymentStatus.APPROVED
  }

  reject(): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be rejected')
    }
    this.status = PaymentStatus.REJECTED
  }

  cancel(): void {
    if (this.status === PaymentStatus.APPROVED) {
      throw new Error('Cannot cancel an approved payment')
    }
    this.status = PaymentStatus.CANCELLED
  }
}
