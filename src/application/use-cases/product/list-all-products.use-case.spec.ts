import { Product } from "../../domain/entities/product.entity"
import { ProductRepository } from "../../domain/repositories/product.repository"
import { ImageUrl } from "../../domain/value-objects/image-url.vo"
import { Price } from "../../domain/value-objects/price.vo"
import { ListAllProductsUseCase } from "./list-all-products.use-case"

describe('ListAllProductsUseCase', () => {
  const mockProduct1 = new Product(
    'Coxinha',
    'Deliciosa coxinha de frango',
    new Price(5),
    new ImageUrl('https://cdn.exemplo.com/coxinha.png'),
    'salgado'
  )
  const mockProduct2 = new Product(
    'Suco de Laranja',
    'Suco natural de laranja',
    new Price(8),
    new ImageUrl('https://cdn.exemplo.com/suco.png'),
    'bebida'
  )

  const mockRepository: ProductRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  it('should return all products', async () => {
    (mockRepository.findAll as jest.Mock).mockResolvedValue([mockProduct1, mockProduct2])

    const useCase = new ListAllProductsUseCase(mockRepository)
    const result = await useCase.execute()

    expect(result).toEqual([mockProduct1, mockProduct2])
    expect(mockRepository.findAll).toHaveBeenCalled()
  })

  it('should return an empty array if no products found', async () => {
    (mockRepository.findAll as jest.Mock).mockResolvedValue([])

    const useCase = new ListAllProductsUseCase(mockRepository)
    const result = await useCase.execute()

    expect(result).toEqual([])
    expect(mockRepository.findAll).toHaveBeenCalled()
  })
})
