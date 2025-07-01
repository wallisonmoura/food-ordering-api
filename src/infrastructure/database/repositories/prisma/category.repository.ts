import { PrismaClient } from "@prisma/client";
import { CategoryRepository } from "../../../../domain/repositories/category.repository";
import { Category } from "../../../../domain/entities/category.entity";
import { CategoryMapper } from "../../mapper/category.mapper";

export class CategoryRepositoryPrisma implements CategoryRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(category: Category): Promise<void> {
    const data = CategoryMapper.toPrisma(category)
    await this.prisma.category.create({ data })
  }

  async findById(id: string): Promise<Category | null> {
    const data = await this.prisma.category.findUnique({
      where: { id }
    })

    return data ? CategoryMapper.toDomain(data) : null
  }

  async findAll(): Promise<Category[]> {
    const data = await this.prisma.category.findMany()
    return data.map(CategoryMapper.toDomain)
  }


  async update(category: Category): Promise<void> {
    const data = CategoryMapper.toPrisma(category)
    await this.prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } })
  }
}
