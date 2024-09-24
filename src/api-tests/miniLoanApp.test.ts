import * as fs from 'fs';
import axios from 'axios';
import { Loan } from '../entities/loan';
import { expect } from 'chai';
import { calculateMonthlyPayment } from '../utils/util';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  },
});

const loadFixture = <T>(path: string): T =>
  JSON.parse(fs.readFileSync(`${__dirname}/${path}`, 'utf8'));

const LOANS = loadFixture<{ loanApplications: Loan[] }>(
  'loan-applications.json'
).loanApplications;

describe('A mini loan API', () => {
  describe('createLoan tests', () => {
    it('should successfully create a loan', async () => {
      const result = await apiClient.post('/loans', LOANS[0]);
      const { loanAmount, interestRate, loanTerm } = LOANS[0];
      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        interestRate,
        loanTerm
      );
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [
          {
            ...LOANS[0],
            monthlyPayment,
          },
        ],
      });
    });

    it('should return 400 when create an existing loan', async () => {
      const result = await apiClient.post('/loans', LOANS[0]);
      expect(result.status).to.eq(400);
      expect(result.data).to.deep.eq({
        outcome: 'LOAN_ALREADY_EXISTED',
      });
    });

    it('should return 400 when parse invalid request body for loan creation', async () => {
      const invalidLoan = {
        ...LOANS[0],
        applicantName: 123,
        loanAmount: 5000000000,
      };
      const result = await apiClient.post('/loans', invalidLoan);
      expect(result.status).to.eq(400);
      expect(result.data.error).to.eq('INVALID_REQUEST_PAYLOAD');
    });

    it('should create more loans', async () => {
      const result1 = await apiClient.post('/loans', LOANS[1]);
      const result2 = await apiClient.post('/loans', LOANS[2]);
      expect(result1.status).to.eq(200);
      expect(result2.status).to.eq(200);
    });
  });

  describe('getAllLoans tests', () => {
    it('should list all loans', async () => {
      const result = await apiClient.get('/loans');
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [LOANS[0], LOANS[1], LOANS[2]],
      });
    });

    it('should list all loans with loan type filter', async () => {
      const result = await apiClient.get('/loans?loanType=CAR');
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [LOANS[0]],
      });
    });

    it('should return 400 when params are invalid', async () => {
      const result = await apiClient.get('/loans?loanType=5R');
      expect(result.status).to.eq(400);
      expect(result.data.error).to.eq('INVALID_QUERY_PARAMETER');
    });
  });

  describe('getLoanById tests', () => {
    it('should get loan by id', async () => {
      const result = await apiClient.get('/loans/1');
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loan: LOANS[0],
      });
    });

    it('should return 404 when getting a non-existent loan', async () => {
      const result = await apiClient.get('/loans/999');
      expect(result.status).to.eq(404);
      expect(result.data).to.deep.eq({
        outcome: 'LOAN_NOT_FOUND',
      });
    });
  });

  describe('updateLoan tests', () => {
    it('should return 400 when parse invalid request body for loan update', async () => {
      const invalidLoan = {
        ...LOANS[0],
        applicantName: 123,
        loanAmount: 5000000000,
      };
      const result = await apiClient.put('/loans/1', invalidLoan);
      expect(result.status).to.eq(400);
      expect(result.data.error).to.eq('INVALID_REQUEST_PAYLOAD');
    });

    it('should return 404 when loan cannot be found for loan update', async () => {
      const result = await apiClient.put('/loans/999', LOANS[0]);
      expect(result.status).to.eq(404);
      expect(result.data.outcome).to.eq('NO_MATCHING_LOAN');
    });

    it('should succeffully update loan', async () => {
      const targetLoanId = '2';
      const updatedLoanPayload = { ...LOANS[0], id: undefined };
      const { loanAmount, interestRate, loanTerm } = updatedLoanPayload;
      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        interestRate,
        loanTerm
      );
      const result = await apiClient.put(
        `/loans/${targetLoanId}`,
        updatedLoanPayload
      );
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [
          LOANS[0],
          { ...updatedLoanPayload, id: '2', monthlyPayment },
          LOANS[2],
        ],
      });
    });
  });

  describe('deleteLoan tests', () => {
    it('should return 404 when loan cannot be found for loan delete', async () => {
      const result = await apiClient.delete('/loans/999');
      expect(result.status).to.eq(404);
      expect(result.data.outcome).to.eq('NO_MATCHING_LOAN');
    });

    it('should succeffully update loan', async () => {
      const result = await apiClient.delete('/loans/2');
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [LOANS[0], LOANS[2]],
      });
    });

    it('should list all loans after deletion', async () => {
      const result = await apiClient.get('/loans');
      expect(result.status).to.eq(200);
      expect(result.data).to.deep.eq({
        outcome: 'SUCCESS',
        loans: [LOANS[0], LOANS[2]],
      });
    });
  });
});
