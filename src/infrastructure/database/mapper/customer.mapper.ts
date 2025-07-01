import { Customer as PrismaCustomer } from '@prisma/client'
import { Customer } from '../../../domain/entities/customer.entity'
import { Document } from '../../../domain/value-objects/document.vo'
import { Address } from '../../../domain/value-objects/address.vo'


export class CustomerMapper {
  static toDomain(prismaCustomer: PrismaCustomer): Customer {
    return new Customer(
      prismaCustomer.name,
      prismaCustomer.email,
      prismaCustomer.phone,
      new Document(prismaCustomer.document),
      new Address(
        prismaCustomer.addressStreet,
        prismaCustomer.addressNumber,
        prismaCustomer.addressCity,
        prismaCustomer.addressState,
        prismaCustomer.addressZipCode
      ),
      prismaCustomer.id,
      prismaCustomer.createdAt
    )
  }

  static toPrisma(customer: Customer): PrismaCustomer {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      document: customer.document.getValue(),
      addressStreet: customer.address.street,
      addressNumber: customer.address.number,
      addressCity: customer.address.city,
      addressState: customer.address.state,
      addressZipCode: customer.address.zipCode,
      createdAt: customer.createdAt
    }
  }
}
