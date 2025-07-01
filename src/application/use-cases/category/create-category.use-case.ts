import { Category } from "../../../domain/entities/category.entity"
import { CategoryRepository } from "../../../domain/repositories/category.repository"

type CreateCategoryInput = {
  name: string
  description: string
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository){}

  async execute(input: CreateCategoryInput): Promise<void> {
    const { name, description } = input
    const category = new Category(name, description)

    await this.categoryRepository.create(category)
  }
}
