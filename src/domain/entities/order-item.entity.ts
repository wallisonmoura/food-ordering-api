import { Customization, Product } from "./product.entity";

export class OrderItem {
  constructor(
    public readonly product: Product,
    public readonly quantity: number,
    public readonly selectedCustomizations: string[] = []
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    if (!product) {
      throw new Error('Product is required')
    }
  }

  getTotal(): number {
    const baseTotal = this.product.totalWithCustomization(this.selectedCustomizations)
    return baseTotal * this.quantity
  }

  getCustomizations(): Customization[] {
    return this.product.customizations.filter(c =>
      this.selectedCustomizations.includes(c.name)
    )
  }
}
