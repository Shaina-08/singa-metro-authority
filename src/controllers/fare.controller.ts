import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { FareService } from '../services/fare.service';

export class FareController {
  private fareService: FareService;

  constructor() {
    this.fareService = new FareService();
  }

  public calculateFare = catchAsync(async (req: Request, res: Response) => {
    const { fromLine, toLine, dateTime } = req.body;
    const fare = await this.fareService.calculateFareWithCaps({
      fromLine,
      toLine,
      dateTime: new Date(dateTime),
      userId: req.body.userId || 'anonymous'
    });

    res.json({
      status: 'success',
      data: { fare }
    });
  });
  public calculateFaresInBulk = catchAsync(async (req: Request, res: Response) => {
    const { fareRequests } = req.body;
  
    // Validate input
    if (!Array.isArray(fareRequests) || fareRequests.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'fareRequests must be a non-empty array',
      });
    }
  
    // Limit concurrent fare calculations for large datasets
    const results = await Promise.all(
      fareRequests.map(async (request) => {
        const { fromLine, toLine, dateTime, userId } = request;
  
        // Basic validation for each request
        if (!fromLine || !toLine || !dateTime) {
          return { ...request, error: 'Missing required fields: fromLine, toLine, or dateTime' };
        }
  
        try {
          // Call service to calculate fare
          const fare = await this.fareService.calculateFareWithCaps({
            fromLine,
            toLine,
            dateTime: new Date(dateTime),
            userId: userId || 'anonymous',
          });
          return { ...request, fare }; // Add fare to response
        } catch (error) {
          // Handle individual errors
          return { ...request, error: (error as Error).message };
        }
      })
    );
  
    // Send the aggregated results
    res.json({
      status: 'success',
      data: results,
    });
  });
  


}