import { createRequestHandler } from 'zod-http-schemas/server';
import { loanApiSchema } from '../http-schema/loan';
import { loansRepo } from '../repos/loanRepo';
import { Loan, LoanSchema } from '../entities/loan';
import { logger } from '..';
import { calculateMonthlyPayment } from '../utils/util';
import { withAsyncErrorHandling } from './withAsyncErrorHandling';

export const createLoan = withAsyncErrorHandling(
  createRequestHandler(loanApiSchema, 'POST /loans', async (req, res) => {
    const parseResult = LoanSchema.safeParse(req.body);
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
    const loanId = parseResult.data.id;
    const loan = await loansRepo.getLoanById(loanId);
    if (loan) {
      logger.error('Loan already existed', { existingLoan: loan });
      res.status(400).json({ outcome: 'LOAN_ALREADY_EXISTED' });
      return;
    }

    const { loanAmount, interestRate, loanTerm } = parseResult.data;
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    const newLoan: Loan = { ...parseResult.data, monthlyPayment };
    const loans = await loansRepo.createLoan(newLoan);

    logger.info('Loan created', { newLoan, allLoans: loans });
    res.status(200).json({ outcome: 'SUCCESS', loans });
    return;
  })
);
