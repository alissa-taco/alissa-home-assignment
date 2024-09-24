import * as z from 'zod';

export const LoanSchema = z.object({
  id: z.string(),
  applicantName: z.string(),
  loanAmount: z
    .number()
    .min(0, 'Loan amount must be at least 0')
    .max(100000, 'Loan amount cannot exceed 100000'),
  loanType: z.enum([
    'CAR',
    'PERSONAL',
  ]),
  income: z.number(),
  interestRate: z.number(),
  loanTerm: z.number().int(),
  monthlyPayment: z.number().optional(),
});

export type Loan = z.infer<typeof LoanSchema>;
