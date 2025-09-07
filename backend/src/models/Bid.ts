import mongoose, { Document, Schema } from 'mongoose';

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface IBid extends Document {
  task: mongoose.Types.ObjectId;
  helper: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  message: string;
  estimatedDuration: number; // in hours
  availabilityStart: Date;
  availabilityEnd: Date;
  status: BidStatus;
  isQuickAccept: boolean; // If helper is willing to start immediately
  proposedSchedule?: Date;
  attachments?: string[]; // URLs to files/images
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema<IBid>({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required']
  },
  helper: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Helper reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'ETH', 'USDC'],
    default: 'USD'
  },
  message: {
    type: String,
    required: [true, 'Bid message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Estimated duration is required'],
    min: [0.5, 'Duration must be at least 0.5 hours']
  },
  availabilityStart: {
    type: Date,
    required: [true, 'Availability start is required']
  },
  availabilityEnd: {
    type: Date,
    required: [true, 'Availability end is required']
  },
  status: {
    type: String,
    enum: Object.values(BidStatus),
    default: BidStatus.PENDING
  },
  isQuickAccept: {
    type: Boolean,
    default: false
  },
  proposedSchedule: {
    type: Date
  },
  attachments: [{
    type: String // URLs to stored files/images
  }]
}, {
  timestamps: true
});

// Compound index to prevent duplicate bids from same helper on same task
BidSchema.index({ task: 1, helper: 1 }, { unique: true });

// Index for efficient queries
BidSchema.index({ task: 1, status: 1, createdAt: -1 });
BidSchema.index({ helper: 1, status: 1, createdAt: -1 });

export default mongoose.model<IBid>('Bid', BidSchema);
