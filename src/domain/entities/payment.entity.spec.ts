import { PaymentMethod } from "../enums/payment-method.enum"
import { PaymentStatus } from "../enums/payment-status.enum"
import { Payment } from "./payment.entity"

describe('Payment Entity', () => {
  it('should create a payment with default status as pending', () => {
    const payment = new Payment('order-123', PaymentMethod.PIX, 25)

    expect(payment.id).toBeDefined()
    expect(payment.createdAt).toBeInstanceOf(Date)
    expect(payment.getStatus()).toBe(PaymentStatus.PENDING)
  })

  it('should approve a pending payment', () => {
    const payment = new Payment('order-123', PaymentMethod.CASH, 50)
    payment.approve()
    expect(payment.getStatus()).toBe(PaymentStatus.APPROVED)
  })

  it('should reject a pending payment', () => {
    const payment = new Payment('order-123', PaymentMethod.DEBIT_CARD, 100)
    payment.reject()
    expect(payment.getStatus()).toBe(PaymentStatus.REJECTED)
  })

  it('should cancel a pending payment', () => {
    const payment = new Payment('order-123', PaymentMethod.CREDIT_CARD, 60)
    payment.cancel()
    expect(payment.getStatus()).toBe(PaymentStatus.CANCELLED)
  })

  it('should throw if trying to cancel an approved payment', () => {
    const payment = new Payment('order-123', PaymentMethod.PIX, 80)
    payment.approve()

    expect(() => payment.cancel()).toThrow('Cannot cancel an approved payment')
  })

  it('should throw for invalid amount or missing orderId', () => {
    expect(() => new Payment('', PaymentMethod.CASH, 10)).toThrow()
    expect(() => new Payment('order-1', PaymentMethod.CASH, 0)).toThrow()
  })
})
