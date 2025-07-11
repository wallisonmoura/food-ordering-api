import { Request, Response } from "express";
import { makeCreateCustomerUseCase, makeDeleteCustomerUseCase, makeFindCustomerByIdUseCase, makeListAllCustomersUseCase, makeUpdateCustomerUseCase } from "../../../main/factories/customer-factory";

export class CustomerController {
  async list(req: Request, res: Response): Promise<void> {
    const useCase = makeListAllCustomersUseCase();
    const customers = await useCase.execute();
    res.json(customers)
  }

  async findById(req: Request, res: Response): Promise<void> {
    const useCase = makeFindCustomerByIdUseCase();
    const customer = await useCase.execute(req.params.id);
    res.json(customer)
  }

  async create(req: Request, res: Response): Promise<void> {
    const useCase = makeCreateCustomerUseCase();
    const customer = await useCase.execute(req.body);
    res.status(201).json(customer);
  }

  async update(req: Request, res: Response): Promise<void> {
    const useCase = makeUpdateCustomerUseCase();
    await useCase.execute({ id: req.params.id, ...req.body });
    res.status(200).send();
  }

  async delete(req: Request, res: Response): Promise<void> {
    const useCase = makeDeleteCustomerUseCase();
    await useCase.execute(req.params.id);
    res.status(204).send();
  }

}
