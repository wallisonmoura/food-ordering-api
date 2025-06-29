import { PrismaClient } from "@prisma/client"

import { PaymentRepositoryPrisma } from '../../../../../../src/infrastructure/database/repositories/prisma/payment.repository';
import { Customer } from "../../../../../../src/domain/entities/customer.entity";
import { Document } from "../../../../../../src/domain/value-objects/document.vo";
import { Address } from "../../../../../../src/domain/value-objects/address.vo";
import { Product } from "../../../../../../src/domain/entities/product.entity";
import { Price } from "../../../../../../src/domain/value-objects/price.vo";
import { ImageUrl } from "../../../../../../src/domain/value-objects/image-url.vo";
import { OrderItem } from "../../../../../../src/domain/entities/order-item.entity";
import { Order } from "../../../../../../src/domain/entities/order.entity";
import { Payment } from "../../../../../../src/domain/entities/payment.entity";
import { PaymentMethod } from "../../../../../../src/domain/enums/payment-method.enum";
import { PaymentStatus } from "../../../../../../src/domain/enums/payment-status.enum";

describe('PaymentRepositoryPrisma', () => {
  let prisma: PrismaClient
  let repository: PaymentRepositoryPrisma

  beforeAll(() => {
    prisma = new PrismaClient()
    repository = new PaymentRepositoryPrisma(prisma)
  })

  afterEach(async () => {
    await prisma.payment.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.customization.deleteMany()
    await prisma.product.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.category.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  async function createOrderAndReturnId(): Promise<string> {
    const customer = await prisma.customer.create({
      data: {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        phone: '11999999999',
        document: '12345678901',
        addressStreet: 'Rua A',
        addressNumber: '123',
        addressCity: 'São Paulo',
        addressState: 'SP',
        addressZipCode: '01000-000'
      }
    })

    const category = await prisma.category.create({
      data: {
        name: 'Lanches',
        description: 'Categoria de teste'
      }
    })

    const product = await prisma.product.create({
      data: {
        name: 'X-Burger',
        description: 'Hambúrguer artesanal',
        price: 30,
        imageUrl: 'https://example.com/image.jpg',
        categoryId: category.id,
        customizations: {
          create: [
            { name: 'Bacon', extraCost: 3 }
          ]
        }
      },
      include: {
        customizations: true
      }
    })

    const domainCustomer = new Customer(
      customer.name,
      customer.email,
      customer.phone,
      new Document(customer.document),
      new Address(
        customer.addressStreet,
        customer.addressNumber,
        customer.addressCity,
        customer.addressState,
        customer.addressZipCode
      ),
      customer.id,
      customer.createdAt
    )

    const domainProduct = new Product(
      product.name,
      product.description,
      new Price(product.price),
      new ImageUrl(product.imageUrl),
      product.categoryId,
      product.customizations.map(c => ({
        name: c.name,
        extraCost: new Price(c.extraCost)
      })),
      product.id
    )

    const item = new OrderItem(domainProduct, 1, ['Bacon'])
    const order = new Order(domainCustomer, [item])

    await prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customer.id,
        status: order.getStatus() as any,
        createdAt: order.createdAt,
        items: {
          create: order.getItems().map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            customizations: JSON.stringify(i.selectedCustomizations)
          }))
        }
      }
    })

    return order.id
  }

  it('should create and find a payment by ID', async () => {
    const orderId = await createOrderAndReturnId()
    const payment = new Payment(
      orderId,
      PaymentMethod.PIX,
      33,
      PaymentStatus.PENDING,
    )

    await repository.create(payment)

    const found = await repository.findById(payment.id)
    expect(found).not.toBeNull()
    expect(found?.id).toBe(payment.id)
    expect(found?.orderId).toBe(orderId)
    expect(found?.method).toBe(PaymentMethod.PIX)
  })

  it('should list all payments', async () => {
    const orderId = await createOrderAndReturnId()
    const payment = new Payment(
      orderId,
      PaymentMethod.CREDIT_CARD,
      50,
      PaymentStatus.APPROVED,
    )

    await repository.create(payment)

    const result = await repository.findAll()
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(p => p.id === payment.id)).toBe(true)
  })

  it('should update a payment status and method', async () => {
    const orderId = await createOrderAndReturnId()
    const payment = new Payment(
      orderId,
      PaymentMethod.CASH,
      20,
      PaymentStatus.PENDING,
    )

    await repository.create(payment)

    payment.status = PaymentStatus.APPROVED
    payment.method = PaymentMethod.DEBIT_CARD

    await repository.update(payment)

    const updated = await repository.findById(payment.id)

    expect(updated?.status).toBe(PaymentStatus.APPROVED)
    expect(updated?.method).toBe(PaymentMethod.DEBIT_CARD)
  })
})
