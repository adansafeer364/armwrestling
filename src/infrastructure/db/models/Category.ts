import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  tournamentId: Types.ObjectId;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OPEN';
  minWeightKg: number;
  maxWeightKg: number;
  arm: 'LEFT' | 'RIGHT' | 'BOTH';
  maxParticipants?: number;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export const CategorySchema = new Schema<ICategory>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: [true, 'Tournament ID reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['MALE', 'FEMALE', 'OPEN'],
        message: '{VALUE} is not a valid gender selection',
      },
      default: 'OPEN',
      required: true,
    },
    minWeightKg: {
      type: Number,
      default: 0,
      min: [0, 'Minimum weight cannot be negative'],
    },
    maxWeightKg: {
      type: Number,
      required: [true, 'Maximum weight limit is required'],
      min: [0, 'Maximum weight cannot be negative'],
      validate: {
        validator: function (this: any, value: number) {
          return this.minWeightKg === undefined || value > this.minWeightKg;
        },
        message: 'Maximum weight must be greater than the minimum weight limit',
      },
    },
    arm: {
      type: String,
      enum: {
        values: ['LEFT', 'RIGHT', 'BOTH'],
        message: '{VALUE} is not a valid arm configuration',
      },
      default: 'BOTH',
      required: true,
    },
    maxParticipants: {
      type: Number,
      min: [2, 'Maximum participants must be at least 2'],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Registration'
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of categories within a tournament
CategorySchema.index({ tournamentId: 1, name: 1, arm: 1 }, { unique: true });

// Compiles the model globally or uses the cached model
export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
