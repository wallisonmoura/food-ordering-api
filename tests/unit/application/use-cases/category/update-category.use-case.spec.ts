import { UpdateCategoryUseCase } from '../../../../../src/application/use-cases/category/update-category.use-case'
import { Category } from '../../../../../src/domain/entities/category.entity'
import { CategoryRepository } from '../../../../../src/domain/repositories/category.repository'

describe('UpdateCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: UpdateCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    useCase = new UpdateCategoryUseCase(categoryRepository)
  })

  it('should update a category when it exists', async() => {
    const category = new Category('Antigo', 'Descrição antiga', true, 'cat-1');

    (categoryRepository.findById as jest.Mock).mockResolvedValue(category)

    const input = {
      id: 'cat-1',
      name: 'Atualizado',
      description: 'Nova descrição'
    }

    await useCase.execute(input)

    expect(category.name).toBe('Atualizado')
    expect(category.description).toBe('Nova descrição')
    expect(categoryRepository.update).toHaveBeenCalledWith(category)
  })

  it('should throw if category does not exist', async () => {
    (categoryRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(
      useCase.execute({
        id: 'not-found',
        name: 'Qualquer',
        description: 'Qualquer'
      })
    ).rejects.toThrow('Category not found')
  })
})
