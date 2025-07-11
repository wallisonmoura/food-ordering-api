import { PrismaClient } from "@prisma/client";
import { CustomerRepositoryPrisma } from "../../infrastructure/database/repositories/prisma/customer.repository";

import { CreateCustomerUseCase } from "../../application/use-cases/customer/create-customer.use-case";
import { FindCustomerByIdUseCase } from "../../application/use-cases/customer/find-customer-by-id.use-case";
import { ListAllCustomersUseCase } from "../../application/use-cases/customer/list-all-customers.use-case";
import { UpdateCustomerUseCase } from "../../application/use-cases/customer/update-customer.use-case";
import { DeleteCustomerUseCase } from "../../application/use-cases/customer/delete-customer.use-case";

const prisma = new PrismaClient();
const customerRepository = new CustomerRepositoryPrisma(prisma);

export function makeCreateCustomerUseCase() {
  return new CreateCustomerUseCase(customerRepository);
}

export function makeFindCustomerByIdUseCase() {
  return new FindCustomerByIdUseCase(customerRepository);
}

export function makeListAllCustomersUseCase() {
  return new ListAllCustomersUseCase(customerRepository);
}

export function makeUpdateCustomerUseCase() {
  return new UpdateCustomerUseCase(customerRepository);
}

export function makeDeleteCustomerUseCase() {
  return new DeleteCustomerUseCase(customerRepository);
}


