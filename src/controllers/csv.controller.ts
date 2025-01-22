import { Request, Response } from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { FareService } from '../services/fare.service';

const ProcessedDataSchema = new mongoose.Schema({
  fromLine: { type: String, required: true },
  toLine: { type: String, required: true },
  dateTime: { type: String, required: true },
  userId: { type: String, required: true },
});

const ProcessedData = mongoose.model('ProcessedData', ProcessedDataSchema);

interface CSVRow {
  fromLine: string;
  toLine: string;
  dateTime: string;
  userId: string;
}

export class CSVController {
  private fareService: FareService;

  constructor() {
    this.fareService = new FareService();
  }
  public uploadAndProcessCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ status: 'error', message: 'No CSV file uploaded' });
        return;
      }
  
      const inputData: CSVRow[] = [];
  
      const delimiter = this.detectDelimiter(filePath);
  
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: delimiter, headers: true }))
        .on('data', (row) => {
          
            const mappedRow = {
              fromLine: row._0,
              toLine: row._1,
              dateTime: row._2,
              userId: row._3,
            };
          
            console.log("Mapped row data:", mappedRow);
          
            if (mappedRow.fromLine && mappedRow.toLine && mappedRow.dateTime && mappedRow.userId) {
              inputData.push(mappedRow);
            } else {
              console.error("Invalid row data:", row);
            }
          })
        .on('end', async () => {
          if (inputData.length === 0) {
            res.status(400).json({
              status: 'error',
              message: 'No valid data found in the uploaded CSV file',
            });
            return;
          }
  
          const errors: string[] = [];
          const results: object[] = [];
          let fare = 0;
          
          for (const data of inputData) {
            try {
              const processedData = new ProcessedData(data);
              const fare = await this.fareService.calculateFareWithCaps({
                fromLine: data.fromLine,
                toLine: data.toLine,
                dateTime: new Date(data.dateTime),
                userId: data.userId,
                });
              results.push({ processedData, fare });
              await processedData.save(); 
            } catch (error) {
              errors.push(`Error saving data for userId ${data.userId}: ${(error as any).message}`);
            }
          }
  
          try {
            fs.unlinkSync(filePath);
          } catch (fileError) {
            console.error('Error cleaning up file:', fileError);
          }
  
          
          res.json({
            status: 'success',
            message: 'CSV data processed and stored successfully',
            totalRecords: inputData.length,
            results,
            
          });
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          res.status(500).json({
            status: 'error',
            message: `Error reading CSV file: ${error.message}`,
          });
        });
    } catch (error: any) {
      console.error('Unexpected error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  };
  

  
  private detectDelimiter(filePath: string): string {
    const sampleData = fs.readFileSync(filePath, 'utf-8').split('\n')[0];
    if (sampleData.includes(';')) {
      return ';';
    } else if (sampleData.includes(',')) {
      return ',';
    } else {
      throw new Error('Unsupported delimiter in CSV file');
    }
  }
}
