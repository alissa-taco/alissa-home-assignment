import { logger } from '..';
import { Loan } from '../entities/loan';

const LOANS: Record<Loan['id'], Loan> = {};

export const loansRepo = {
  getLoanById: async (id: Loan['id']): Promise<Loan | undefined> => LOANS[id],
  getAllLoans: async (loanType?: Loan['loanType']): Promise<Loan[]> => {
    const loans = Object.values(LOANS);
    if (loanType) {
      return loans.filter((loan) => loan.loanType === loanType);
    }
    return loans;
  },
  createLoan: async (loan: Loan): Promise<Loan[]> => {
    if (LOANS[loan.id]) {
      logger.error('Loan already exists');
      return Object.values(LOANS);
    }
    LOANS[loan.id] = loan;
    return Object.values(LOANS);
  },
  updateLoan: async (
    loan: Partial<Loan> & { id: Loan['id'] }
  ): Promise<Loan[]> => {
    const currentLoan = LOANS[loan.id];
    if (!currentLoan) {
      logger.error(`Loan matching ${loan.id} does not exist`);
      return Object.values(LOANS);
    }
    Object.assign(currentLoan, { ...loan, id: loan.id });
    return Object.values(LOANS);
  },
  deleteLoan: async (id: Loan['id']): Promise<Loan[]> => {
    const currentLoan = LOANS[id];
    if (!currentLoan) {
      logger.error(`Loan matching ${id} does not exist`);
      return Object.values(LOANS);
    }
    delete LOANS[id];
    return Object.values(LOANS);
  },
};
