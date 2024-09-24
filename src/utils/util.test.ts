import { expect } from 'chai';
import { calculateMonthlyPayment } from './util';

describe('calculateMonthlyPayment', () => {
  it('return monthlyPayment with two decimal number', () => {
    const loanAmount = 50000;
    const interestRate = 10;
    const loanTerm = 5;
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    expect(monthlyPayment).to.equal(1062.35);
  });
});
