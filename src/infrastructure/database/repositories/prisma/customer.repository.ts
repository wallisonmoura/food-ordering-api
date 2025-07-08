import { PrismaClient } from "@prisma/client";
import { Customer } from "../../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../../domain/repositories/customer.repository";
import { CustomerMapper } from "../../mapper/customer.mapper";

export class CustomerRepositoryPrisma implements CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(customer: Customer): Promise<void> {
    const data = CustomerMapper.toPrisma(customer)
    await this.prisma.customer.create({ data })
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({ where: { email } })
    return data ? CustomerMapper.toDomain(data) : null
  }

  async findById(id: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({ where: { id } })
    return data ? CustomerMapper.toDomain(data) : null
  }

  async findAll(): Promise<Customer[]> {
    const data = await this.prisma.customer.findMany()
    return data.map(CustomerMapper.toDomain)
  }

  async update(customer: Customer): Promise<void> {
    const data = CustomerMapper.toPrisma(customer)
    await this.prisma.customer.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        addressStreet: data.addressStreet,
        addressNumber: data.addressNumber,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZipCode: data.addressZipCode
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({ where: { id } });
  }
}
