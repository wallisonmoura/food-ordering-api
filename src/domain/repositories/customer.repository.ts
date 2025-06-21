import { Customer } from '../entities/customer.entity'

export interface CustomerRepository {
  create(customer: Customer): Promise<void>
  findByEmail(email: string): Promise<Customer | null>
  findById(id: string): Promise<Customer | null>
  findAll(): Promise<Customer[]>
  update(customer: Customer): Promise<void>
  delete(id: string): Promise<void>
}
