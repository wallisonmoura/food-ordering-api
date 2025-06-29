import { PrismaClient } from "@prisma/client";
import { PaymentRepository } from "../../../../domain/repositories/payment.repository";
import { Payment } from "../../../../domain/entities/payment.entity";
import { PaymentMapper } from "../../mapper/payment.mapper";

export class PaymentRepositoryPrisma implements PaymentRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(payment: Payment): Promise<void> {
    const data = PaymentMapper.toPrismaCreate(payment)
    await this.prisma.payment.create({ data })
  }

  async findById(id: string): Promise<Payment | null> {
    const data = await this.prisma.payment.findUnique({
      where: { id }
    })

    if (!data) return null

    return PaymentMapper.toDomain(data)
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany()
    return payments.map(PaymentMapper.toDomain)
  }

  async update(payment: Payment): Promise<void> {
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        method: payment.method as unknown as any,
        status: payment.status as unknown as any,
        amount: payment.amount
      }
    })
  }
}
