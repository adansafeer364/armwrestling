import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAthlete extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  nationality: string;
  weight?: number;
  club?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AthleteSchema = new Schema<IAthlete>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: [true, 'Gender is required'],
      index: true,
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
      index: true,
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    club: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Athlete: Model<IAthlete> =
  mongoose.models.Athlete || mongoose.model<IAthlete>('Athlete', AthleteSchema);
