import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRegistration extends Document {
  registrationId: string;
  tournamentId?: mongoose.Types.ObjectId;
  fullName: string;
  fatherName: string;
  phone: string;
  email: string;
  age: number;
  city: string;
  clubName?: string;
  weight: number;
  hand: 'Right' | 'Left' | 'Both';
  profilePictureUrl?: string;
  paymentScreenshotUrl: string;
  paymentAccountNumber: string;
  paymentAccountName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    registrationId: {
      type: String,
      required: [true, 'Registration ID is required'],
      unique: true,
      index: true,
    },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, 'Father Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    clubName: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
    },
    hand: {
      type: String,
      enum: ['Right', 'Left', 'Both'],
      required: [true, 'Hand selection is required'],
    },
    profilePictureUrl: {
      type: String,
    },
    paymentScreenshotUrl: {
      type: String,
      required: [true, 'Payment Screenshot is required'],
    },
    paymentAccountNumber: {
      type: String,
      required: [true, 'Account number used for payment is required'],
      trim: true,
    },
    paymentAccountName: {
      type: String,
      required: [true, 'Account name used for payment is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      required: true,
      index: true,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
export const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
