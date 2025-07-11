// src/infrastructure/http/routes/public.routes.ts ✅
import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();
const customerController  = new CustomerController();

router.get('/customers', customerController.list.bind(customerController));
router.get('/customers/:id', customerController.findById.bind(customerController));
router.post('/customers', customerController.create.bind(customerController));
router.put('/customers/:id', customerController.update.bind(customerController));
router.delete('/customers/:id', customerController.delete.bind(customerController));

export const publicRoutes = router;
