import { Customer } from "../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../domain/repositories/customer.repository";

export class ListAllCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll()
  }
}
