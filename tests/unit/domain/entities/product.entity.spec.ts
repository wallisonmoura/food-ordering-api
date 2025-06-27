import { Product } from "../../../../src/domain/entities/product.entity"
import { ImageUrl } from "../../../../src/domain/value-objects/image-url.vo"
import { Price } from "../../../../src/domain/value-objects/price.vo"

describe('Product Entity', () => {
  it('should create a product with valid data', () => {
    const product = new Product(
      'X-Burguer',
      'Pão, carne e queijo',
      new Price(20),
      new ImageUrl('https://example.com/image.jpg'),
      'burger',
    )

    expect(product.id).toBeDefined()
    expect(product.name).toBe('X-Burguer')
    expect(product.price.getValue()).toBe(20)
  })

  it('should calculate total with selected customizations', () => {
    const product = new Product(
      'Pizza',
      'Pizza calabresa',
      new Price(30),
      new ImageUrl('https://example.com/pizza.png'),
      'pizza',
      [
        { name: 'Queijo extra', extraCost: new Price(5) },
        { name: 'Borda recheada', extraCost: new Price(7) },
      ]
    )

    const total = product.totalWithCustomization(['Queijo extra'])
    expect(total).toBe(35)
  })

  it('should throw error with invalid image URL', () => {
    expect(() => {
      new ImageUrl('invalid-url')
    }).toThrow('Invalid image URL')
  })

  it('should throw error if price is negative', () => {
    expect(() => {
      new Price(-10)
    }).toThrow('Price must be non-negative')
  })
})
