import { DeleteCategoryUseCase } from '../../../../../src/application/use-cases/category/delete-category.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('DeleteCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: DeleteCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new DeleteCategoryUseCase(categoryRepository)
  })

  it('should delete a category if it exists', async () => {
    const category = new Category('Pizzas', 'Categoria Pizzas', true, 'cat-1')
    categoryRepository.findById = jest.fn().mockResolvedValue(category)

    await useCase.execute('cat-1')

    expect(categoryRepository.delete).toHaveBeenCalledWith('cat-1')
  })

  it('should throw if category does not exist', async () => {
    categoryRepository.findById = jest.fn().mockResolvedValue(null)

    await expect(useCase.execute('not-found')).rejects.toThrow('Category not found')
  })
})
