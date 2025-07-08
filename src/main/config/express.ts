import express from 'express';
import { json } from 'body-parser';
import { registerRoutes } from '../routes';
import { notFound } from '../../infrastructure/http/middlewares/not-found';
import { errorHandler } from '../../infrastructure/http/middlewares/error-handler';


export function createExpressApp() {
  const app = express();

  app.use(json());
  registerRoutes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
