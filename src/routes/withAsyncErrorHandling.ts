import { RequestHandler } from 'express';
import { logger } from '..';

export const withAsyncErrorHandling =
  (
    handler: (req: any, res: any, next: any) => void | Promise<void>
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error(`Error while handling the request`, {
        error,
      });
      res.sendStatus(500);
    }
  };
