export class Document {
  constructor(private readonly value: string) {
    if (!this.isValidCPF(value) && !this.isValidCNPJ(value)) {
      throw new Error('Invalid CPF or CNPJ')
    }
  }

  getValue(): string {
    return this.value
  }

  private isValidCPF(cpf: string): boolean {
    return /^\d{11}$/.test(cpf)
  }

  private isValidCNPJ(cnpj: string): boolean {
    return /^\d{14}$/.test(cnpj)
  }
}
