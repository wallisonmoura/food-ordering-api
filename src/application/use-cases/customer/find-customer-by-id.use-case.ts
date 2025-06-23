import { Customer } from "../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../domain/repositories/customer.repository";

export class FindCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id)

    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }
}
