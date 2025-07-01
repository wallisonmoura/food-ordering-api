import { ListCategoriesUseCase } from '../../../../../src/application/use-cases/category/list-categories.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('ListCategoriesUseCase', () => {
  let useCase: ListCategoriesUseCase
  let categoryRepository: CategoryRepository

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new ListCategoriesUseCase(categoryRepository)
  })

  it('should return all categories from repository', async() => {
    const categories = [
      new Category('Lanches', 'Categoria de lanches'),
      new Category('Bebidas', 'Categoria de bebidas')
    ];

    (categoryRepository.findAll as jest.Mock).mockResolvedValue(categories)

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Lanches')
    expect(result[1].name).toBe('Bebidas')
    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
