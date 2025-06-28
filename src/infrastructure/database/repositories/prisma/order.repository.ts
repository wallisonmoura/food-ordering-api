import { PrismaClient } from "@prisma/client";
import { OrderRepository } from "../../../../domain/repositories/order.repository";
import { Order } from "../../../../domain/entities/order.entity";
import { OrderMapper } from "../../mapper/order.mapper";

export class OrderRepositoryPrisma implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customer.id,
        status: OrderMapper.toPrismaStatus(order.getStatus()),
        createdAt: order.createdAt,
        items: {
          create: order.getItems().map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            customizations: JSON.stringify(item.selectedCustomizations)
          }))
        }
      }
    })
  }

  async findById(id: string): Promise<Order | null> {
   const data = await this.prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              customizations: true
            }
          }
        }
      }
    }
   })

   if(!data) return null

   return OrderMapper.toDomain(data)
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                customizations: true
              }
            }
          }
        }
      }
    })

    return orders.map(OrderMapper.toDomain)
  }

  async update(order: Order): Promise<void> {
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderMapper.toPrismaStatus(order.getStatus())
      }
    })
  }
  async delete(id: string): Promise<void> {
   await this.prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED'
      }
    })
  }
}
