import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IJourney extends Document {
  userId: string;
  fromLine: string;
  toLine: string;
  dateTime: Date;
  fare: number;
}


const JourneySchema: Schema = new Schema<IJourney>(
  {
    userId: { type: String, required: true },
    fromLine: { type: String, required: true },
    toLine: { type: String, required: true },
    dateTime: { type: Date, required: true },
    fare: { type: Number, required: true }
  },
  {
    timestamps: true, 
  }
);


export const Journey: Model<IJourney> = mongoose.model<IJourney>('journeys', JourneySchema);
