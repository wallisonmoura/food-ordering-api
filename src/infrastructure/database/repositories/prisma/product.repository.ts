import { PrismaClient } from '@prisma/client';

import { Product } from '../../../../domain/entities/product.entity';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { ProductMapper } from '../../mapper/product.mapper';

export class ProductRepositoryPrisma implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<void> {
    const data = ProductMapper.toPrisma(product)
    await this.prisma.product.create({ data })
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        customizations: true
      }
    })

    if(!product) return null

    return ProductMapper.toDomain(product)
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        customizations: true
      }
    })

    return products.map(ProductMapper.toDomain)
  }

  async update(product: Product): Promise<Product> {
   // Estratégia simples: deletar todas as customizações e recriar
    await this.prisma.customization.deleteMany({
      where: { productId: product.id }
    })

    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: ProductMapper.toPrisma(product),
      include: {
        customizations: true
      }
    })

    return ProductMapper.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id }
    })
  }

}
