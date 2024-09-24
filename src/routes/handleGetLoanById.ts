import { createRequestHandler } from 'zod-http-schemas/server';
import { loanApiSchema, urlParamsSchema } from '../http-schema/loan';
import { loansRepo } from '../repos/loanRepo';
import { logger } from '..';
import { withAsyncErrorHandling } from './withAsyncErrorHandling';

export const getLoanById = withAsyncErrorHandling(
  createRequestHandler(loanApiSchema, 'GET /loans/:id', async (req, res) => {
    const urlParamsParseResult = urlParamsSchema.safeParse(req.params);
    if (!urlParamsParseResult.success) {
      res.status(400).json({
        error: 'INVALID_URL_PARAMETER',
        validationError: urlParamsParseResult.error.issues
      });
      return;
    }
    const loanId = urlParamsParseResult.data.id;

    const loan = await loansRepo.getLoanById(loanId);
    if (!loan) {
      logger.error('Loan cannot be found', { loanId });
      res.status(404).json({ outcome: 'LOAN_NOT_FOUND' });
      return;
    }
    logger.info('Got loan by loan id', { loan });
    res.status(200).json({ outcome: 'SUCCESS', loan });
    return;
  })
);
