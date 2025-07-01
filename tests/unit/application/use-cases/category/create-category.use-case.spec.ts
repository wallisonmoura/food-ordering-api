import { CreateCategoryUseCase } from '../../../../../src/application/use-cases/category/create-category.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase
  let categoryRepository: CategoryRepository

   beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new CreateCategoryUseCase(categoryRepository)
  })

  it('should create a new category with valid data', async () => {
    const input = {
      name: 'Lanches',
      description: 'Categoria para lanches'
    }
    await useCase.execute(input)

    expect(categoryRepository.create).toHaveBeenCalledTimes(1)
    const categoryCreated = (categoryRepository.create as jest.Mock).mock.calls[0][0] as Category

    expect(categoryCreated.name).toBe(input.name)
    expect(categoryCreated.description).toBe(input.description)
    expect(categoryCreated.isActive).toBe(true)
    expect(categoryCreated.id).toBeDefined()
  })

  it('should throw if name is empty', async() => {
    const input = {
      name: '',
      description: 'Teste'
    }

    await expect(useCase.execute(input)).rejects.toThrow('Category name is required')
  })
})
