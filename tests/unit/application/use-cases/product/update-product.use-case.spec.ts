import { UpdateProductUseCase, UpdateProductInput } from '../../../../../src/application/use-cases/product/update-product.use-case'
import { Product } from '../../../../../src/domain/entities/product.entity'
import { ProductRepository } from '../../../../../src/domain/repositories/product.repository'
import { ImageUrl } from '../../../../../src/domain/value-objects/image-url.vo'
import { Price } from '../../../../../src/domain/value-objects/price.vo'

describe('UpdateProductUseCase', () => {
  const mockProduct = new Product(
    'Coxinha',
    'Deliciosa coxinha de frango',
    new Price(5),
    new ImageUrl('https://cdn.exemplo.com/coxinha.png'),
    'salgado'
  )
  const mockRepository: ProductRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  it('should update an existing product', async () => {
  (mockRepository.findById as jest.Mock).mockResolvedValue(mockProduct)

  mockRepository.update = jest.fn().mockImplementation(product => product)

  const useCase = new UpdateProductUseCase(mockRepository)

  const input: UpdateProductInput = {
    id: mockProduct.id,
    name: 'Coxinha de Frango',
    price: 6,
  }

  const result = await useCase.execute(input)

  expect(result.name).toBe('Coxinha de Frango')
  expect(result.price.getValue()).toBe(6)
  expect(mockRepository.findById).toHaveBeenCalledWith(mockProduct.id)
  expect(mockRepository.update).toHaveBeenCalled()
})


  it('should throw error if product is not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null)

    const useCase = new UpdateProductUseCase(mockRepository)

    await expect(
      useCase.execute({ id: 'unknown' } as any)
    ).rejects.toThrow('Product not found')
  })
})
