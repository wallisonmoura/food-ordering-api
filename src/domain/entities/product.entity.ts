import {v4 as uuidv4} from 'uuid'
import { Price } from '../value-objects/price.vo'
import { ImageUrl } from '../value-objects/image-url.vo'

export type Customization = {
  name: string
  extraCost: Price
}

export class Product {
  public readonly id: string

  constructor(public name: string,
    public description: string,
    public price: Price,
    public imageUrl: ImageUrl,
    public category: string,
    public customizations: Customization[] = [],
    id?: string) {
      this.id = id ?? uuidv4()
    }

    totalWithCustomization(customizations: string[]): number {
      const base = this.price.getValue()
      const extras = this.customizations
        .filter(c => customizations.includes(c.name))
        .reduce((sum, c) => sum + c.extraCost.getValue(), 0)

      return base + extras
    }
}
