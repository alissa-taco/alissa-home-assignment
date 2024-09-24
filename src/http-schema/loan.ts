import { z } from 'zod';
import { createHttpSchema } from 'zod-http-schemas';
import { LoanSchema } from '../entities/loan';

export const urlParamsSchema = z.object({
  id: z.string(),
});

export const getLoansQueryParams = z.object({
  loanType: z.enum([
    'CAR',
    'PERSONAL',
  ]).optional(),
});

const ZodIssueSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
  code: z.string(),
});

const getAllLoansResponseBody = z.object({
  outcome: z.literal('SUCCESS'),
  loans: z.array(LoanSchema),
});

const getLoanByIdResponseBody = z.union([
  z.object({
    outcome: z.literal('SUCCESS'),
    loan: LoanSchema.optional(),
  }),
  z.object({ outcome: z.literal('LOAN_NOT_FOUND') }),
]);

const createLoanRequestBody = LoanSchema.omit({ monthlyPayment: true });
const createLoanResponseBody = z.union([
  z.object({
    outcome: z.literal('SUCCESS'),
    loans: z.array(LoanSchema),
  }),
  z.object({ outcome: z.literal('LOAN_ALREADY_EXISTED') }),
]);

export const updateLoanRequestBody = createLoanRequestBody.omit({ id: true });
const updateLoanResponseBody = z.union([
  z.object({
    outcome: z.literal('SUCCESS'),
    loans: z.array(LoanSchema),
  }),
  z.object({
    outcome: z.literal('NO_MATCHING_LOAN'),
  }),
]);

const deleteLoanResponseBody = z.union([
  z.object({
    outcome: z.literal('SUCCESS'),
    loans: z.array(LoanSchema),
  }),
  z.object({
    outcome: z.literal('NO_MATCHING_LOAN'),
  }),
]);

const generalErrorResponse = z.union([
  z.object({
    error: z.literal('INVALID_REQUEST_PAYLOAD'),
    validationError: z.array(ZodIssueSchema),
  }),
  z.object({
    error: z.literal('INVALID_URL_PARAMETER'),
    validationError: z.array(ZodIssueSchema),
  }),
  z.object({
    error: z.literal('INVALID_QUERY_PARAMETER'),
    validationError: z.array(ZodIssueSchema),
  })
]);

export const loanApiSchema = createHttpSchema({
  'GET /loans': {
    responseBody: z.union([getAllLoansResponseBody, generalErrorResponse]),
  },
  'GET /loans/:id': {
    responseBody: z.union([getLoanByIdResponseBody, generalErrorResponse]),
  },
  'POST /loans': {
    requestBody: createLoanRequestBody,
    responseBody: z.union([createLoanResponseBody, generalErrorResponse]),
  },
  'PUT /loans/:id': {
    requestBody: updateLoanRequestBody,
    responseBody: z.union([updateLoanResponseBody, generalErrorResponse]),
  },
  'DELETE /loans/:id': {
    responseBody: z.union([deleteLoanResponseBody, generalErrorResponse]),
  },
});
