import { Address } from '../../../../src/domain/value-objects/address.vo'
import { Document } from '../../../../src/domain/value-objects/document.vo'
import { Customer } from '../../../../src/domain/entities/customer.entity'

describe('Customer Entity', () => {
  const address = new Address('Rua A', '123', 'Recife', 'PE', '50000-000')
  const document = new Document('12345678901')

  it('should create a valid customer', () => {
    const customer = new Customer(
      'João Silva',
      'joao@email.com',
      '81999999999',
      document,
      address
    )

    expect(customer.id).toBeDefined()
    expect(customer.createdAt).toBeInstanceOf(Date)
    expect(customer.name).toBe('João Silva')
    expect(customer.document.getValue()).toBe('12345678901')
    expect(customer.address.getFullAddress()).toContain('Recife')
  })

  it('should throw error for invalid email', () => {
    expect(() => {
      new Customer(
        'Fulano',
        'email-invalido',
        '81999999999',
        document,
        address
      )
    }).toThrow('Invalid email')
  })

  it('should throw error for invalid phone number', () => {
    expect(() => {
      new Customer(
        'Fulano',
        'valido@email.com',
        'abc',
        document,
        address
      )
    }).toThrow('Invalid phone number')
  })

  it('should throw error for empty name', () => {
    expect(() => {
      new Customer(
        '',
        'email@email.com',
        '81999999999',
        document,
        address
      )
    }).toThrow('Customer name is required')
  })
})
