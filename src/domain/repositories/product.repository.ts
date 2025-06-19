import { Product } from "../entities/product.entity";

export interface ProductRepository {
  create(product: Product): Promise<void>
}
