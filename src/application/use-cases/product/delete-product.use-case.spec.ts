import { DeleteProductUseCase } from './delete-product.use-case'
import { ProductRepository } from '../../domain/repositories/product.repository'
import { Product } from '../../domain/entities/product.entity'
import { Price } from '../../domain/value-objects/price.vo'
import { ImageUrl } from '../../domain/value-objects/image-url.vo'

describe('DeleteProductUseCase', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete a product if it exists', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(mockProduct)

    const useCase = new DeleteProductUseCase(mockRepository)

    await useCase.execute(mockProduct.id)

    expect(mockRepository.findById).toHaveBeenCalledWith(mockProduct.id)
    expect(mockRepository.delete).toHaveBeenCalledWith(mockProduct.id)
  })

  it('should throw error if product not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null)

    const useCase = new DeleteProductUseCase(mockRepository)

    await expect(useCase.execute('unknown')).rejects.toThrow('Product not found')
    expect(mockRepository.findById).toHaveBeenCalledWith('unknown')
    expect(mockRepository.delete).not.toHaveBeenCalled()
  })
})
