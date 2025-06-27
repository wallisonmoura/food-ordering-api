import { PrismaClient } from "@prisma/client";
import { Customer } from "../../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../../domain/repositories/customer.repository";
import { Document } from "../../../../domain/value-objects/document.vo";
import { Address } from "../../../../domain/value-objects/address.vo";

export class CustomerRepositoryPrisma implements CustomerRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async create(customer: Customer): Promise<void> {
    await this.prisma.customer.create({
      data: {
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
      }
    })
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({ where: { email } });

    if (!data) return null;

    return new Customer(
      data.name,
      data.email,
      data.phone,
      new Document(data.document),
      new Address(data.addressStreet, data.addressNumber, data.addressCity, data.addressState, data.addressZipCode),
      data.id,
      data.createdAt
    );
  }

  async findById(id: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({ where: { id } })
    if (!data) return null

    return new Customer(
      data.name,
      data.email,
      data.phone,
      new Document(data.document),
      new Address(data.addressStreet, data.addressNumber, data.addressCity, data.addressState, data.addressZipCode),
      data.id,
      data.createdAt
    )
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany()

    return customers.map((data) => new Customer(
      data.name,
      data.email,
      data.phone,
      new Document(data.document),
      new Address(data.addressStreet, data.addressNumber, data.addressCity, data.addressState, data.addressZipCode),
      data.id,
      data.createdAt
    ))
  }

  async update(customer: Customer): Promise<void> {
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document.getValue(),
        addressStreet: customer.address.street,
        addressNumber: customer.address.number,
        addressCity: customer.address.city,
        addressState: customer.address.state,
        addressZipCode: customer.address.zipCode,
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({ where: { id } });
  }
}
