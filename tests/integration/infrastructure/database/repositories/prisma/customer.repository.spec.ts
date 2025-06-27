import { PrismaClient } from '@prisma/client';

import { CustomerRepositoryPrisma } from '../../../../../../src/infrastructure/database/repositories/prisma/customer.repository';
import { Customer } from '../../../../../../src/domain/entities/customer.entity';
import { Document } from '../../../../../../src/domain/value-objects/document.vo';
import { Address } from '../../../../../../src/domain/value-objects/address.vo';

describe('CustomerRepositoryPrisma', ()=> {
  let prisma: PrismaClient;
  let repository: CustomerRepositoryPrisma;

  beforeAll(() => {
    prisma = new PrismaClient();
    repository = new CustomerRepositoryPrisma(prisma);
  });

  afterEach(async () => {
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create and search for a customer by id', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000')
    );
    await repository.create(customer);

    const found = await repository.findById(customer.id);
    expect(found).toBeTruthy();
    expect(found?.name).toBe('John Doe');
    expect(found?.email).toBe('john@example.com');
  })

  it('should search for a customer by email', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000')
    );
    await repository.create(customer);

    const found = await repository.findByEmail('john@example.com');
    expect(found).toBeTruthy();
    expect(found?.email).toBe('john@example.com');
  });

  it('should list customers', async () => {
    const customer1 = new Customer(
      'John Doe',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000')
    );
    const customer2 = new Customer(
      'Jane Roe',
      'jane@example.com',
      '11987654321',
      new Document('98765432109'),
      new Address('Rua B', '456', 'São Paulo', 'SP', '01000-000')
    );
    await repository.create(customer1);
    await repository.create(customer2);

    const results = await repository.findAll();
    expect(results.length).toBe(2);
  });

  it('should update a customer', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000')
    );
    await repository.create(customer);

    const updatedCustomer = new Customer(
      'John Updated',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000'),
      customer.id,
      customer.createdAt
    );
    await repository.update(updatedCustomer);

    const found = await repository.findById(customer.id);
    expect(found?.name).toBe('John Updated');
  });

  it('should delete a customer', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '11912345678',
      new Document('12345678901'),
      new Address('Rua A', '123', 'São Paulo', 'SP', '01000-000')
    );
    await repository.create(customer);

    await repository.delete(customer.id);
    const found = await repository.findById(customer.id);
    expect(found).toBeNull();
  });
})
