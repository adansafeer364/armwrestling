import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMatch extends Document {
  tournamentId: Types.ObjectId;
  categoryId: Types.ObjectId;
  matchNumber: number;
  competitor1Id?: Types.ObjectId;
  competitor2Id?: Types.ObjectId;
  round: number;
  bracketType: 'KNOCKOUT';
  status: 'PENDING' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'BYE' | 'CANCELLED';
  winnerId?: Types.ObjectId;
  loserId?: Types.ObjectId;
  score?: string;
  refereeId?: Types.ObjectId;
  tableNumber?: number;
  scheduledTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const MatchSchema = new Schema<IMatch>(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    matchNumber: {
      type: Number,
      required: true,
    },
    competitor1Id: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      index: true,
    },
    competitor2Id: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      index: true,
    },
    round: {
      type: Number,
      required: true,
    },
    bracketType: {
      type: String,
      enum: ['KNOCKOUT'],
      default: 'KNOCKOUT',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'BYE', 'CANCELLED'],
      default: 'PENDING',
      required: true,
      index: true,
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
    },
    loserId: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
    },
    score: {
      type: String,
      trim: true,
    },
    refereeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    tableNumber: {
      type: Number,
    },
    scheduledTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ tournamentId: 1, categoryId: 1, round: 1 });
MatchSchema.index({ competitor1Id: 1, competitor2Id: 1 });

export const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
