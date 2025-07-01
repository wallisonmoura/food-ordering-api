import { Category } from "../../../domain/entities/category.entity";
import { CategoryRepository } from "../../../domain/repositories/category.repository";

type FindCategoryByIdInput = {
  id: string
}

export class FindCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Category | null> {
    const category = await this.categoryRepository.findById(categoryId)

    if(!category) {
      throw new Error('Category not found')
    }

    return category
  }
}
