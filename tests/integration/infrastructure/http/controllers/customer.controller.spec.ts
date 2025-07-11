import request from 'supertest'

import { createExpressApp } from '../../../../../src/main/config/express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const app = createExpressApp()

describe('CustomerController (e2e)', () => {
  // beforeAll(async () => {
  //   // Pode rodar migrations se necessário
  //   await prisma.$connect();
  // });

  // beforeEach(async () => {
  //   // Limpa os dados do banco antes de cada teste
  //   await prisma.customer.deleteMany();
  // });

  beforeEach(async () => {
    await prisma.customer.deleteMany();
  });

  it('should create a new client successfully', async () => {
    const response = await request(app)
      .post('/api/customers')
      .send({
        name: 'Ana Souza',
        email: 'ana@example.com',
        phone: '81999999999',
        document: '12345678900',
        address: {
          street: 'Rua A',
          number: '123',
          city: 'Recife',
          state: 'PE',
          zipCode: '50000-000'
        }
      })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Ana Souza');
  })

  it('should list all customers', async () => {
    await prisma.customer.create({
      data: {
        id: 'test-id-1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '81988888888',
        document: '12312312300',
        addressStreet: 'Rua B',
        addressNumber: '456',
        addressCity: 'Olinda',
        addressState: 'PE',
        addressZipCode: '53100-000',
        createdAt: new Date()
      }
    });

    const response = await request(app).get('/api/customers');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].email).toBe('joao@example.com');
  })

  it('should update a client', async () => {
    const created = await prisma.customer.create({
      data: {
        id: 'test-id-update',
        name: 'Carlos Lima',
        email: 'carlos@example.com',
        phone: '81986666666',
        document: '55566677788',
        addressStreet: 'Rua D',
        addressNumber: '101',
        addressCity: 'Camaragibe',
        addressState: 'PE',
        addressZipCode: '54700-000',
        createdAt: new Date()
      }
    });

    const response = await request(app)
      .put(`/api/customers/${created.id}`)
      .send({
        name: 'Carlos Lima Atualizado',
        email: 'carlos@example.com',
        phone: '81986666666',
        document: '55566677788',
        address: {
          street: 'Rua D',
          number: '101',
          city: 'Camaragibe',
          state: 'PE',
          zipCode: '54700-000'
        }
      });

    expect(response.status).toBe(200);

    const updated = await prisma.customer.findUnique({ where: { id: created.id } });
    expect(updated?.name).toBe('Carlos Lima Atualizado');
  })

  it('deve remover um cliente', async () => {
    const created = await prisma.customer.create({
      data: {
        id: 'test-id-delete',
        name: 'Roberta Souza',
        email: 'roberta@example.com',
        phone: '81985555555',
        document: '88899900011',
        addressStreet: 'Rua E',
        addressNumber: '202',
        addressCity: 'Paulista',
        addressState: 'PE',
        addressZipCode: '53400-000',
        createdAt: new Date()
      }
    });

    const response = await request(app).delete(`/api/customers/${created.id}`);
    expect(response.status).toBe(204);

    const exists = await prisma.customer.findUnique({ where: { id: created.id } });
    expect(exists).toBeNull();
  });
})
