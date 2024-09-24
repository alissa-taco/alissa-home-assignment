import { createRequestHandler } from 'zod-http-schemas/server';
import {
  loanApiSchema,
  updateLoanRequestBody,
  urlParamsSchema,
} from '../http-schema/loan';
import { logger } from '..';
import { loansRepo } from '../repos/loanRepo';
import { calculateMonthlyPayment } from '../utils/util';
import { Loan } from '../entities/loan';
import { withAsyncErrorHandling } from './withAsyncErrorHandling';

export const updateLoan = withAsyncErrorHandling(
  createRequestHandler(loanApiSchema, 'PUT /loans/:id', async (req, res) => {
    const parseResult = updateLoanRequestBody.safeParse(req.body);
    if (!parseResult.success) {
      logger.error('Error when parsing request schema of create loan', {
        validationError: parseResult.error.issues,
        reqBody: req.body,
      });
      res.status(400).json({
        error: 'INVALID_REQUEST_PAYLOAD',
        validationError: parseResult.error.issues,
      });
      return;
    }

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
      res.status(404).json({ outcome: 'NO_MATCHING_LOAN' });
      return;
    }
    const { loanAmount, interestRate, loanTerm } = parseResult.data;
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    const updatedLoan: Loan = {
      ...parseResult.data,
      monthlyPayment,
      id: loanId,
    };
    const loans = await loansRepo.updateLoan(updatedLoan);

    logger.info('Loan Updated', { updatedLoan, allLoans: loans });
    res.status(200).json({ outcome: 'SUCCESS', loans });
    return;
  })
);
