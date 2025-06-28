import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Customer as PrismaCustomer,
  Product as PrismaProduct,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client';

import { Customer } from '../../../domain/entities/customer.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { Order } from '../../../domain/entities/order.entity';
import { Document } from '../../../domain/value-objects/document.vo';
import { Address } from '../../../domain/value-objects/address.vo';
import { OrderStatus } from '../../../domain/enums/order-status.enum';

type PrismaOrderWithDetails = PrismaOrder & {
  customer: PrismaCustomer,
  items: (PrismaOrderItem & {
    product: PrismaProduct & {
      customizations: {
        name: string,
        extraCost: number
      }[]
    }
  })[]
}

export class OrderMapper {
 static toPrismaStatus(status: OrderStatus): PrismaOrderStatus {
  return status.toUpperCase() as PrismaOrderStatus
 }

  static toDomain(order: PrismaOrderWithDetails): Order {
    const customer = new Customer(
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      new Document(order.customer.document),
      new Address(
        order.customer.addressStreet,
        order.customer.addressNumber,
        order.customer.addressCity,
        order.customer.addressState,
        order.customer.addressZipCode
      ),
      order.customer.id,
      order.customer.createdAt
    )

    const items = order.items.map((item) => {
      const product = {
        ...item.product,
        price: { getValue: () => item.product.price },
        totalWithCustomization: (customs: string[]) => {
          const base = item.product.price
          const extras = item.product.customizations
            .filter((c) => customs.includes(c.name))
            .reduce((acc, c) => acc + c.extraCost, 0)
          return base + extras
        }
      } as any

      return new OrderItem(product, item.quantity, JSON.parse(item.customizations))
    })

    return new Order(customer, items, order.status as any, order.id, order.createdAt)
  }
}
