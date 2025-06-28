import { PrismaClient } from "@prisma/client"

import { ProductRepositoryPrisma } from '../../../../../../src/infrastructure/database/repositories/prisma/product.repository';
import { Customization, Product } from "../../../../../../src/domain/entities/product.entity";
import { Price } from "../../../../../../src/domain/value-objects/price.vo";
import { ImageUrl } from "../../../../../../src/domain/value-objects/image-url.vo";

describe('ProductRepositoryPrisma', () => {
  let prisma: PrismaClient
  let repository: ProductRepositoryPrisma

  beforeAll(() => {
    prisma = new PrismaClient()
    repository = new ProductRepositoryPrisma(prisma)
  })

  afterEach(async () => {
    await prisma.customization.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  async function createCategory() {
    return prisma.category.create({
      data: {
        name: 'Lanches',
        description: 'Categoria para teste'
      }
    })
  }

  function makeProduct(categoryId: string, customizations: Customization[] = []): Product {
    return new Product(
      'Hambúrguer',
      'Delicioso hambúrguer artesanal',
      new Price(25),
      new ImageUrl('https://example.com/image.jpg'),
      categoryId,
      customizations
    )
  }

  it('should create and find a product by ID', async () => {
    const category = await createCategory()

    const product = makeProduct(category.id, [
      { name: 'Bacon', extraCost: new Price(3) },
      { name: 'Queijo', extraCost: new Price(2.5) }
    ])

    await repository.create(product)

    const found = await repository.findById(product.id)

    expect(found).not.toBeNull()
    expect(found?.id).toBe(product.id)
    expect(found?.customizations.length).toBe(2)
    expect(found?.customizations[0].name).toBe('Bacon')
  })

   it('should list all products', async () => {
    const category = await createCategory()

    const product = makeProduct(category.id)
    await repository.create(product)

    const result = await repository.findAll()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should update a product and its customizations', async () => {
    const category = await createCategory()

    const product = makeProduct(category.id, [
      { name: 'Bacon', extraCost: new Price(3) }
    ])

    await repository.create(product)

    product.name = 'X-Burger Atualizado'
    product.customizations = [
      { name: 'Cheddar', extraCost: new Price(2) }
    ]

    const updated = await repository.update(product)

    expect(updated.name).toBe('X-Burger Atualizado')
    expect(updated.customizations.length).toBe(1)
    expect(updated.customizations[0].name).toBe('Cheddar')
  })

  it('should delete a product', async () => {
    const category = await createCategory()

    const product = makeProduct(category.id)
    await repository.create(product)

    await repository.delete(product.id)

    const result = await repository.findById(product.id)
    expect(result).toBeNull()
  })
})
