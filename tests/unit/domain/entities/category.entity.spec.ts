import { Category } from "../../../../src/domain/entities/category.entity"

describe('Category Entity', () => {
  it('should create a category with valid data', () => {
    const category = new Category('Bebidas', 'Categoria de bebidas')

    expect(category.id).toBeDefined()
    expect(category.name).toBe('Bebidas')
    expect(category.description).toBe('Categoria de bebidas')
    expect(category.isActive).toBe(true)
    expect(category.createdAt).toBeInstanceOf(Date)
  })

  it('should deactivate and activate category', () => {
    const category = new Category('Doces', 'Categoria de doces')

    category.deactivate()
    expect(category.isActive).toBe(false)

    category.activate()
    expect(category.isActive).toBe(true)
  })

  it('should throw error when name is empty', () => {
    expect(() => {
      new Category('', 'desc')
    }).toThrow('Category name is required')
  })
})
