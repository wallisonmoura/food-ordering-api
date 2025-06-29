import {
  Payment as PrismaPayment,
  Order as PrismaOrder,
  PaymentMethod as PrismaPaymentMethod,
  PaymentStatus as PrismaPaymentStatus
} from '@prisma/client'
import { Payment } from '../../../domain/entities/payment.entity';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

export class PaymentMapper {
  static toDomain(payment: PrismaPayment & { order?: PrismaOrder }): Payment {
    return new Payment(
      payment.orderId,
      payment.method as PaymentMethod,
      payment.amount,
      payment.status as PaymentStatus,
      payment.id,
      payment.createdAt
    )
  }

  static toPrisma(payment: Payment): PrismaPayment {
    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method as unknown as PrismaPaymentMethod,
      amount: payment.amount,
      status: payment.status as unknown as PrismaPaymentStatus,
      createdAt: payment.createdAt
    }
  }

  static toPrismaCreate(payment: Payment): Omit<PrismaPayment, 'createdAt'> {
    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method as unknown as PrismaPaymentMethod,
      amount: payment.amount,
      status: payment.status as unknown as PrismaPaymentStatus,
    }
  }

}
