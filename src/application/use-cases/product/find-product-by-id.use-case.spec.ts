import { Product } from "../../../domain/entities/product.entity"
import { ProductRepository } from "../../../domain/repositories/product.repository"
import { ImageUrl } from "../../../domain/value-objects/image-url.vo"
import { Price } from "../../../domain/value-objects/price.vo"
import { FindProductByIdUseCase } from "./find-product-by-id.use-case"

describe('FindProductByIdUseCase', () => {
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

  it('should return a product if found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(mockProduct)

    const useCase = new FindProductByIdUseCase(mockRepository)
    const result = await useCase.execute(mockProduct.id)

    expect(result).toEqual(mockProduct)
    expect(mockRepository.findById).toHaveBeenCalledWith(mockProduct.id)
  })

  it('should throw an error if product is not found', async () => {
    (mockRepository.findById as jest.Mock).mockResolvedValue(null)

    const useCase = new FindProductByIdUseCase(mockRepository)

    await expect(useCase.execute('unknown')).rejects.toThrow('Product not found')
  })
})
