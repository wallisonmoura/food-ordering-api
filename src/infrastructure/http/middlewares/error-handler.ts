import { NextFunction, Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err)
  res.status(500).json({ message: err.message || 'Internal server error' })
}
