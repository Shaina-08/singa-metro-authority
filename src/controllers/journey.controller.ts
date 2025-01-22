import { Request, Response } from 'express';
import { FareService } from '../services/fare.service';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/apiError';
import { Journey } from '../models/journey.model';

export class JourneyController {
  private fareService: FareService;

  constructor() {
    this.fareService = new FareService();
  }

  public createJourney = catchAsync(async (req: Request, res: Response) => {
    const { fromLine, toLine, dateTime, userId } = req.body;
    
    const fare = await this.fareService.calculateFareWithCaps({
      fromLine,
      toLine,
      dateTime: new Date(dateTime),
      userId
    });

    const journey = await Journey.create({
      fromLine,
      toLine,
      dateTime,
      userId,
      fare
    });

    res.status(201).json({
      status: 'success',
      data: { journey }
    });
  });

  public getAllJourneys = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const journeys = await Journey.find()
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Journey.countDocuments();

    res.json({
      status: 'success',
      data: { 
        journeys,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  });

  public getUserJourneys = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const journeys = await Journey.find({ userId }).sort({ dateTime: -1 });

    res.json({
      status: 'success',
      data: { journeys }
    });
  });

  public getJourneyById = catchAsync(async (req: Request, res: Response) => {
    const journey = await Journey.findById(req.params.journeyId);
    
    if (!journey) {
      throw new ApiError(404, 'Journey not found');
    }

    res.json({
      status: 'success',
      data: { journey }
    });
  });

  public bulkCreateJourneys = catchAsync(async (req: Request, res: Response) => {
    const journeys = req.body;
    
    if (!Array.isArray(journeys)) {
      throw new ApiError(400, 'Invalid input: expected array of journeys');
    }

    const processedJourneys = await Promise.all(
      journeys.map(async (journey) => {
        const fare = await this.fareService.calculateFareWithCaps({
          ...journey,
          dateTime: new Date(journey.dateTime),
          userId: journey.userId || 'anonymous'
        });
        return { ...journey, fare };
      })
    );

    const createdJourneys = await Journey.insertMany(processedJourneys);

    res.status(201).json({
      status: 'success',
      data: { journeys: createdJourneys }
    });
  });
}