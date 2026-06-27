import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPayment extends Document {
  athleteId: Types.ObjectId;
  tournamentId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  gateway: string;
  transactionId: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = new Schema<IPayment>(
  {
    athleteId: {
      type: Schema.Types.ObjectId,
      ref: 'Athlete',
      required: [true, 'Athlete ID reference is required'],
      index: true,
    },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: [true, 'Tournament ID reference is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
        message: '{VALUE} is not a supported payment status',
      },
      default: 'PENDING',
      required: true,
    },
    gateway: {
      type: String,
      required: [true, 'Payment gateway provider name is required'],
      trim: true,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction reference ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for athlete's tournament registration payments
PaymentSchema.index({ athleteId: 1, tournamentId: 1 });

// Compiles the model globally or uses the cached model
export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
