import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IFoul {
  athleteId: Types.ObjectId;
  type: 'ELBOW_FOUL' | 'FALSE_START' | 'STRAP_FOUL' | 'SLIP_FOUL' | 'WARNING' | 'OTHER';
  round: number;
}

export interface IResult extends Document {
  matchId: Types.ObjectId;
  winnerId: Types.ObjectId;
  loserId: Types.ObjectId;
  score: string;
  fouls: IFoul[];
  refereeNotes?: string;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FoulSchema = new Schema<IFoul>({
  athleteId: {
    type: Schema.Types.ObjectId,
    ref: 'Athlete',
    required: [true, 'Athlete ID is required for foul logs'],
  },
  type: {
    type: String,
    enum: {
      values: ['ELBOW_FOUL', 'FALSE_START', 'STRAP_FOUL', 'SLIP_FOUL', 'WARNING', 'OTHER'],
      message: '{VALUE} is not a valid foul classification',
    },
    required: true,
  },
  round: {
    type: Number,
    required: [true, 'Round number is required for foul logs'],
    min: [1, 'Round number must be positive'],
  },
});

export const ResultSchema = new Schema<IResult>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Match ID reference is required'],
      unique: true,
      index: true,
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Athlete',
      required: [true, 'Winner Athlete reference is required'],
    },
    loserId: {
      type: Schema.Types.ObjectId,
      ref: 'Athlete',
      required: [true, 'Loser Athlete reference is required'],
    },
    score: {
      type: String,
      required: [true, 'Match result score is required'],
      trim: true,
    },
    fouls: {
      type: [FoulSchema],
      default: [],
    },
    refereeNotes: {
      type: String,
      trim: true,
    },
    durationSeconds: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compiles the model globally or uses the cached model
export const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
