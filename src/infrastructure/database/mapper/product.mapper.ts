import {
  Product as PrismaProduct,
  Customization as PrismaCustomization
} from "@prisma/client";
import { Product } from "../../../domain/entities/product.entity";
import { Price } from "../../../domain/value-objects/price.vo";
import { ImageUrl } from "../../../domain/value-objects/image-url.vo";

export class ProductMapper {
  static toDomain(product: PrismaProduct & { customizations: PrismaCustomization[] }): Product {
    return new Product(
      product.name,
      product.description,
      new Price(product.price),
      new ImageUrl(product.imageUrl),
      product.categoryId,
      product.customizations.map((c) => ({
        name: c.name,
        extraCost: new Price(c.extraCost)
      })),
      product.id
    )
  }

  static toPrisma(product: Product): {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    categoryId: string
    customizations: {
      create: {
        name: string
        extraCost: number
      }[]
    }
  } {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.getValue(),
      imageUrl: product.imageUrl.getValue(),
      categoryId: product.category,
      customizations: {
        create: product.customizations.map((c) => ({
          name: c.name,
          extraCost: c.extraCost.getValue()
        }))
      }
    }
  }
}
