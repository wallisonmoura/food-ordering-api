// src/main/routes.ts ✅
import { Express } from 'express';
import { publicRoutes } from '../infrastructure/http/routes/public.routes';


export function registerRoutes(app: Express) {
  app.use('/api', publicRoutes); // ✅
}
