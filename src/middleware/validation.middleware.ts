import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

export const validateJourney = [
  body('fromLine')
    .isIn(['Green', 'Red'])
    .withMessage('From line must be either Green or Red'),
  body('toLine')
    .isIn(['Green', 'Red'])
    .withMessage('To line must be either Green or Red'),
  body('dateTime')
    .isISO8601()
    .withMessage('Invalid date time format'),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Promise.all([
      body('fromLine').run(req),
      body('toLine').run(req),
      body('dateTime').run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateDateRange = [
  query('startDate')
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .isISO8601()
    .withMessage('Invalid end date format'),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Promise.all([
      query('startDate').run(req),
      query('endDate').run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
