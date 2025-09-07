import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  task: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId; // User giving the rating
  reviewee: mongoose.Types.ObjectId; // User being rated
  rating: number; // 1-5 stars
  review?: string;
  categories: {
    communication: number;
    quality: number;
    timeliness: number;
    professionalism: number;
  };
  isHelper: boolean; // true if reviewee is helper, false if task poster
  isPublic: boolean;
  blockchainTxHash?: string; // For immutable reviews on blockchain
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required']
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer reference is required']
  },
  reviewee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
    trim: true
  },
  categories: {
    communication: {
      type: Number,
      required: [true, 'Communication rating is required'],
      min: [1, 'Communication rating must be at least 1'],
      max: [5, 'Communication rating cannot exceed 5']
    },
    quality: {
      type: Number,
      required: [true, 'Quality rating is required'],
      min: [1, 'Quality rating must be at least 1'],
      max: [5, 'Quality rating cannot exceed 5']
    },
    timeliness: {
      type: Number,
      required: [true, 'Timeliness rating is required'],
      min: [1, 'Timeliness rating must be at least 1'],
      max: [5, 'Timeliness rating cannot exceed 5']
    },
    professionalism: {
      type: Number,
      required: [true, 'Professionalism rating is required'],
      min: [1, 'Professionalism rating must be at least 1'],
      max: [5, 'Professionalism rating cannot exceed 5']
    }
  },
  isHelper: {
    type: Boolean,
    required: [true, 'Helper flag is required']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  blockchainTxHash: {
    type: String,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate ratings for same task
RatingSchema.index({ task: 1, reviewer: 1 }, { unique: true });

// Index for efficient queries
RatingSchema.index({ reviewee: 1, isPublic: 1, createdAt: -1 });
RatingSchema.index({ reviewer: 1, createdAt: -1 });
RatingSchema.index({ rating: 1 });

// Virtual for average category rating
RatingSchema.virtual('categoryAverage').get(function() {
  const { communication, quality, timeliness, professionalism } = this.categories;
  return (communication + quality + timeliness + professionalism) / 4;
});

export default mongoose.model<IRating>('Rating', RatingSchema);
