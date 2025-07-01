import { CategoryRepository } from "../../../domain/repositories/category.repository"

type UpdateCategoryInput = {
  id: string
  name: string
  description: string
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<void>{
    const category = await this.categoryRepository.findById(input.id)

    if (!category) {
      throw new Error('Category not found')
    }

    category.name = input.name
    category.description = input.description

    await this.categoryRepository.update(category)
  }
}
