import { ProductRepository } from '../../domain/repositories/product.repository'
import { Price } from '../../domain/value-objects/price.vo'
import { ImageUrl } from '../../domain/value-objects/image-url.vo'
import { Product } from '../../domain/entities/product.entity'

export interface UpdateProductInput {
  id: string
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  category?: string
  customizations?: { name: string; extraCost: number }[]
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: UpdateProductInput): Promise<Product> {
    const existingProduct = await this.productRepository.findById(input.id)

    if (!existingProduct) {
      throw new Error('Product not found')
    }

    if (input.name) {
      existingProduct.name = input.name
    }

    if (input.description) {
      existingProduct.description = input.description
    }

    if (input.price !== undefined) {
      existingProduct.price = new Price(input.price)
    }

    if (input.imageUrl) {
      existingProduct.imageUrl = new ImageUrl(input.imageUrl)
    }

    if (input.category) {
      existingProduct.category = input.category
    }

    if (input.customizations) {
      existingProduct.customizations = input.customizations.map(c => ({
        name: c.name,
        extraCost: new Price(c.extraCost),
      }))
    }

    const updatedProduct = await this.productRepository.update(existingProduct)
    return updatedProduct
  }
}
