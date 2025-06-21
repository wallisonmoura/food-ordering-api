import { Customer } from "../../../domain/entities/customer.entity"
import { CustomerRepository } from "../../../domain/repositories/customer.repository"
import { Address } from "../../../domain/value-objects/address.vo"
import { Document } from "../../../domain/value-objects/document.vo"

export interface CreateCustomerInput {
  name: string
  email: string
  phone: string
  document: string
  address: {
    street: string
    number: string
    city: string
    state: string
    zipCode: string
  }
}

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: CreateCustomerInput): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(data.email)

    if (existingCustomer) {
      throw new Error('Email already in use')
    }

   const document = new Document(data.document)
    const address = new Address(
      data.address.street,
      data.address.number,
      data.address.city,
      data.address.state,
      data.address.zipCode
    )

    const customer = new Customer(data.name, data.email, data.phone, document, address)

    await this.customerRepository.create(customer)

    return customer
  }
}
