import { CustomerRepository } from "../../../domain/repositories/customer.repository";

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<void> {
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }
    await this.customerRepository.delete(id);
  }
}
