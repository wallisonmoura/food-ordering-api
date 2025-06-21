import { Product } from "../../../domain/entities/product.entity"
import { ProductRepository } from "../../../domain/repositories/product.repository"
import { ImageUrl } from "../../../domain/value-objects/image-url.vo"
import { Price } from "../../../domain/value-objects/price.vo"


type CustomizationInput = {
  name: string
  extraCost: number
}

type Input = {
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  customizations?: CustomizationInput[]
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<void> {
    const { name, description, price, imageUrl, category, customizations = [] } = input

    const product = new Product(
      name,
      description,
      new Price(price),
      new ImageUrl(imageUrl),
      category,
      customizations.map(c => ({
        name: c.name,
        extraCost: new Price(c.extraCost),
      })),
    )

    await this.productRepository.create(product)
  }
}
