import { PrismaClient } from "@prisma/client"

import { CategoryRepositoryPrisma } from '../../../../../../src/infrastructure/database/repositories/prisma/category.repository';
import { Category } from "../../../../../../src/domain/entities/category.entity";

describe('CategoryRepositoryPrisma', () => {
  let prisma: PrismaClient
  let repository: CategoryRepositoryPrisma

  beforeAll(() => {
    prisma = new PrismaClient()
    repository = new CategoryRepositoryPrisma(prisma)
  })

  afterEach(async () => {
    await prisma.category.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create and retrieve a category by ID', async () => {
    const category = new Category('Lanches', 'Categoria para lanches')
    await repository.create(category)

    const found = await repository.findById(category.id)

    expect(found).not.toBeNull()
    expect(found?.id).toBe(category.id)
    expect(found?.name).toBe('Lanches')
  })

  it('should list all categories', async () => {
    const cat1 = new Category('Bebidas', 'Categoria de bebidas')
    const cat2 = new Category('Doces', 'Categoria de doces')

    await repository.create(cat1)
    await repository.create(cat2)

    const list = await repository.findAll()

    expect(list).toHaveLength(2)
    expect(list.map(c => c.name)).toContain('Bebidas')
    expect(list.map(c => c.name)).toContain('Doces')
  })

  it('should update a category', async () => {
    const category = new Category('Pizza', 'Saborosa')
    await repository.create(category)

    category.name = 'Pizza Gourmet'
    category.description = 'Atualizada'
    await repository.update(category)

    const updated = await repository.findById(category.id)

    expect(updated?.name).toBe('Pizza Gourmet')
    expect(updated?.description).toBe('Atualizada')
  })

  it('should activate and deactivate a category', async () => {
    const category = new Category('Sorvetes', 'Gelados', true)
    await repository.create(category)

    category.deactivate()
    await repository.update(category)

    const deactivated = await repository.findById(category.id)
    expect(deactivated?.isActive).toBe(false)

    category.activate()
    await repository.update(category)

    const activated = await repository.findById(category.id)
    expect(activated?.isActive).toBe(true)
  })

  it('should delete a category', async () => {
    const category = new Category('Apagar', 'Categoria')
    await repository.create(category)

    await repository.delete(category.id)

    const result = await repository.findById(category.id)
    expect(result).toBeNull()
  })
})
