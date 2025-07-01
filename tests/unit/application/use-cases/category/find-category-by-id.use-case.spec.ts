import { FindCategoryByIdUseCase } from '../../../../../src/application/use-cases/category/find-category-by-id.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('FindCategoryByIdUseCase', () => {
  let useCase: FindCategoryByIdUseCase
  let categoryRepository: CategoryRepository

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new FindCategoryByIdUseCase(categoryRepository)
  })

  it('should return a category by id', async() => {
    const category = new Category('Doces', 'Categoria de doces', true, 'cat-1');

    (categoryRepository.findById as jest.Mock).mockResolvedValue(category)

    const useCase = new FindCategoryByIdUseCase(categoryRepository)
    const result = await useCase.execute('cat-1')

    expect(result).toBeDefined()
    expect(result?.id).toBe('cat-1')
    expect(result?.name).toBe('Doces')
    expect(categoryRepository.findById).toHaveBeenCalledWith('cat-1')
  })

  it('should throw an error if category is not found', async () => {
    (categoryRepository.findById as jest.Mock).mockResolvedValue(null)

    const useCase = new FindCategoryByIdUseCase(categoryRepository)

    await expect(useCase.execute('unknown')).rejects.toThrow('Category not found')
  })
})
