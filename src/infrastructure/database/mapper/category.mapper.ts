import { Category as PrismaCategory } from "@prisma/client";
import { Category } from "../../../domain/entities/category.entity";

export class CategoryMapper {
  static toDomain(prismaCategory: PrismaCategory): Category {
    return new Category(
      prismaCategory.name,
      prismaCategory.description,
      prismaCategory.isActive,
      prismaCategory.id,
      prismaCategory.createdAt
    )
  }

  static toPrisma(category: Category): PrismaCategory {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt
    }
  }
}
