import { OrderStatus } from "../enums/order-status.enum"
import { Address } from "../value-objects/address.vo"
import { Document } from "../value-objects/document.vo"
import { ImageUrl } from "../value-objects/image-url.vo"
import { Price } from "../value-objects/price.vo"
import { Customer } from "./customer.entity"
import { OrderItem } from "./order-item.entity"
import { Order } from "./order.entity"
import { Product } from "./product.entity"

describe('Order Entity', () => {
  const product = new Product(
    'Salgado',
    'Coxinha de frango',
    new Price(8),
    new ImageUrl('https://cdn.com/coxinha.jpg'),
    'salgado',
    [{ name: 'Queijo', extraCost: new Price(2) }]
  )

  const address = new Address('Rua X', '123', 'Olinda', 'PE', '53110-000')
  const document = new Document('12345678901')
  const customer = new Customer('Fulano', 'fulano@email.com', '81999999999', document, address)

  const item = new OrderItem(product, 2, ['Queijo'])

  it('should create an order and calculate total', () => {
    const order = new Order(customer, [item])
    expect(order.getItems()).toHaveLength(1)
    expect(order.getTotal()).toBe((8 + 2) * 2)
    expect(order.getStatus()).toBe(OrderStatus.PENDING)
  })

  it('should allow adding and removing items', () => {
    const order = new Order(customer)
    order.addItem(item)
    expect(order.getItems()).toHaveLength(1)

    order.removeItem(0)
    expect(order.getItems()).toHaveLength(0)
  })

  it('should allow updating status unless cancelled', () => {
    const order = new Order(customer)
    order.updateStatus(OrderStatus.PAID)
    expect(order.getStatus()).toBe(OrderStatus.PAID)
  })

  it('should not allow status update if cancelled', () => {
    const order = new Order(customer)
    order.updateStatus(OrderStatus.CANCELLED)

    expect(() => {
      order.updateStatus(OrderStatus.PAID)
    }).toThrow('Cannot update a cancelled order')
  })
})
