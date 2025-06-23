import { Customer } from "../../../domain/entities/customer.entity";
import { OrderItem } from "../../../domain/entities/order-item.entity";
import { Order } from "../../../domain/entities/order.entity";
import { Customization, Product } from "../../../domain/entities/product.entity";
import { CustomerRepository } from "../../../domain/repositories/customer.repository";
import { OrderRepository } from "../../../domain/repositories/order.repository";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { Address } from "../../../domain/value-objects/address.vo";
import { Document } from "../../../domain/value-objects/document.vo";
import { ImageUrl } from "../../../domain/value-objects/image-url.vo";
import { Price } from "../../../domain/value-objects/price.vo";
import { CreateOrderUseCase } from "./create-order.use-case";

describe('CreateOrderUseCase', () => {
  const mockOrderRepository: OrderRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCustomerRepository: CustomerRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductRepository: ProductRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order with selected customizations', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '81999999999',
      new Document('12345678901'),
      new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
      '1'
    );
    const customizations: Customization[] = [
      { name: 'Extra Cheese', extraCost: new Price(2) },
      { name: 'Bacon', extraCost: new Price(3) },
    ];
    const product = new Product(
      'Burger',
      'Delicious Burger',
      new Price(10),
      new ImageUrl('http://example.com/burger.png'),
      'Burger',
      customizations,
      '1'
    );

    (mockCustomerRepository.findById as jest.Mock).mockResolvedValue(customer);
    (mockProductRepository.findById as jest.Mock).mockResolvedValue(product);

    const useCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockCustomerRepository,
      mockProductRepository
    );
    const result = await useCase.execute({
      customerId: '1',
      orderItems: [
        {
          productId: '1',
          quantity: 2,
          selectedCustomizations: ['Extra Cheese', 'Bacon']
        },
      ],
    });

    expect(result).toBeInstanceOf(Order);
    expect(result.getItems()).toHaveLength(1);
    expect(result.getItems()[0]).toBeInstanceOf(OrderItem);
    expect(result.getItems()[0].getCustomizations().length).toBe(2);
    expect(result.getTotal()).toBe(
      (10 + 2 + 3) * 2 // Base + Extra Cheese + Bacon, vezes quantity
    );
    expect(mockOrderRepository.create).toHaveBeenCalledWith(result);
  });

  it('should throw error if customer not found', async () => {
    (mockCustomerRepository.findById as jest.Mock).mockResolvedValue(null);
    const useCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockCustomerRepository,
      mockProductRepository
    );
    await expect(
      useCase.execute({
        customerId: 'unknown',
        orderItems: [
          {
            productId: '1',
            quantity: 2,
            selectedCustomizations: []
          },
        ],
      })
    ).rejects.toThrow('Customer not found');
  });

  it('should throw error if product not found', async () => {
    const customer = new Customer(
      'John Doe',
      'john@example.com',
      '81999999999',
      new Document('12345678901'),
      new Address('Rua A', '123', 'Recife', 'PE', '50000-000'),
      '1'
    );
    (mockCustomerRepository.findById as jest.Mock).mockResolvedValue(customer);
    (mockProductRepository.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockCustomerRepository,
      mockProductRepository
    );
    await expect(
      useCase.execute({
        customerId: '1',
        orderItems: [{ productId: 'unknown', quantity: 2, selectedCustomizations: [] }]
      })
    ).rejects.toThrow('Product unknown not found');
  });
})
