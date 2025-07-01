import { CategoryRepository } from "../../../domain/repositories/category.repository";

export class ActivateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new Error('Category not found')
    }

    category.activate()
    await this.categoryRepository.update(category)
  }
}
