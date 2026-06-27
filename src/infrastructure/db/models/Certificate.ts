import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICertificate extends Document {
  athleteId: Types.ObjectId;
  tournamentId: Types.ObjectId;
  categoryId: Types.ObjectId;
  rank: number;
  certificateUrl: string;
  signatureUrl?: string;
  issuedAt: Date;
}

export const CertificateSchema = new Schema<ICertificate>(
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID reference is required'],
      index: true,
    },
    rank: {
      type: Number,
      required: [true, 'Achieved rank placement is required'],
      min: [1, 'Rank must be a positive integer'],
    },
    certificateUrl: {
      type: String,
      required: [true, 'Certificate document URL is required'],
      trim: true,
    },
    signatureUrl: {
      type: String,
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false, // Explicitly false as certificates have an issuedAt field that serves as creation time
  }
);

// Compound index to quickly fetch all certificates an athlete has won across tournaments
CertificateSchema.index({ athleteId: 1, tournamentId: 1 });

// Compiles the model globally or uses the cached model
export const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
