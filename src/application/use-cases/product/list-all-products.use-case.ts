import { Product } from "../../../domain/entities/product.entity"
import { ProductRepository } from "../../../domain/repositories/product.repository"


export class ListAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    const products = await this.productRepository.findAll()
    return products
  }
}
