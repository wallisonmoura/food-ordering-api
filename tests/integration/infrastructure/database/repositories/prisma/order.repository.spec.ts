import { PrismaClient } from "@prisma/client"

import { OrderRepositoryPrisma } from '../../../../../../src/infrastructure/database/repositories/prisma/order.repository';
import { Customer } from "../../../../../../src/domain/entities/customer.entity";
import { Document } from "../../../../../../src/domain/value-objects/document.vo";
import { Address } from "../../../../../../src/domain/value-objects/address.vo";
import { Price } from "../../../../../../src/domain/value-objects/price.vo";
import { ImageUrl } from "../../../../../../src/domain/value-objects/image-url.vo";
import { Product } from "../../../../../../src/domain/entities/product.entity";
import { OrderItem } from "../../../../../../src/domain/entities/order-item.entity";
import { Order } from "../../../../../../src/domain/entities/order.entity";
import { OrderStatus } from "../../../../../../src/domain/enums/order-status.enum";

describe('OrderRepositoryPrisma', () => {
  let prisma: PrismaClient
  let repository: OrderRepositoryPrisma

  beforeAll(() => {
    prisma = new PrismaClient()
    repository = new OrderRepositoryPrisma(prisma)
  })

  afterEach(async () => {
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

  async function createOrderAndPersist(): Promise<Order> {
    const customer = await prisma.customer.create({
      data: {
        id: 'cust-1',
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
        description: 'Categoria teste'
      }
    })

    const product = await prisma.product.create({
      data: {
        id: 'prod-1',
        name: 'Hambúrguer',
        description: 'Delicioso',
        price: 25,
        imageUrl: 'https://example.com/image.jpg',
        categoryId: category.id,
        customizations: {
          create: [
            { name: 'Bacon', extraCost: 3 },
            { name: 'Queijo', extraCost: 2 }
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
      new Address(customer.addressStreet, customer.addressNumber, customer.addressCity, customer.addressState, customer.addressZipCode),
      customer.id,
      customer.createdAt
    )

    const domainProduct = new Product(
      product.name,
      product.description,
      new Price(product.price),
      new ImageUrl(product.imageUrl),
      product.categoryId,
      product.customizations.map((c) => ({
        name: c.name,
        extraCost: new Price(c.extraCost)
      })),
      product.id
    )

    const item = new OrderItem(domainProduct, 2, ['Bacon'])
    const order = new Order(domainCustomer, [item])

    await repository.create(order)

    return order
  }

  it('should create and retrieve an order by ID', async () => {
    const order = await createOrderAndPersist()

    const result = await repository.findById(order.id)

    expect(result).not.toBeNull()
    expect(result?.id).toBe(order.id)
    expect(result?.getItems().length).toBe(1)
    expect(result?.getItems()[0].getTotal()).toBe(56) // (25 + 3) * 2
    expect(result?.getStatus()).toBe(OrderStatus.PENDING)
  })

  it('should list all orders', async () => {
    const order = await createOrderAndPersist()

    const orders = await repository.findAll()
    expect(orders.some(o => o.id === order.id)).toBe(true)
  })

  it('should update order status', async () => {
    const order = await createOrderAndPersist()

    order.updateStatus(OrderStatus.PAID)
    await repository.update(order)

    const updated = await repository.findById(order.id)
    expect(updated?.getStatus()).toBe(OrderStatus.PAID)
  })

  it('should cancel an order', async () => {
    const order = await createOrderAndPersist()

    await repository.delete(order.id)

    const cancelled = await repository.findById(order.id)
    expect(cancelled?.getStatus()).toBe(OrderStatus.CANCELLED)
  })
})
