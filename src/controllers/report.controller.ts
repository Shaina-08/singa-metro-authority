import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Journey } from '../models/journey.model';

export class ReportController {
  // Fetching daily report
  public getDailyReport = catchAsync(async (req: Request, res: Response) => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    // Ensure that dates are correctly parsed and timezone-aware
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const report = await Journey.aggregate([
      {
        $match: {
          dateTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
            fromLine: '$fromLine',
            toLine: '$toLine'
          },
          totalJourneys: { $sum: 1 },
          totalFare: { $sum: '$fare' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    if (!report || report.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No data found for the given date range' });
    }

    res.json({
      status: 'success',
      data: { report }
    });
    // res.setHeader('Content-Type', 'application/json');
  });

  // Fetching weekly report
  public getWeeklyReport = catchAsync(async (req: Request, res: Response) => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const report = await Journey.aggregate([
      {
        $match: {
          dateTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            week: { $isoWeek: '$dateTime' },
            fromLine: '$fromLine',
            toLine: '$toLine'
          },
          totalJourneys: { $sum: 1 },
          totalFare: { $sum: '$fare' }
        }
      },
      {
        $sort: { '_id.week': 1 }
      }
    ]);

    if (!report || report.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No data found for the given date range' });
    }

    res.json({
      status: 'success',
      data: { report }
    });
  });

  // Fetching line usage report (you can implement the aggregation based on specific requirements)
  public getLineUsageReport = catchAsync(async (req: Request, res: Response) => {
    const report = await Journey.aggregate([
      {
        $group: {
          _id: { fromLine: '$fromLine', toLine: '$toLine' },
          totalJourneys: { $sum: 1 },
          totalFare: { $sum: '$fare' }
        }
      }
    ]);

    if (!report || report.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No data found for the given lines' });
    }

    res.json({
      status: 'success',
      data: { report }
    });
  });

  // Fetching peak hours report
  public getPeakHoursReport = catchAsync(async (req: Request, res: Response) => {
    const date = new Date(req.query.date as string);
    date.setHours(0, 0, 0, 0);

    const report = await Journey.aggregate([
      {
        $match: {
          dateTime: {
            $gte: date,
            $lte: new Date(date.setHours(23, 59, 59))
          }
        }
      },
      {
        $group: {
          _id: { hour: { $hour: '$dateTime' } },
          totalJourneys: { $sum: 1 },
          averageFare: { $avg: '$fare' }
        }
      },
      {
        $sort: { '_id.hour': 1 }
      }
    ]);

    if (!report || report.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No data found for the given date' });
    }

    res.json({
      status: 'success',
      data: { report }
    });
  });
}
