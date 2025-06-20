import { Product } from "../entities/product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>
  findById(productId: string): Promise<Product | null>
  create(product: Product): Promise<void>
  update(product: Product): Promise<Product>
  delete(id: string): Promise<void>
}
