import { createRequestHandler } from 'zod-http-schemas/server';
import { getLoansQueryParams, loanApiSchema } from '../http-schema/loan';
import { loansRepo } from '../repos/loanRepo';
import { logger } from '..';
import { withAsyncErrorHandling } from './withAsyncErrorHandling';


export const getAllLoans = withAsyncErrorHandling(
  createRequestHandler(loanApiSchema, 'GET /loans', async (req, res) => {
    const parseResult = getLoansQueryParams.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'INVALID_QUERY_PARAMETER',
        validationError: parseResult.error.issues
      });
      return;
    }
    const loans = await loansRepo.getAllLoans(parseResult.data.loanType);
    logger.info('Got all loans', { loans });
    res.status(200).json({ outcome: 'SUCCESS', loans });
    return;
  })
);
