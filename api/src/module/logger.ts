import { Request, Response } from 'express';
import { NextFunction } from 'connect';

/**
 * Log the current time
 *
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next NextFunction
 * @returns {Promise<void>}
 */
export async function logTime(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log(`Current time: ${new Date()}`);
  next();
}
