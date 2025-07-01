import { ActivateCategoryUseCase } from '../../../../../src/application/use-cases/category/activate-category.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('ActivateCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: ActivateCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new ActivateCategoryUseCase(categoryRepository)
  })

  it('should activate a category', async() => {
    const category = new Category('Bebidas', 'descrição', false, 'cat-1')
    categoryRepository.findById = jest.fn().mockResolvedValue(category)

    await useCase.execute('cat-1')
    expect(category.isActive).toBe(true)
    expect(categoryRepository.update).toHaveBeenCalledWith(category)
  })

  it('should throw if category does not exist', async () => {
    categoryRepository.findById = jest.fn().mockResolvedValue(null)

    await expect(useCase.execute('invalid')).rejects.toThrow('Category not found')
  })
})
