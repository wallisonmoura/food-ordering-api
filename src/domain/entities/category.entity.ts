import { v4 as uuidv4 } from 'uuid'

export class Category {
  public readonly id: string
  public readonly createdAt: Date

  constructor(
    public name: string,
    public description: string,
    public isActive: boolean = true,
    id?: string,
    createdAt?: Date
  ) {
    this.id = id ?? uuidv4()
    this.createdAt = createdAt ?? new Date()

    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required')
    }
  }

  deactivate(): void {
    this.isActive = false
  }

  activate(): void {
    this.isActive = true
  }
}
