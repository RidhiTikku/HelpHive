import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  ESCROWED = 'escrowed',
  RELEASED = 'released',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed'
}

export enum PaymentMethod {
  CRYPTO = 'crypto',
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer'
}

export interface IPayment extends Document {
  task: mongoose.Types.ObjectId;
  payer: mongoose.Types.ObjectId; // Task poster
  payee: mongoose.Types.ObjectId; // Helper
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  
  // Blockchain/Escrow related
  blockchainTxHash?: string;
  escrowContractAddress?: string;
  escrowTxHash?: string;
  releaseTxHash?: string;
  
  // Payment processor details
  processorId?: string; // Stripe, PayPal, etc.
  processorFee?: number;
  
  // Platform fee
  platformFee: number;
  platformFeePercentage: number;
  
  // Timing
  escrowedAt?: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  
  // Additional data
  memo?: string;
  refundReason?: string;
  disputeReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required']
  },
  payer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payer reference is required']
  },
  payee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payee reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'ETH', 'USDC', 'BTC'],
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  
  // Blockchain/Escrow fields
  blockchainTxHash: {
    type: String,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash']
  },
  escrowContractAddress: {
    type: String,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address']
  },
  escrowTxHash: {
    type: String,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid escrow transaction hash']
  },
  releaseTxHash: {
    type: String,
    match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid release transaction hash']
  },
  
  // Payment processor
  processorId: String,
  processorFee: {
    type: Number,
    min: [0, 'Processor fee cannot be negative'],
    default: 0
  },
  
  // Platform fee
  platformFee: {
    type: Number,
    required: [true, 'Platform fee is required'],
    min: [0, 'Platform fee cannot be negative']
  },
  platformFeePercentage: {
    type: Number,
    required: [true, 'Platform fee percentage is required'],
    min: [0, 'Fee percentage cannot be negative'],
    max: [100, 'Fee percentage cannot exceed 100%']
  },
  
  // Timing
  escrowedAt: Date,
  releasedAt: Date,
  refundedAt: Date,
  
  // Additional fields
  memo: {
    type: String,
    maxlength: [500, 'Memo cannot exceed 500 characters']
  },
  refundReason: {
    type: String,
    maxlength: [500, 'Refund reason cannot exceed 500 characters']
  },
  disputeReason: {
    type: String,
    maxlength: [1000, 'Dispute reason cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
PaymentSchema.index({ task: 1 });
PaymentSchema.index({ payer: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ payee: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ blockchainTxHash: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
