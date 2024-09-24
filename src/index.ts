import express from 'express';
import winston from 'winston';
import {
  createLoan,
  deleteLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
} from './routes';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'loan-app.log' }),
  ],
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/loans', getAllLoans);
app.get('/loans/:id', getLoanById);
app.post('/loans', createLoan);
app.put('/loans/:id', updateLoan);
app.delete('/loans/:id', deleteLoan);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
