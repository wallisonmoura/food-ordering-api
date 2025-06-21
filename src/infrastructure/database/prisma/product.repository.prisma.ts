import { Product } from "../../../domain/entities/product.entity";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { prisma } from "./prisma.service";

export class PrismaProductRepository implements ProductRepository {
  findAll(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  findById(productId: string): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  update(product: Product): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async create(product: Product): Promise<void> {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getValue(),
        imageUrl: product.imageUrl.getValue(),
        category: product.category,
        customizations: JSON.stringify(product.customizations),
      },
    })
  }
}
