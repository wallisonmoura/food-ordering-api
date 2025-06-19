import { ImageUrl } from "../value-objects/image-url.vo"
import { Price } from "../value-objects/price.vo"
import { OrderItem } from "./order-item.entity"
import { Product } from "./product.entity"

describe('OrderItem Entity', () => {
  const baseProduct = new Product(
    'Pizza Calabresa',
    'Molho, queijo, calabresa',
    new Price(40),
    new ImageUrl('https://img.com/pizza.jpg'),
    'pizza',
    [
      { name: 'Borda recheada', extraCost: new Price(5) },
      { name: 'Queijo extra', extraCost: new Price(4) }
    ]
  )

  it('should create an order item and calculate total', () => {
    const item = new OrderItem(baseProduct, 2, ['Borda recheada'])
    expect(item.getTotal()).toBe((40 + 5) * 2)
  })

  it('should return selected customization details', () => {
    const item = new OrderItem(baseProduct, 1, ['Queijo extra'])
    const selected = item.getCustomizations()
    expect(selected).toHaveLength(1)
    expect(selected[0].name).toBe('Queijo extra')
  })

  it('should throw error with zero quantity', () => {
    expect(() => {
      new OrderItem(baseProduct, 0)
    }).toThrow('Quantity must be greater than 0')
  })

  it('should throw error if product is missing', () => {
    expect(() => {
      new OrderItem(undefined as any, 1)
    }).toThrow('Product is required')
  })
})
