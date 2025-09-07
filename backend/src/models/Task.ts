import mongoose, { Document, Schema } from 'mongoose';

export enum TaskStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum TaskCategory {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  CARPENTRY = 'carpentry',
  CLEANING = 'cleaning',
  TECH_SUPPORT = 'tech_support',
  APPLIANCE_REPAIR = 'appliance_repair',
  GARDENING = 'gardening',
  AUTOMOTIVE = 'automotive',
  TUTORING = 'tutoring',
  DELIVERY = 'delivery',
  OTHER = 'other'
}

export interface ITask extends Document {
  title: string;
  description: string;
  category: TaskCategory;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  estimatedDuration: number; // in hours
  requiredSkills: string[];
  images?: string[];
  status: TaskStatus;
  poster: mongoose.Types.ObjectId;
  assignedHelper?: mongoose.Types.ObjectId;
  acceptedBid?: mongoose.Types.ObjectId;
  applications: mongoose.Types.ObjectId[];
  scheduledFor?: Date;
  completedAt?: Date;
  isRemote: boolean;
  contactPreference: 'chat' | 'phone' | 'email';
  blockchainTxHash?: string;
  escrowContractAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    trim: true
  },
  category: {
    type: String,
    enum: Object.values(TaskCategory),
    required: [true, 'Task category is required']
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'ETH', 'USDC']
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      index: '2dsphere'
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Estimated duration is required'],
    min: [0.5, 'Duration must be at least 0.5 hours']
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String, // URLs to stored images
  }],
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.OPEN
  },
  poster: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Poster is required']
  },
  assignedHelper: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedBid: {
    type: Schema.Types.ObjectId,
    ref: 'Bid'
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  scheduledFor: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  contactPreference: {
    type: String,
    enum: ['chat', 'phone', 'email'],
    default: 'chat'
  },
  blockchainTxHash: {
    type: String,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash']
  },
  escrowContractAddress: {
    type: String,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address']
  }
}, {
  timestamps: true
});

// Index for geospatial queries
TaskSchema.index({ 'location.coordinates': '2dsphere' });

// Index for efficient searching
TaskSchema.index({ category: 1, status: 1, createdAt: -1 });
TaskSchema.index({ poster: 1, status: 1 });
TaskSchema.index({ assignedHelper: 1, status: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
