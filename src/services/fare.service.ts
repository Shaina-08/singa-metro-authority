import { Journey } from '../models/journey.model';
import { ApiError } from '../utils/apiError';

export class FareService {
 fareRules = [
    {
      fromLine: 'Green',
      toLine: 'Green',
      peakFare: 2,
      nonPeakFare: 1,
      dailyCap: 8,
      weeklyCap: 55
    },
    {
      fromLine: 'Red',
      toLine: 'Red',
      peakFare: 3,
      nonPeakFare: 2,
      dailyCap: 12,
      weeklyCap: 70
    },
    {
      fromLine: 'Green',
      toLine: 'Red',
      peakFare: 4,
      nonPeakFare: 3,
      dailyCap: 15,
      weeklyCap: 90
    },
    {
      fromLine: 'Red',
      toLine: 'Green',
      peakFare: 3,
      nonPeakFare: 2,
      dailyCap: 15,
      weeklyCap: 90
    }
  ];

  private isPeakHour(dateTime: Date): boolean {
    const day = dateTime.getDay();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const time = hours + minutes / 60;

   
    if (day >= 1 && day <= 5) {
      return (time >= 8 && time <= 10) || (time >= 16.5 && time <= 19);
    }
    
    else if (day === 6) {
      return (time >= 10 && time <= 14) || (time >= 18 && time <= 23);
    }
   
    else {
      return time >= 18 && time <= 23;
    }
  }

  private async getDailyTotal(userId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const journeys = await Journey.find({
      userId,
      dateTime: { $gte: startOfDay, $lte: endOfDay }
    });

    return journeys.reduce((sum, journey) => sum + journey.fare, 0);
  }

  private async getWeeklyTotal(userId: string, date: Date): Promise<number> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const journeys = await Journey.find({
      userId,
      dateTime: { $gte: startOfWeek, $lte: endOfWeek }
    });

    return journeys.reduce((sum, journey) => sum + journey.fare, 0);
  }

  public async calculateFareWithCaps(journey: {
    fromLine: string;
    toLine: string;
    dateTime: Date;
    userId: string;
  }): Promise<number> {
    const fareRule = this.fareRules.find(
      rule => rule.fromLine === journey.fromLine && rule.toLine === journey.toLine
    );

    if (!fareRule) {
      throw new ApiError(400, 'Invalid journey route');
    }

    const baseFare = this.isPeakHour(journey.dateTime) 
      ? fareRule.peakFare 
      : fareRule.nonPeakFare;

    const dailyTotal = await this.getDailyTotal(journey.userId, journey.dateTime);
    const weeklyTotal = await this.getWeeklyTotal(journey.userId, journey.dateTime);

    
    if (dailyTotal + baseFare > fareRule.dailyCap) {
      return Math.max(0, fareRule.dailyCap - dailyTotal);
    }

   
    if (weeklyTotal + baseFare > fareRule.weeklyCap) {
      return Math.max(0, fareRule.weeklyCap - weeklyTotal);
    }

    return baseFare;
  }
}