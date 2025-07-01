import { DeactivateCategoryUseCase } from '../../../../../src/application/use-cases/category/deactivate-category.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('DeactivateCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: DeactivateCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new DeactivateCategoryUseCase(categoryRepository)
  })

  it('should deactivate a category', async() => {
    const category = new Category('Doces', 'descrição', true, 'cat-1')
    categoryRepository.findById = jest.fn().mockResolvedValue(category)

    await useCase.execute('cat-1')

    expect(category.isActive).toBe(false)
    expect(categoryRepository.update).toHaveBeenCalledWith(category)
  })

  it('should throw if category does not exist', async () => {
    categoryRepository.findById = jest.fn().mockResolvedValue(null)

    await expect(useCase.execute('invalid')).rejects.toThrow('Category not found')
  })
})
