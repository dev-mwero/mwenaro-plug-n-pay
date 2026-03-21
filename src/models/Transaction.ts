import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  userId: mongoose.Types.ObjectId;
  apiKeyId: mongoose.Types.ObjectId;
  type: "STK_PUSH" | "B2C" | "C2B" | "C2C" | "TRANSACTION_STATUS" | "ACCOUNT_BALANCE";
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount: number;
  currency: string;
  phoneNumber?: string;
  mpesaReceiptNumber?: string;
  errorMessage?: string;
  rawPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true }, // The UUID used by SQLite
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  apiKeyId: { type: Schema.Types.ObjectId, ref: 'ApiKey', required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  phoneNumber: { type: String },
  mpesaReceiptNumber: { type: String },
  errorMessage: { type: String },
  rawPayload: { type: Schema.Types.Mixed }
}, { timestamps: true });

// Indexes for fast dashboard querying
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ transactionId: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
