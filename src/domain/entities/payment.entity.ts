import { v4 as uuidv4 } from 'uuid'
import { PaymentStatus } from '../enums/payment-status.enum'
import { PaymentMethod } from '../enums/payment-method.enum'

export class Payment {
  public readonly id: string
  public readonly createdAt: Date
  private _status: PaymentStatus
  private _method: PaymentMethod
  public readonly orderId: string
  public readonly amount: number

  constructor(
    orderId: string,
    method: PaymentMethod,
    amount: number,
    status: PaymentStatus = PaymentStatus.PENDING,
    id?: string,
    createdAt?: Date
  ) {
    if (!orderId) throw new Error('orderId is required')
    if (amount <= 0) throw new Error('amount must be greater than 0')

    this.id = id ?? uuidv4()
    this.createdAt = createdAt ?? new Date()
    this.orderId = orderId
    this.amount = amount
    this._status = status
    this._method = method
  }

  get status(): PaymentStatus {
    return this._status
  }

  set status(status: PaymentStatus) {
    this._status = status
  }

  get method(): PaymentMethod {
    return this._method
  }

  set method(method: PaymentMethod) {
    this._method = method
  }

  approve(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be approved')
    }
    this._status = PaymentStatus.APPROVED
  }

  reject(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be rejected')
    }
    this._status = PaymentStatus.REJECTED
  }

  cancel(): void {
    if (this._status === PaymentStatus.APPROVED) {
      throw new Error('Cannot cancel an approved payment')
    }
    this._status = PaymentStatus.CANCELLED
  }
}
