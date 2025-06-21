import { ProductRepository } from "../../../domain/repositories/product.repository"
import { CreateProductUseCase } from "./create-product.use-case"


describe('CreateProductUseCase', () => {
  it('should create a product and call repository', async () => {
    const mockRepo: ProductRepository = {
      create: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const useCase = new CreateProductUseCase(mockRepo)

    const input = {
      name: 'Milkshake',
      description: 'Chocolate',
      price: 18,
      imageUrl: 'https://example.com/milkshake.jpg',
      category: 'drink',
      customizations: [{ name: 'Granulado', extraCost: 2 }],
    }

    await useCase.execute(input)

    expect(mockRepo.create).toHaveBeenCalledTimes(1)
    const productCreated = (mockRepo.create as jest.Mock).mock.calls[0][0]

    expect(productCreated.name).toBe('Milkshake')
    expect(productCreated.price.getValue()).toBe(18)
    expect(productCreated.customizations).toHaveLength(1)
  })
})
