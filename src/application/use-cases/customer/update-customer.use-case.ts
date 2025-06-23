import { Customer } from "../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../domain/repositories/customer.repository";
import { Address } from "../../../domain/value-objects/address.vo";
import { Document } from "../../../domain/value-objects/document.vo";

interface UpdateCustomerInput {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: UpdateCustomerInput): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(input.id)

    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    const updatedCustomer = new Customer(
      input.name,
      input.email,
      input.phone,
      new Document(input.document),
      new Address(
        input.address.street,
        input.address.number,
        input.address.city,
        input.address.state,
        input.address.zipCode
      ),
      existingCustomer.id,
      existingCustomer.createdAt
    );

    await this.customerRepository.update(updatedCustomer);
    return updatedCustomer;
  }
}
