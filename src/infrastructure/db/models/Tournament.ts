import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITournament extends Document {
  organizerId: Types.ObjectId;
  title: string;
  description?: string;
  bannerImage?: string;
  location: string;
  weightCategory: string;
  mapAddress?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  status: 'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  entryFee: number;
  prizePool: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TournamentSchema = new Schema<ITournament>(
  {
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer User reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Tournament title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    bannerImage: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Tournament venue location is required'],
      trim: true,
    },
    weightCategory: {
      type: String,
      required: [true, 'Weight category is required'],
      trim: true,
    },
    mapAddress: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function (this: any, value: Date) {
          return !this.endDate || value < this.endDate;
        },
        message: 'Start date must be before the end date',
      },
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
      validate: {
        validator: function (this: any, value: Date) {
          return !this.startDate || value < this.startDate;
        },
        message: 'Registration deadline must be before the tournament starts',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
        message: '{VALUE} is not a valid tournament status',
      },
      default: 'DRAFT',
      required: true,
      index: true,
    },
    entryFee: {
      type: Number,
      default: 0,
      min: [0, 'Entry fee cannot be negative'],
    },
    prizePool: {
      type: Number,
      default: 0,
      min: [0, 'Prize pool cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compiles the model globally or uses the cached model
export const Tournament: Model<ITournament> = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);
