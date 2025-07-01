import { Category } from "../entities/category.entity"


export interface CategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  create(category: Category): Promise<void>
  update(category: Category): Promise<void>
  delete(id: string): Promise<void>
}
